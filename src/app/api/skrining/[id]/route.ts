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

// Handler untuk mengupdate data skrining (PUT /api/skrining/[id])
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const kader = await verifyAuth();
    if (!kader) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Pastikan data skrining ada
    const existing = await prisma.skrining.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Data skrining tidak ditemukan." },
        { status: 404 }
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

    // Jalankan ulang logika Sistem Pakar
    const triggeredCriteria: string[] = [];

    if (diasNum >= 90 || sysNum >= 140) {
      triggeredCriteria.push("Tekanan Darah Tinggi (Sistolik ≥ 140 atau Diastolik ≥ 90)");
    }

    if (ageNum >= 35) {
      triggeredCriteria.push("Usia Ibu Hamil Rentan (>35 tahun)");
    }

    if (bmiNum > 30) {
      triggeredCriteria.push("Obesitas Gestasional (IMT > 30)");
    }

    if (firstPreg) {
      triggeredCriteria.push("Kehamilan Pertama (Nulipara)");
    } else if (intervalNum !== null && intervalNum > 10) {
      triggeredCriteria.push("Jarak Kehamilan > 10 Tahun");
    }

    const isHighRisk = triggeredCriteria.length > 0;
    const statusRisiko = isHighRisk ? "Risiko Tinggi" : "Aman";
    const kriteriaPemicu = isHighRisk ? triggeredCriteria.join("; ") : "Tidak ada kriteria risiko terpenuhi";

    // Update di database
    const updatedScreening = await prisma.skrining.update({
      where: { id },
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
      message: "Data skrining berhasil diperbarui.",
      data: updatedScreening,
    });
  } catch (error: any) {
    console.error("Error updating screening record:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memperbarui data skrining.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Handler untuk menghapus data skrining (DELETE /api/skrining/[id])
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const kader = await verifyAuth();
    if (!kader) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Pastikan data skrining ada
    const existing = await prisma.skrining.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Data skrining tidak ditemukan." },
        { status: 404 }
      );
    }

    // Hapus dari database
    await prisma.skrining.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Data skrining berhasil dihapus.",
    });
  } catch (error: any) {
    console.error("Error deleting screening record:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menghapus data skrining.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
