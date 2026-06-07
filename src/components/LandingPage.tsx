"use client";

import React from "react";
import AuthPortal from "./AuthPortal";

interface LandingPageProps {
  authTab: "login" | "register";
  setAuthTab: (tab: "login" | "register") => void;
  authUsername: string;
  setAuthUsername: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  authNamaLengkap: string;
  setAuthNamaLengkap: (val: string) => void;
  authError: string;
  setAuthError: (val: string) => void;
  authSuccess: string;
  setAuthSuccess: (val: string) => void;
  authSubmitting: boolean;
  handleAuthSubmit: (e: React.FormEvent) => void;
}

export default function LandingPage({
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
}: LandingPageProps) {
  // Fungsi helper untuk scroll ke form login
  const scrollToLogin = () => {
    const element = document.getElementById("portal-kader");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-rose-500 selection:text-white">
      
      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md">
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                MomCare<span className="text-rose-500 font-semibold">Connect</span>
              </span>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
              <a href="#tentang" className="hover:text-rose-500 transition-colors">Urgensi</a>
              <a href="#cara-kerja" className="hover:text-rose-500 transition-colors">Alur Kerja</a>
              <a href="#output-sistem" className="hover:text-rose-500 transition-colors">Penjelasan Output</a>
              <a href="#fitur" className="hover:text-rose-500 transition-colors">Fitur Utama</a>
            </nav>

            {/* CTA Button */}
            <div>
              <button
                onClick={scrollToLogin}
                className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 hover:opacity-90 active:scale-95 rounded-xl transition-all shadow-md shadow-rose-200/50 hover:shadow-none flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Akses Portal Kader 🔐</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Ornamen Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-0 right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Teks Hero */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-1.5 bg-rose-50 border border-rose-100/60 px-3 py-1 rounded-full text-xs font-semibold text-rose-600 animate-fadeIn">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                <span>Inovasi Penapisan Klinis Ibu Hamil</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] animate-fadeIn">
                Deteksi Dini Risiko <br />
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 bg-clip-text text-transparent">
                  Preeklampsia
                </span> <br />
                Secara Cepat & Akurat
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Membantu Kader Kesehatan Desa melakukan penapisan risiko preeklampsia dalam waktu kurang dari 3 menit berdasarkan kriteria klinis terstandarisasi.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2">
                <button
                  onClick={scrollToLogin}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <span>Mulai Skrining Sekarang</span>
                </button>
                <a
                  href="#output-sistem"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm rounded-2xl transition-all text-center flex items-center justify-center space-x-2"
                >
                  <span>Lihat Contoh Output</span>
                </a>
              </div>
            </div>

            {/* Visualisasi Dashboard Mini (Mockup Premium) */}
            <div className="lg:col-span-5 relative w-full flex justify-center animate-scaleUp">
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-transparent blur-2xl rounded-full"></div>
                
                {/* Header Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-500">Dashboard Kader (Live)</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">MomCare v1.0</span>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 gap-3 my-5">
                  <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Skrining</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">38</span>
                    <span className="text-[9px] text-emerald-600 font-semibold mt-1">✓ Berhasil disimpan</span>
                  </div>
                  <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-2xl">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Risiko Tinggi</span>
                    <span className="text-2xl font-black text-rose-500">6</span>
                    <span className="text-[9px] text-rose-500 block font-semibold mt-1">⚠️ Butuh rujukan</span>
                  </div>
                </div>

                {/* Mini Chart Mockup */}
                <div className="space-y-3 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold">FAKTOR RISIKO TERDETEKSI</span>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[10px] mb-0.5 text-slate-600 font-semibold">
                        <span>Hipertensi Kehamilan (TD ≥ 140/90)</span>
                        <span className="text-rose-500 font-bold">5 Ibu</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] mb-0.5 text-slate-600 font-semibold">
                        <span>Usia Rentan (&lt;20 atau &gt;35 tahun)</span>
                        <span className="text-amber-500 font-bold">3 Ibu</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: "50%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION URGENSI MEDIS */}
      <section id="tentang" className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-xs font-bold text-rose-500 uppercase tracking-widest">Urgensi & Pentingnya Penapisan</h2>
            <p className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Mengapa Skrining Preeklampsia Begitu Krusial?
            </p>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              Preeklampsia adalah kondisi peningkatan tekanan darah yang disertai kerusakan organ pada ibu hamil. Jika tidak dideteksi sejak dini, preeklampsia dapat memicu eklampsia (kejang) yang mengancam nyawa ibu dan janin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Stat 1 */}
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent block mb-2">14%</span>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Penyebab Utama Kematian Ibu</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Preeklampsia merupakan salah satu dari tiga penyebab terbesar mortalitas maternal saat persalinan di Indonesia.
              </p>
            </div>
            {/* Stat 2 */}
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent block mb-2">3 Menit</span>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Durasi Penapisan Digital</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kader kesehatan desa dapat mengidentifikasi faktor risiko ibu hamil secara instan melalui formulir digital terintegrasi.
              </p>
            </div>
            {/* Stat 3 */}
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent block mb-2">100%</span>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Rujukan Siap Kirim</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Format laporan rujukan medis terstruktur langsung dibuat oleh sistem dan siap diteruskan ke Bidan Desa via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION OUTPUT SISTEM & HASIL SKRINING (CORE REVISION REQUEST) */}
      <section id="output-sistem" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-rose-500 uppercase tracking-widest">Klarifikasi & Transparansi Output</h2>
            <p className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Output Klinis & Format Laporan Rujukan
            </p>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              Platform ini tidak hanya menyimpan data, tetapi menganalisis parameter kehamilan secara instan untuk menghasilkan <strong>dua klasifikasi risiko utama</strong> dan laporan WhatsApp yang profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Tampilan Visual Kartu Klasifikasi (LHS - 7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Representasi Output Visual</h3>
              
              {/* Kartu Output 1: Risiko Tinggi */}
              <div className="bg-white rounded-3xl p-6 shadow-md border-l-8 border-rose-500 border-y border-r border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <span>⚠️ RISIKO TINGGI PREEKLAMPSIA</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Ny. Rahmawati (36 Tahun)</h4>
                    <p className="text-xs text-slate-500">Kategori: Nulipara (Hamil Pertama) | IMT: 28.4 (Overweight)</p>
                  </div>
                  <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/50">
                    <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block mb-1">Kriteria Medis Pemicu:</span>
                    <ul className="text-xs text-rose-700 space-y-1 font-semibold list-disc list-inside">
                      <li>Tekanan Darah Sistolik/Diastolik Tinggi (145/95 mmHg)</li>
                      <li>Usia Ibu Hamil Rentan (&gt;35 tahun)</li>
                      <li>Kehamilan Pertama (Nulipara)</li>
                    </ul>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    <strong className="text-slate-800">Tindakan Klinis:</strong> Rujuk ke Bidan Desa atau Puskesmas sesegera mungkin untuk pemeriksaan urin protein dan kontrol ketat.
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-black text-rose-500">145/95</div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-widest">Tensi (mmHg)</span>
                </div>
              </div>

              {/* Kartu Output 2: Aman / Risiko Rendah */}
              <div className="bg-white rounded-3xl p-6 shadow-md border-l-8 border-emerald-500 border-y border-r border-slate-100 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>✅ AMAN / RISIKO RENDAH</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Ny. Anita (28 Tahun)</h4>
                    <p className="text-xs text-slate-500">Kategori: Multipara (Hamil Kedua) | IMT: 22.1 (Normal)</p>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    <strong className="text-slate-800">Tindakan Klinis:</strong> Berikan edukasi gizi seimbang, ingatkan jadwal kontrol kehamilan rutin ke Posyandu, serta pertahankan gaya hidup sehat.
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-black text-emerald-500">118/75</div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-widest">Tensi (mmHg)</span>
                </div>
              </div>
            </div>

            {/* Tiruan Bubble Pesan WhatsApp (RHS - 5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tiruan Laporan Rujukan WhatsApp</h3>
              <div className="bg-emerald-100/60 rounded-3xl p-5 border border-emerald-200/50 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full"></div>
                
                {/* Header WhatsApp Bar */}
                <div className="flex items-center space-x-3 pb-3 border-b border-emerald-200/60 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.012 2c-5.506 0-9.97 4.463-9.97 9.969 0 1.936.556 3.737 1.507 5.275l-1.549 5.666 5.821-1.527c1.472.802 3.16 1.258 4.957 1.258 5.505 0 9.97-4.463 9.97-9.969s-4.465-9.972-9.97-9.972zm5.727 14.152c-.246.696-1.432 1.353-1.954 1.409-.475.051-.954.249-3.045-.615-2.617-1.077-4.288-3.771-4.417-3.945-.132-.172-1.054-1.405-1.054-2.679 0-1.275.665-1.902.902-2.148.236-.247.519-.307.69-.307.172 0 .344.002.493.009.155.008.363-.058.568.441.21.507.712 1.737.773 1.861.062.124.103.268.021.433-.082.164-.124.268-.246.411-.124.144-.262.32-.375.43-.124.12-.254.25-.11.498.145.247.643 1.057 1.381 1.716.954.85 1.75 1.114 1.996 1.238.246.124.391.103.536-.062.144-.165.624-.725.793-.973.167-.247.337-.206.568-.124.23.082 1.464.69 1.716.814.253.124.423.186.485.293.062.108.062.623-.184 1.319z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Bidan Desa (WhatsApp)</h4>
                    <p className="text-[9px] text-emerald-600 font-bold">Online</p>
                  </div>
                </div>

                {/* Bubble Message */}
                <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm border border-emerald-100 text-xs font-mono whitespace-pre-line text-slate-700 leading-relaxed">
                  <strong>*MOMCARE CONNECT - LAPORAN PENAPISAN*</strong>
                  {"\n"}--------------------------------------------------
                  {"\n"}<strong>Kader:</strong> Bidan Dwi Lestari
                  {"\n"}<strong>Tanggal:</strong> 7 Juni 2026
                  {"\n"}
                  {"\n"}<strong>*Identitas Ibu Hamil:*</strong>
                  {"\n"}- Nama: Ny. Rahmawati
                  {"\n"}- Usia: 36 Tahun
                  {"\n"}
                  {"\n"}<strong>*Hasil Pemeriksaan:*</strong>
                  {"\n"}- Tensi: 145/95 mmHg (Hipertensi)
                  {"\n"}- IMT: 28.4
                  {"\n"}- Hamil Pertama: Ya
                  {"\n"}
                  {"\n"}<strong>*STATUS: RISIKO TINGGI PREEKLAMPSIA*</strong>
                  {"\n"}<strong>*Kriteria Pemicu:*</strong>
                  {"\n"}- Usia Ibu Hamil Rentan (&gt;35 tahun)
                  {"\n"}- Tekanan Darah Tinggi (Sistolik ≥ 140 atau Diastolik ≥ 90)
                  {"\n"}- Kehamilan Pertama (Nulipara)
                  {"\n"}
                  {"\n"}<strong>*Rekomendasi:*</strong>
                  {"\n"}Mohon tindak lanjut Bidan Desa/Puskesmas. Ibu hamil disarankan untuk pemeriksaan protein urine dan pemantauan ketat.
                </div>
                
                <div className="mt-3 text-[10px] text-emerald-700 font-bold text-center">
                  📱 Laporan di atas dihasilkan otomatis untuk memudahkan Kader merujuk ibu hamil.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECTION ALUR KERJA */}
      <section id="cara-kerja" className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-xs font-bold text-rose-500 uppercase tracking-widest font-semibold">Langkah Operasional</h2>
            <p className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Alur Kerja Penapisan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-3 flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900">Registrasi / Masuk</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kader mendaftar atau masuk ke aplikasi dengan akun khusus kader kesehatan desa.
              </p>
            </div>
            {/* Step 2 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-3 flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900">Input Data Ibu Hamil</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kader mengukur tensi, berat badan, tinggi badan, usia, dan riwayat kehamilan lalu menginputnya ke form.
              </p>
            </div>
            {/* Step 3 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-3 flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900">Analisis Instan</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sistem melakukan kalkulasi BMI dan pencocokan kriteria risiko secara otomatis dalam hitungan detik.
              </p>
            </div>
            {/* Step 4 */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-3 flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-slate-900 flex items-center justify-center text-white font-bold shadow-sm">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900">Kirim Rujukan Bidan</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kader menyalin hasil laporan instan dan membagikannya ke Bidan Desa melalui tombol WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION FITUR UTAMA */}
      <section id="fitur" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold text-rose-500 uppercase tracking-widest font-semibold">Fitur Andalan</h2>
            <p className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Kemudahan Penapisan di Genggaman
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Kalkulator BMI Terintegrasi</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Membantu kader menghitung Indeks Massa Tubuh (IMT) ibu hamil secara otomatis hanya dengan memasukkan berat dan tinggi badan.
              </p>
            </div>
            {/* Fitur 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Visualisasi & Statistik</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Menyajikan statistik penyebaran risiko preeklampsia di wilayah desa dalam bentuk diagram lingkaran interaktif dan bar chart.
              </p>
            </div>
            {/* Fitur 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pencarian & Riwayat Skrining</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mudah mencari dan memfilter database riwayat skrining pasien berdasarkan nama atau klasifikasi tingkat risiko.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION PORTAL KADER (AUTH PORTAL EMBEDDED) */}
      <section id="portal-kader" className="py-20 bg-gradient-to-tr from-slate-900 via-slate-850 to-indigo-950 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Ajakan Bergabung */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Akses Portal Kader Kesehatan
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                Gunakan akun Kader Anda yang terdaftar untuk mulai mengelola skrining ibu hamil, memantau data di desa, dan memperbarui rujukan. Belum memiliki akun? Silakan beralih ke tab <strong>Daftar Akun</strong> pada form di samping untuk mendaftar secara mandiri.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4 border-t border-slate-800/80">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Aman & Terenkripsi</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">Sistem login dilindungi standar JWT</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-pink-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Bantuan Kader</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">Hubungi Bidan Desa untuk pendaftaran terverifikasi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form AuthPortal embedded */}
            <div className="lg:col-span-6 w-full flex justify-center">
              <AuthPortal
                authTab={authTab}
                setAuthTab={setAuthTab}
                authUsername={authUsername}
                setAuthUsername={setAuthUsername}
                authPassword={authPassword}
                setAuthPassword={setAuthPassword}
                authNamaLengkap={authNamaLengkap}
                setAuthNamaLengkap={setAuthNamaLengkap}
                authError={authError}
                setAuthError={setAuthError}
                authSuccess={authSuccess}
                setAuthSuccess={setAuthSuccess}
                authSubmitting={authSubmitting}
                handleAuthSubmit={handleAuthSubmit}
                isEmbedded={true}
              />
            </div>

          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <span className="font-extrabold text-sm text-slate-300">MomCare Connect</span>
          </div>
          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} MomCare Connect. Seluruh Hak Cipta Dilindungi. <br />
            <span className="text-slate-600">UAS Praktikum Pemrograman Berbasis Web - Kelompok 14</span>
          </p>
        </div>
      </footer>

    </div>
  );
}
