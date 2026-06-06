import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, namaLengkap, password } = body;

    // Validasi input
    if (!username || typeof username !== "string" || username.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Username wajib diisi." },
        { status: 400 }
      );
    }
    if (!namaLengkap || typeof namaLengkap !== "string" || namaLengkap.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password wajib diisi dan minimal 6 karakter." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // Periksa apakah username sudah terdaftar
    const existingKader = await prisma.kader.findUnique({
      where: {
        username: cleanUsername,
      },
    });

    if (existingKader) {
      return NextResponse.json(
        { success: false, error: "Username sudah digunakan. Silakan pilih username lain." },
        { status: 400 }
      );
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan ke database
    const newKader = await prisma.kader.create({
      data: {
        username: cleanUsername,
        namaLengkap: namaLengkap.trim(),
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi Kader berhasil! Silakan login.",
      data: {
        id: newKader.id,
        username: newKader.username,
        namaLengkap: newKader.namaLengkap,
      },
    });
  } catch (error: any) {
    console.error("Error in Register API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses registrasi.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
