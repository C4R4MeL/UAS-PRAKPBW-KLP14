import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "momcare-connect-super-secret-key-2026";

// GET /api/auth/me - Mengambil profil user yang sedang masuk
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Belum masuk sesi (Unauthorized)." },
        { status: 401 }
      );
    }

    // Verifikasi Token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        username: string;
        namaLengkap: string;
      };

      return NextResponse.json({
        success: true,
        data: {
          id: decoded.id,
          username: decoded.username,
          namaLengkap: decoded.namaLengkap,
        },
      });
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid atau kedaluwarsa." },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Error in auth/me GET:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data sesi." },
      { status: 500 }
    );
  }
}

// POST /api/auth/me - Keluar sesi / Logout (Menghapus cookie token)
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Berhasil keluar sesi (Logout).",
    });

    // Hapus cookie dengan mengatur maxAge = 0
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error in auth/me POST:", error);
    return NextResponse.json(
      { success: false, error: "Gagal keluar sesi." },
      { status: 500 }
    );
  }
}
