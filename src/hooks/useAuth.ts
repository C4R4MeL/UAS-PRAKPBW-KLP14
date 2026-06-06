"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/types";

export function useAuth() {
  // State Autentikasi
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authNamaLengkap, setAuthNamaLengkap] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Periksa sesi aktif pada saat mount
  const checkSession = async () => {
    try {
      setCheckingSession(true);
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Gagal memverifikasi sesi:", error);
      setCurrentUser(null);
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Submit Handler untuk Login & Registrasi
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthSubmitting(true);

    try {
      const isLogin = authTab === "login";
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { username: authUsername, password: authPassword }
        : { username: authUsername, namaLengkap: authNamaLengkap, password: authPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          setCurrentUser(data.data);
          setAuthUsername("");
          setAuthPassword("");
        } else {
          setAuthSuccess(data.message || "Registrasi berhasil! Silakan login.");
          setAuthTab("login");
          setAuthPassword("");
          setAuthNamaLengkap("");
        }
      } else {
        setAuthError(data.error || "Gagal memproses permintaan.");
      }
    } catch (error) {
      console.error("Error submitting auth:", error);
      setAuthError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handler untuk keluar sesi (Logout)
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return {
    currentUser,
    checkingSession,
    authTab,
    setAuthTab,
    authUsername,
    setAuthUsername,
    authPassword,
    setAuthPassword,
    authNamaLengkap,
    setAuthNamaLengkap,
    authError,
    setAuthError,
    authSuccess,
    setAuthSuccess,
    authSubmitting,
    handleAuthSubmit,
    handleLogout,
  };
}
