// Komponen Dashboard: Statistik, Chart, dan Tabel Riwayat

import { Skrining, DashboardStats } from "@/lib/types";
import { kirimWhatsApp } from "@/lib/utils";

interface DashboardViewProps {
  stats: DashboardStats;
  filteredHistory: Skrining[];
  loadingHistory: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  riskFilter: string;
  setRiskFilter: (val: string) => void;
  setActiveTab: (tab: "dashboard" | "form") => void;
  onEdit: (item: Skrining) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export default function DashboardView({
  stats,
  filteredHistory,
  loadingHistory,
  searchQuery,
  setSearchQuery,
  riskFilter,
  setRiskFilter,
  setActiveTab,
  onEdit,
  onDelete,
  deletingId,
}: DashboardViewProps) {
  const {
    totalSkrining,
    totalRisikoTinggi,
    totalAman,
    pctRisikoTinggi,
    pctAman,
    countHipertensi,
    countUsia,
    countIMT,
    countGravida,
    countJarak,
    ageUnder20,
    age20To34,
    age35AndOver,
  } = stats;

  return (
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
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Tombol Edit */}
                        <button
                          onClick={() => onEdit(item)}
                          title="Edit Data Skrining"
                          className="p-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 hover:text-amber-700 transition-all focus:outline-none inline-flex items-center justify-center shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => onDelete(item.id)}
                          disabled={deletingId === item.id}
                          title="Hapus Data Skrining"
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 hover:text-rose-700 transition-all focus:outline-none inline-flex items-center justify-center shadow-sm disabled:opacity-50"
                        >
                          {deletingId === item.id ? (
                            <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          )}
                        </button>

                        {/* Tombol WhatsApp */}
                        <button
                          onClick={() => kirimWhatsApp(item)}
                          title="Kirim Laporan ke Bidan via WhatsApp"
                          className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-all focus:outline-none inline-flex items-center justify-center shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
