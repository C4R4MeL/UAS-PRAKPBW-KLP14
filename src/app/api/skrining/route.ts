import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "momcare-connect-super-secret-key-2026";

// Fungsi pembantu untuk memverifikasi autentikasi kader
async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      namaLengkap: string;
    };
    return decoded;
  } catch (err) {
    return null;
  }
}

// Handler untuk mengambil riwayat skrining (GET /api/skrining)
export async function GET() {
  try {
    const kader = await verifyAuth();
    if (!kader) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const dbKader = await prisma.kader.findUnique({
      where: { id: kader.id },
      select: { posyandu: true },
    });

    if (!dbKader) {
      return NextResponse.json(
        { success: false, error: "Akun kader tidak valid." },
        { status: 401 }
      );
    }

    const history = await prisma.skrining.findMany({
      where: {
        kader: {
          posyandu: dbKader.posyandu,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        kader: {
          select: {
            namaLengkap: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error("Error fetching screening history:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data riwayat skrining.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Handler untuk membuat skrining baru (POST /api/skrining)
export async function POST(request: Request) {
  try {
    const kader = await verifyAuth();
    if (!kader) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      namaIbu,
      usia,
      sistolik,
      diastolik,
      isFirstPregnancy,
      jarakKehamilan,
      imt,
    } = body;

    // Validasi input
    if (!namaIbu || typeof namaIbu !== "string" || namaIbu.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Nama Ibu Hamil wajib diisi." },
        { status: 400 }
      );
    }

    const ageNum = parseInt(usia);
    const sysNum = parseInt(sistolik);
    const diasNum = parseInt(diastolik);
    const bmiNum = parseFloat(imt);
    const firstPreg = !!isFirstPregnancy;
    const intervalNum = jarakKehamilan !== null && jarakKehamilan !== undefined && jarakKehamilan !== "" 
      ? parseInt(jarakKehamilan) 
      : null;

    if (isNaN(ageNum) || ageNum <= 0) {
      return NextResponse.json(
        { success: false, error: "Usia harus berupa angka positif." },
        { status: 400 }
      );
    }

    if (isNaN(sysNum) || sysNum <= 0 || isNaN(diasNum) || diasNum <= 0) {
      return NextResponse.json(
        { success: false, error: "Tekanan darah sistolik dan diastolik harus berupa angka positif." },
        { status: 400 }
      );
    }

    if (isNaN(bmiNum) || bmiNum <= 0) {
      return NextResponse.json(
        { success: false, error: "Indeks Massa Tubuh (IMT) harus berupa angka positif." },
        { status: 400 }
      );
    }

    if (!firstPreg && (intervalNum === null || isNaN(intervalNum) || intervalNum < 0)) {
      return NextResponse.json(
        { success: false, error: "Jarak kehamilan sebelumnya wajib diisi untuk kehamilan kedua atau lebih." },
        { status: 400 }
      );
    }

    // Jalankan logika Sistem Pakar
    const triggeredCriteria: string[] = [];

    // Kriteria 1: Tekanan darah diastolik >= 90 mmHg atau sistolik >= 140 mmHg
    if (diasNum >= 90 || sysNum >= 140) {
      triggeredCriteria.push("Tekanan Darah Tinggi (Sistolik ≥ 140 atau Diastolik ≥ 90)");
    }

    // Kriteria 2: Usia ibu >= 35 tahun
    if (ageNum >= 35) {
      triggeredCriteria.push("Usia Ibu Hamil Rentan (>35 tahun)");
    }

    // Kriteria 3: IMT sebelum hamil > 30 (Menggunakan IMT yang disubmit)
    if (bmiNum > 30) {
      triggeredCriteria.push("Obesitas Gestasional (IMT > 30)");
    }

    // Kriteria 4: Merupakan kehamilan pertama (nulipara) ATAU jarak kehamilan sebelumnya > 10 tahun
    if (firstPreg) {
      triggeredCriteria.push("Kehamilan Pertama (Nulipara)");
    } else if (intervalNum !== null && intervalNum > 10) {
      triggeredCriteria.push("Jarak Kehamilan > 10 Tahun");
    }

    // Klasifikasi status risiko
    const isHighRisk = triggeredCriteria.length > 0;
    const statusRisiko = isHighRisk ? "Risiko Tinggi" : "Aman";
    const kriteriaPemicu = isHighRisk ? triggeredCriteria.join("; ") : "Tidak ada kriteria risiko terpenuhi";

    // Simpan ke database melalui Prisma
    const newScreening = await prisma.skrining.create({
      data: {
        namaIbu: namaIbu.trim(),
        usia: ageNum,
        sistolik: sysNum,
        diastolik: diasNum,
        isFirstPregnancy: firstPreg,
        jarakKehamilan: firstPreg ? null : intervalNum,
        imt: bmiNum,
        statusRisiko,
        kriteriaPemicu,
        kaderId: kader.id, // Kaitkan dengan ID Kader yang sedang login
      },
      include: {
        kader: {
          select: {
            namaLengkap: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data skrining berhasil disimpan.",
      data: newScreening,
    });
  } catch (error: any) {
    console.error("Error creating screening record:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menyimpan data skrining ke database.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
