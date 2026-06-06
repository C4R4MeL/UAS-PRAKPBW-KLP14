import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handler untuk mengambil riwayat skrining (GET /api/skrining)
export async function GET() {
  try {
    const history = await prisma.skrining.findMany({
      orderBy: {
        createdAt: "desc",
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

    // Kriteria 1: Tekanan darah diastolik >= 90 mmHg atau sistolik >= 160 mmHg
    if (diasNum >= 90 || sysNum >= 160) {
      triggeredCriteria.push(
        `Tekanan darah tinggi (Sistolik: ${sysNum} mmHg / Diastolik: ${diasNum} mmHg, batas aman <160/<90 mmHg)`
      );
    }

    // Kriteria 2: Usia ibu >= 35 tahun
    if (ageNum >= 35) {
      triggeredCriteria.push(`Usia ibu berisiko tinggi (Usia: ${ageNum} tahun, batas aman <35 tahun)`);
    }

    // Kriteria 3: IMT sebelum hamil > 30 (Menggunakan IMT yang disubmit)
    if (bmiNum > 30) {
      triggeredCriteria.push(`Indeks Massa Tubuh (IMT) berlebih/obesitas (IMT: ${bmiNum}, batas aman ≤30)`);
    }

    // Kriteria 4: Merupakan kehamilan pertama (nulipara) ATAU jarak kehamilan sebelumnya > 10 tahun
    if (firstPreg) {
      triggeredCriteria.push("Kehamilan pertama (nulipara) merupakan faktor risiko preeklampsia");
    } else if (intervalNum !== null && intervalNum > 10) {
      triggeredCriteria.push(
        `Jarak kehamilan sebelumnya terlalu jauh (Jarak: ${intervalNum} tahun, batas aman ≤10 tahun)`
      );
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
