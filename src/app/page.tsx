"use client";

import React, { useState, useEffect } from "react";

// Struktur data Skrining
interface Skrining {
  id: string;
  namaIbu: string;
  usia: number;
  sistolik: number;
  diastolik: number;
  isFirstPregnancy: boolean;
  jarakKehamilan: number | null;
  imt: number;
  statusRisiko: string;
  kriteriaPemicu: string;
  createdAt: string;
  kader?: {
    namaLengkap: string;
  };
}

interface User {
  id: string;
  username: string;
  namaLengkap: string;
}

export default function Home() {
  // Sesi & Autentikasi States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authNamaLengkap, setAuthNamaLengkap] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Aplikasi States
  const [activeTab, setActiveTab] = useState<"dashboard" | "form">("dashboard");
  const [history, setHistory] = useState<Skrining[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultData, setResultData] = useState<Skrining | null>(null);

  // Form States
  const [namaIbu, setNamaIbu] = useState("");
  const [usia, setUsia] = useState("");
  const [sistolik, setSistolik] = useState("");
  const [diastolik, setDiastolik] = useState("");
  const [isFirstPregnancy, setIsFirstPregnancy] = useState(true);
  const [jarakKehamilan, setJarakKehamilan] = useState("");
  const [imt, setImt] = useState("");

  // BMI Helper States
  const [showBmiHelper, setShowBmiHelper] = useState(false);
  const [beratBadan, setBeratBadan] = useState("");
  const [tinggiBadan, setTinggiBadan] = useState("");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

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

  // Memuat data riwayat skrining (hanya jika sudah login)
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch("/api/skrining");
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchHistory();
    }
  }, [currentUser]);

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
        setHistory([]);
        setResultData(null);
      }
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  // Submit handler untuk skrining baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        namaIbu,
        usia: parseInt(usia),
        sistolik: parseInt(sistolik),
        diastolik: parseInt(diastolik),
        isFirstPregnancy,
        jarakKehamilan: isFirstPregnancy ? null : parseInt(jarakKehamilan),
        imt: parseFloat(imt),
      };

      const res = await fetch("/api/skrining", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setResultData(data.data);
        fetchHistory();
        resetForm();
      } else {
        alert("Gagal melakukan skrining: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setNamaIbu("");
    setUsia("");
    setSistolik("");
    setDiastolik("");
    setIsFirstPregnancy(true);
    setJarakKehamilan("");
    setImt("");
    setShowBmiHelper(false);
    setBeratBadan("");
    setTinggiBadan("");
  };

  const hitungIMT = () => {
    const bb = parseFloat(beratBadan);
    const tb = parseFloat(tinggiBadan) / 100; // ubah ke meter
    if (!isNaN(bb) && !isNaN(tb) && tb > 0) {
      const calculatedImt = bb / (tb * tb);
      setImt(calculatedImt.toFixed(1));
      setShowBmiHelper(false);
      setBeratBadan("");
      setTinggiBadan("");
    } else {
      alert("Masukkan berat badan (kg) dan tinggi badan (cm) yang valid.");
    }
  };

  const kirimWhatsApp = (data: Skrining) => {
    const isRisiko = data.statusRisiko === "Risiko Tinggi";
    const header = isRisiko 
      ? "🚨 *PEMBERITAHUAN SKRINING PREEKLAMPSIA* 🚨" 
      : "ℹ️ *LAPORAN SKRINING PREEKLAMPSIA* ℹ️";
      
    const statusText = isRisiko ? "🔴 *RISIKO TINGGI*" : "🟢 *AMAN*";
    
    const rekomendasi = isRisiko 
      ? "*Rujukan:* Segera rujuk ke Puskesmas / Bidan Desa terdekat." 
      : "*Saran:* Lakukan kontrol kehamilan rutin ke Posyandu.";

    const pemicuSection = isRisiko 
      ? `\n• *Pemicu:* ${data.kriteriaPemicu.replace(/;/g, ", ")}`
      : "";

    const text = `${header}
*MomCare Connect*

• *Nama:* ${data.namaIbu} (${data.usia} th)
• *Hasil:* ${statusText}
• *Kondisi:* TD ${data.sistolik}/${data.diastolik} mmHg, IMT ${data.imt}${pemicuSection}

${rekomendasi}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Hitung statistik
  const totalSkrining = history.length;
  const totalRisikoTinggi = history.filter((item) => item.statusRisiko === "Risiko Tinggi").length;
  const totalAman = history.filter((item) => item.statusRisiko === "Aman").length;

  // Hitung detail statistik untuk visualisasi dasbor
  let countHipertensi = 0;
  let countUsia = 0;
  let countIMT = 0;
  let countGravida = 0;
  let countJarak = 0;

  let ageUnder20 = 0;
  let age20To34 = 0;
  let age35AndOver = 0;

  history.forEach((item) => {
    // Kelompok Usia
    if (item.usia < 20) ageUnder20++;
    else if (item.usia <= 34) age20To34++;
    else age35AndOver++;

    // Pemicu Risiko (Hanya jika berstatus Risiko Tinggi)
    if (item.statusRisiko === "Risiko Tinggi") {
      if (item.sistolik >= 160 || item.diastolik >= 90) countHipertensi++;
      if (item.usia >= 35) countUsia++;
      if (item.imt > 30) countIMT++;
      if (item.isFirstPregnancy) countGravida++;
      if (!item.isFirstPregnancy && item.jarakKehamilan !== null && item.jarakKehamilan > 10) countJarak++;
    }
  });

  const pctRisikoTinggi = totalSkrining > 0 ? Math.round((totalRisikoTinggi / totalSkrining) * 100) : 0;
  const pctAman = totalSkrining > 0 ? Math.round((totalAman / totalSkrining) * 100) : 0;

  // Filter history berdasarkan pencarian dan filter risiko
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.namaIbu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "All" || item.statusRisiko === riskFilter;
    return matchesSearch && matchesRisk;
  });

  // Tampilan Loading Awal Sesi
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-slate-50 to-violet-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-500 animate-pulse">Memeriksa sesi login...</p>
      </div>
    );
  }

  // Tampilan Portal Login & Registrasi
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-600 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {/* Latar Belakang Lingkaran Blur */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative z-10 animate-scaleUp">
          
          {/* Header Portal */}
          <div className="p-6 text-center bg-slate-900 text-white flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg mb-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight">MomCare Connect</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
              Portal Kader Kesehatan Desa
            </p>
          </div>

          {/* Form Container */}
          <div className="p-6 sm:p-8">
            {/* Toggle Tab */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthTab("login");
                  setAuthError("");
                  setAuthSuccess("");
                }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                  authTab === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Masuk Sesi
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab("register");
                  setAuthError("");
                  setAuthSuccess("");
                }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                  authTab === "register"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Daftar Akun
              </button>
            </div>

            {/* Error & Success Alert */}
            {authError && (
              <div className="p-3 mb-4 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-medium flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="p-3 mb-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-600 font-medium flex items-center space-x-2 animate-fadeIn">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Nama Lengkap (Hanya saat Register) */}
              {authTab === "register" && (
                <div className="space-y-1.5 animate-slideDown">
                  <label className="text-xs font-bold text-slate-700">Nama Lengkap Kader</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bidan Siti Aminah"
                    value={authNamaLengkap}
                    onChange={(e) => setAuthNamaLengkap(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: sitiaminah"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 mt-2 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:opacity-90 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-200 hover:shadow-none transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {authSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>{authTab === "login" ? "Masuk Aplikasi" : "Daftar Akun Baru"}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan Dashboard Utama (Hanya jika sudah login)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white pb-12">
      {/* Header Premium */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-rose-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                MomCare Connect
              </h1>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Preeclampsia Screening System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Info Kader */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-slate-700">Halo, {currentUser.namaLengkap}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Kader Desa Aktif</span>
            </div>

            {/* Switch Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setResultData(null);
                }}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "dashboard"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path>
                </svg>
                <span className="hidden sm:inline">Dasbor</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("form");
                  setResultData(null);
                }}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "form"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                </svg>
                <span className="hidden sm:inline">Skrining Baru</span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Keluar Sesi"
              className="p-2 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Banner Selamat Datang */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-rose-100 mb-8 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-7.682-7.682a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Aplikasi Kader Kesehatan Desa
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-3 leading-tight">
              Deteksi Dini Risiko Preeklampsia untuk Keselamatan Ibu & Bayi
            </h2>
            <p className="text-sm md:text-base text-rose-50/90 mt-2 font-medium">
              Selamat bekerja, **{currentUser.namaLengkap}**. Deteksi dini risiko preeklampsia secara cepat dan bagikan laporan ke Bidan Desa.
            </p>
          </div>
        </div>

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Widget Ringkasan Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Card Total Skrining */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center space-x-5 hover:translate-y-[-2px] transition-all duration-300">
                <div className="p-4 rounded-xl bg-violet-50 text-violet-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">Total Skrining</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">{totalSkrining}</h3>
                </div>
              </div>

              {/* Card Risiko Tinggi */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center space-x-5 hover:translate-y-[-2px] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50/30 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="p-4 rounded-xl bg-rose-50 text-rose-600 relative z-10">
                  <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-slate-400">Risiko Tinggi</p>
                  <h3 className="text-3xl font-black text-rose-600 mt-1">{totalRisikoTinggi}</h3>
                </div>
              </div>

              {/* Card Aman */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center space-x-5 hover:translate-y-[-2px] transition-all duration-300">
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">Aman</p>
                  <h3 className="text-3xl font-black text-emerald-600 mt-1">{totalAman}</h3>
                </div>
              </div>
            </div>

            {/* Analisis & Statistik Deteksi Dini */}
            {totalSkrining > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                {/* Proporsi Hasil (Donut Chart SVG) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between items-center min-h-[300px]">
                  <div className="w-full text-left">
                    <h4 className="text-sm font-bold text-slate-800">Proporsi Hasil Skrining</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Persentase status risiko pasien</p>
                  </div>
                  
                  {/* SVG Donut Chart */}
                  <div className="relative w-36 h-36 flex items-center justify-center my-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Background circle */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                      />
                      {/* Aman Circle (Emerald) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDashoffset={0}
                        strokeDasharray={`${314.16 * (pctAman / 100)} 314.16`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      {/* Risiko Tinggi Circle (Rose) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke="#f43f5e"
                        strokeWidth="12"
                        strokeDasharray={`${314.16 * (pctRisikoTinggi / 100)} 314.16`}
                        strokeDashoffset={-314.16 * (pctAman / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-slate-800">{totalSkrining}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pasien</span>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-center gap-6 mt-2 text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-600">Aman ({pctAman}%)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="text-slate-600">Risiko ({pctRisikoTinggi}%)</span>
                    </div>
                  </div>
                </div>

                {/* Pemicu Risiko Terbanyak (Progress Bars) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[300px]">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Faktor Risiko Terbanyak</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Faktor pemicu risiko tinggi terdeteksi</p>
                  </div>
                  
                  <div className="space-y-2.5 my-3">
                    {/* Faktor 1: Hipertensi */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Tekanan Darah Tinggi</span>
                        <span className="text-rose-500 font-semibold">{countHipertensi} Kasus</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${totalRisikoTinggi > 0 ? (countHipertensi / totalRisikoTinggi) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Faktor 2: Usia Berisiko */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Usia Ibu ≥35 Tahun</span>
                        <span className="text-rose-500 font-semibold">{countUsia} Kasus</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${totalRisikoTinggi > 0 ? (countUsia / totalRisikoTinggi) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Faktor 3: Obesitas */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>IMT Obesitas (&gt;30)</span>
                        <span className="text-rose-500 font-semibold">{countIMT} Kasus</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${totalRisikoTinggi > 0 ? (countIMT / totalRisikoTinggi) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Faktor 4: Kehamilan Pertama */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Kehamilan Pertama</span>
                        <span className="text-rose-500 font-semibold">{countGravida} Kasus</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${totalRisikoTinggi > 0 ? (countGravida / totalRisikoTinggi) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Faktor 5: Jarak Kehamilan */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Jarak Kehamilan &gt;10 Tahun</span>
                        <span className="text-rose-500 font-semibold">{countJarak} Kasus</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-1000"
                          style={{ width: `${totalRisikoTinggi > 0 ? (countJarak / totalRisikoTinggi) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distribusi Kelompok Usia (Horizontal Bar Chart) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[300px]">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Distribusi Usia Ibu</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Persebaran umur pasien yang diperiksa</p>
                  </div>
                  
                  <div className="space-y-4 my-3">
                    {/* Kelompok 1: Sangat Muda (<20) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                          <span>Remaja (&lt;20 Th)</span>
                        </span>
                        <span>{ageUnder20} Pasien ({totalSkrining > 0 ? Math.round((ageUnder20 / totalSkrining) * 100) : 0}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg transition-all duration-1000"
                          style={{ width: `${totalSkrining > 0 ? (ageUnder20 / totalSkrining) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Kelompok 2: Usia Ideal (20-34) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>Ideal (20-34 Th)</span>
                        </span>
                        <span>{age20To34} Pasien ({totalSkrining > 0 ? Math.round((age20To34 / totalSkrining) * 100) : 0}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg transition-all duration-1000"
                          style={{ width: `${totalSkrining > 0 ? (age20To34 / totalSkrining) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Kelompok 3: Berisiko (>=35) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                          <span>Berisiko (≥35 Th)</span>
                        </span>
                        <span>{age35AndOver} Pasien ({totalSkrining > 0 ? Math.round((age35AndOver / totalSkrining) * 100) : 0}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-lg transition-all duration-1000"
                          style={{ width: `${totalSkrining > 0 ? (age35AndOver / totalSkrining) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List & Riwayat Tabel */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Riwayat Skrining Ibu Hamil</h3>
                  <p className="text-sm text-slate-400">Daftar pemeriksaan preeklampsia oleh kader desa</p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setActiveTab("form")}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-100 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Skrining Baru</span>
                  </button>
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari nama ibu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>

                  {/* Filter Dropdown */}
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent cursor-pointer transition-all"
                  >
                    <option value="All">Semua Hasil</option>
                    <option value="Risiko Tinggi">Risiko Tinggi</option>
                    <option value="Aman">Aman</option>
                  </select>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                {loadingHistory ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-slate-500">Memuat data dari database...</p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m4.586-1.586a1 1 0 011.414 0L12 11.586l1.293-1.293a1 1 0 111.414 1.414L13.414 13l1.293 1.293a1 1 0 01-1.414 1.414L12 14.414l-1.293 1.293a1 1 0 01-1.414-1.414L10.586 13l-1.293-1.293a1 1 0 010-1.414z"></path>
                      </svg>
                    </div>
                    <h4 className="text-slate-700 font-bold">Tidak ada riwayat ditemukan</h4>
                    <p className="text-sm text-slate-400 mt-1 max-w-sm">
                      Mulai lakukan skrining baru untuk melihat riwayat data ibu hamil di sini.
                    </p>
                    <button
                      onClick={() => setActiveTab("form")}
                      className="mt-5 px-5 py-2.5 bg-rose-500 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-200 hover:bg-rose-600 hover:shadow-none transition-all duration-200"
                    >
                      Mulai Skrining Baru
                    </button>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                        <th className="py-4 px-6">Nama Ibu Hamil</th>
                        <th className="py-4 px-4">Usia</th>
                        <th className="py-4 px-4">Tekanan Darah</th>
                        <th className="py-4 px-4">IMT</th>
                        <th className="py-4 px-4">Status Gravida</th>
                        <th className="py-4 px-6">Status Risiko</th>
                        <th className="py-4 px-6">Kader Pemeriksa</th>
                        <th className="py-4 px-6 text-right">Tanggal Skrining</th>
                        <th className="py-4 px-6 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-800">{item.namaIbu}</td>
                          <td className="py-4 px-4">{item.usia} Th</td>
                          <td className="py-4 px-4 font-mono text-slate-700 font-medium">
                            {item.sistolik}/{item.diastolik} <span className="text-[10px] text-slate-400">mmHg</span>
                          </td>
                          <td className="py-4 px-4 font-medium">{item.imt}</td>
                          <td className="py-4 px-4">
                            {item.isFirstPregnancy ? (
                              <span className="text-[11px] bg-sky-50 text-sky-700 font-semibold px-2.5 py-1 rounded-full">
                                Anak Ke-1 (Nulipara)
                              </span>
                            ) : (
                              <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
                                Multipara (Jarak: {item.jarakKehamilan} Th)
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center space-x-1.5 ${
                                item.statusRisiko === "Risiko Tinggi"
                                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.statusRisiko === "Risiko Tinggi" ? "bg-rose-600 animate-pulse" : "bg-emerald-600"
                              }`}></span>
                              <span>{item.statusRisiko}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-600 font-semibold">
                            {item.kader?.namaLengkap || "Sistem"}
                          </td>
                          <td className="py-4 px-6 text-right font-medium text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => kirimWhatsApp(item)}
                              title="Kirim Laporan ke Bidan via WhatsApp"
                              className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-all focus:outline-none inline-flex items-center justify-center shadow-sm"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Screening Form View */}
        {activeTab === "form" && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            
            {/* Form Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
              <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <h3 className="text-xl font-extrabold">Formulir Skrining Deteksi Dini</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Masukkan data ibu hamil dengan cermat untuk menghitung hasil diagnosis status risiko.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                
                {/* Bagian 1: Identitas & Fisik */}
                <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100/80 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>1. Identitas & Data Fisik Ibu</span>
                  </h4>
                  
                  {/* Nama Ibu */}
                  <div className="space-y-1.5">
                    <label htmlFor="namaIbu" className="block text-xs font-semibold text-slate-600">
                      Nama Lengkap Ibu Hamil
                    </label>
                    <input
                      type="text"
                      id="namaIbu"
                      required
                      placeholder="Contoh: Siti Aminah"
                      value={namaIbu}
                      onChange={(e) => setNamaIbu(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Usia */}
                    <div className="space-y-1.5">
                      <label htmlFor="usia" className="block text-xs font-semibold text-slate-600">
                        Usia Ibu (Tahun)
                      </label>
                      <input
                        type="number"
                        id="usia"
                        required
                        min="1"
                        max="100"
                        placeholder="Contoh: 28"
                        value={usia}
                        onChange={(e) => setUsia(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>

                    {/* IMT */}
                    <div className="space-y-1.5 relative">
                      <div className="flex justify-between items-center">
                        <label htmlFor="imt" className="block text-xs font-semibold text-slate-600">
                          IMT Sebelum Hamil
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowBmiHelper(!showBmiHelper)}
                          className="text-[11px] text-rose-500 hover:text-rose-600 font-bold focus:outline-none flex items-center space-x-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                          <span>{showBmiHelper ? "Tutup" : "Kalkulator"}</span>
                        </button>
                      </div>
                      
                      {showBmiHelper ? (
                        <div className="absolute top-full right-0 z-20 mt-2 w-72 p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xl animate-scaleUp">
                          <p className="text-xs font-bold text-slate-600">Hitung IMT dari Berat & Tinggi</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-500">Berat (kg)</label>
                              <input
                                type="number"
                                placeholder="e.g. 60"
                                value={beratBadan}
                                onChange={(e) => setBeratBadan(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-500">Tinggi (cm)</label>
                              <input
                                type="number"
                                placeholder="e.g. 158"
                                value={tinggiBadan}
                                onChange={(e) => setTinggiBadan(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={hitungIMT}
                            className="w-full py-2 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
                          >
                            Hitung & Isi Otomatis
                          </button>
                        </div>
                      ) : (
                        <input
                          type="number"
                          id="imt"
                          required
                          step="0.1"
                          min="10"
                          max="60"
                          placeholder="Contoh: 24.5"
                          value={imt}
                          onChange={(e) => setImt(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
                        />
                      )}
                      {!showBmiHelper && (
                        <p className="text-[10px] text-slate-400 mt-1">
                          *Batas risiko tinggi: IMT &gt; 30.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bagian 2: Tanda-Tanda Vital */}
                <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100/80 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-rose-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span>2. Pengukuran Tekanan Darah</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Sistolik */}
                    <div className="space-y-1.5">
                      <label htmlFor="sistolik" className="block text-xs font-semibold text-slate-600">
                        Sistolik (mmHg)
                      </label>
                      <input
                        type="number"
                        id="sistolik"
                        required
                        min="50"
                        max="250"
                        placeholder="Batas: 160"
                        value={sistolik}
                        onChange={(e) => setSistolik(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm text-center font-bold"
                      />
                    </div>

                    {/* Diastolik */}
                    <div className="space-y-1.5">
                      <label htmlFor="diastolik" className="block text-xs font-semibold text-slate-600">
                        Diastolik (mmHg)
                      </label>
                      <input
                        type="number"
                        id="diastolik"
                        required
                        min="30"
                        max="180"
                        placeholder="Batas: 90"
                        value={diastolik}
                        onChange={(e) => setDiastolik(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm text-center font-bold"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    *Preeklampsia tinggi terpicu jika Sistolik ≥ 160 mmHg ATAU Diastolik ≥ 90 mmHg.
                  </p>
                </div>

                {/* Bagian 3: Riwayat Obstetrik */}
                <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100/80 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>3. Riwayat Obstetrik (Kehamilan)</span>
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-600">
                      Status Gravida (Kehamilan)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setIsFirstPregnancy(true)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isFirstPregnancy
                            ? "border-rose-500 bg-rose-50/30 ring-1 ring-rose-500"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-400">Nulipara</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">Kehamilan Pertama</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsFirstPregnancy(false)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          !isFirstPregnancy
                            ? "border-rose-500 bg-rose-50/30 ring-1 ring-rose-500"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-400">Multipara</span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5">Kehamilan Kedua+</span>
                      </button>
                    </div>
                  </div>

                  {/* Dinamis Tampilkan Jarak Kehamilan */}
                  {!isFirstPregnancy && (
                    <div className="space-y-1.5 pt-1 animate-slideDown">
                      <div className="flex justify-between items-center">
                        <label htmlFor="jarakKehamilan" className="block text-xs font-semibold text-slate-600">
                          Jarak dengan Kehamilan Sebelumnya (Tahun)
                        </label>
                        <span className="text-[10px] text-rose-500 font-bold italic">Batas Aman ≤ 10 Tahun</span>
                      </div>
                      <input
                        type="number"
                        id="jarakKehamilan"
                        required={!isFirstPregnancy}
                        min="0"
                        max="40"
                        placeholder="Contoh: 3"
                        value={jarakKehamilan}
                        onChange={(e) => setJarakKehamilan(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-200 hover:shadow-none transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Memproses Hasil...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                        </svg>
                        <span>Hitung Risiko & Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal / Alert Box Hasil Diagnosis */}
        {resultData && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
              
              {/* Header Box Hasil */}
              <div
                className={`p-6 text-white text-center flex flex-col items-center ${
                  resultData.statusRisiko === "Risiko Tinggi"
                    ? "bg-gradient-to-r from-rose-600 to-pink-600"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600"
                }`}
              >
                {/* Ikon besar */}
                {resultData.statusRisiko === "Risiko Tinggi" ? (
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
                
                <h4 className="text-xs uppercase tracking-widest font-extrabold text-white/80">Hasil Skrining Preeklampsia</h4>
                <h3 className="text-3xl font-black mt-1">{resultData.statusRisiko}</h3>
              </div>

              {/* Detail Data & Diagnosis */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Informasi Pasien Ringkas */}
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Nama Ibu</span>
                    <span className="font-bold text-slate-800">{resultData.namaIbu}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Usia</span>
                    <span className="font-bold text-slate-800">{resultData.usia} Tahun</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Tekanan Darah</span>
                    <span className="font-bold text-slate-800">{resultData.sistolik}/{resultData.diastolik} mmHg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Indeks Massa Tubuh (IMT)</span>
                    <span className="font-bold text-slate-800">{resultData.imt}</span>
                  </div>
                </div>

                {/* Penjelasan Pemicu / Hasil Diagnosis */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kriteria & Analisis Pakar</h5>
                  
                  {resultData.statusRisiko === "Risiko Tinggi" ? (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm text-rose-800 space-y-2">
                      <p className="font-bold">Kriteria risiko yang terdeteksi:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs text-rose-700 font-medium">
                        {resultData.kriteriaPemicu.split("; ").map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-800">
                      <p className="font-medium text-xs">
                        Tidak ada satu pun kriteria risiko preeklampsia yang terdeteksi. Tekanan darah normal, usia ideal, dan berat badan proporsional.
                      </p>
                    </div>
                  )}
                </div>

                {/* Tindakan Medis yang Dianjurkan */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instruksi Tindakan untuk Kader</h5>
                  
                  {resultData.statusRisiko === "Risiko Tinggi" ? (
                    <div className="bg-rose-500 text-white rounded-2xl p-5 shadow-lg shadow-rose-200 flex items-start space-x-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      <div>
                        <p className="text-sm font-black uppercase tracking-wider">RUJUK KE PUSKESMAS / BIDAN DESA</p>
                        <p className="text-xs text-rose-100 mt-1 font-medium leading-relaxed">
                          Segera arahkan ibu hamil untuk melakukan pemeriksaan ke bidan desa atau Puskesmas terdekat dalam waktu 1x24 jam untuk pemantauan klinis lebih lanjut.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-lg flex items-start space-x-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <p className="text-sm font-bold tracking-wider">KONTROL KEHAMILAN RUTIN</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Ingatkan ibu hamil untuk melakukan pemeriksaan kehamilan rutin minimal 6 kali selama masa kehamilan, mengonsumsi vitamin, dan menjaga pola makan sehat.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp Share Button */}
                <button
                  type="button"
                  onClick={() => kirimWhatsApp(resultData)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-colors flex items-center justify-center space-x-2 shadow-md shadow-emerald-100"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  <span>Kirim Laporan ke Bidan (WA)</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setResultData(null);
                    setActiveTab("dashboard");
                  }}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
                >
                  Tutup & Kembali Ke Dasbor
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
