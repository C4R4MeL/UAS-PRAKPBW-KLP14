import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "momcare-connect-super-secret-key-2026";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validasi input
    if (!username || typeof username !== "string" || username.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Username wajib diisi." },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // Cari Kader di database
    const kader = await prisma.kader.findUnique({
      where: {
        username: cleanUsername,
      },
    });

    if (!kader) {
      return NextResponse.json(
        { success: false, error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // Cocokkan password
    const isPasswordValid = await bcrypt.compare(password, kader.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: kader.id, username: kader.username, namaLengkap: kader.namaLengkap },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Kirim respons dengan Cookie HTTP-Only
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil!",
      data: {
        id: kader.id,
        username: kader.username,
        namaLengkap: kader.namaLengkap,
      },
    });

    // Pasang cookie token
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 Hari (dalam detik)
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error in Login API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses login.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
