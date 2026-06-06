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
}

export default function Home() {
  // States
  const [activeTab, setActiveTab] = useState<"dashboard" | "form">("dashboard");
  const [history, setHistory] = useState<Skrining[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
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

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  // Fetch screening history
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
    fetchHistory();
  }, []);

  // Submit handler
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
        // Refresh history
        fetchHistory();
        // Reset form
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
  };

  // Hitung statistik
  const totalSkrining = history.length;
  const totalRisikoTinggi = history.filter((item) => item.statusRisiko === "Risiko Tinggi").length;
  const totalAman = history.filter((item) => item.statusRisiko === "Aman").length;

  // Filter history berdasarkan pencarian dan filter risiko
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.namaIbu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "All" || item.statusRisiko === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white pb-12">
      {/* Header Premium */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-rose-200">
              {/* Logo SVG: Ibu & Anak */}
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
          
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setResultData(null);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path>
              </svg>
              <span>Dasbor</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("form");
                setResultData(null);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "form"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              </svg>
              <span>Skrining Baru</span>
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
              Gunakan alat bantu skrining ini untuk melakukan diagnosis awal preeklampsia pada ibu hamil secara cepat dan akurat berdasarkan parameter tekanan darah, usia, indeks massa tubuh, serta status kehamilan.
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

            {/* List & Riwayat Tabel */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Riwayat Skrining Ibu Hamil</h3>
                  <p className="text-sm text-slate-400">Daftar pemeriksaan preeklampsia oleh kader desa</p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari nama ibu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
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
                        <th className="py-4 px-6">Kriteria Pemicu</th>
                        <th className="py-4 px-6 text-right">Tanggal Skrining</th>
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
                          <td className="py-4 px-6 max-w-xs truncate text-xs text-slate-400" title={item.kriteriaPemicu}>
                            {item.kriteriaPemicu}
                          </td>
                          <td className="py-4 px-6 text-right font-medium text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
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
                
                {/* Input Nama */}
                <div className="space-y-2">
                  <label htmlFor="namaIbu" className="block text-sm font-bold text-slate-700">
                    Nama Lengkap Ibu Hamil
                  </label>
                  <input
                    type="text"
                    id="namaIbu"
                    required
                    placeholder="Contoh: Siti Aminah"
                    value={namaIbu}
                    onChange={(e) => setNamaIbu(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>

                {/* Input Usia & IMT Baris Sejajar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Usia */}
                  <div className="space-y-2">
                    <label htmlFor="usia" className="block text-sm font-bold text-slate-700">
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
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  {/* IMT */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="imt" className="block text-sm font-bold text-slate-700">
                        Indeks Massa Tubuh (IMT) Sebelum Hamil
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium italic">imt &gt; 30 = Obesitas</span>
                    </div>
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
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Tekanan Darah (Sistolik & Diastolik) */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Pengukuran Tekanan Darah</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Sistolik */}
                    <div className="space-y-2">
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
                        className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm text-center font-bold text-slate-800"
                      />
                    </div>

                    {/* Diastolik */}
                    <div className="space-y-2">
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
                        className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm text-center font-bold text-slate-800"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    *Preeklampsia tinggi terpicu jika Sistolik ≥ 160 mmHg ATAU Diastolik ≥ 90 mmHg.
                  </p>
                </div>

                {/* Status Kehamilan & Jarak Kehamilan */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">
                    Status Kehamilan (Gravida)
                  </label>
                  
                  {/* Custom Radio Button */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setIsFirstPregnancy(true)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isFirstPregnancy
                          ? "border-rose-500 bg-rose-50/40 ring-1 ring-rose-500"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-500">Nulipara</span>
                      <span className="text-sm font-bold text-slate-800 mt-1">Kehamilan Pertama</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFirstPregnancy(false)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        !isFirstPregnancy
                          ? "border-rose-500 bg-rose-50/40 ring-1 ring-rose-500"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-500">Multipara</span>
                      <span className="text-sm font-bold text-slate-800 mt-1">Kehamilan Kedua atau Lebih</span>
                    </button>
                  </div>

                  {/* Dinamis Tampilkan Jarak Kehamilan */}
                  {!isFirstPregnancy && (
                    <div className="space-y-2 pt-2 animate-slideDown">
                      <div className="flex justify-between items-center">
                        <label htmlFor="jarakKehamilan" className="block text-sm font-bold text-slate-700">
                          Jarak dengan Kehamilan Sebelumnya (Tahun)
                        </label>
                        <span className="text-[10px] text-rose-500 font-bold italic">Batas Aman ≤10 Tahun</span>
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
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
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
