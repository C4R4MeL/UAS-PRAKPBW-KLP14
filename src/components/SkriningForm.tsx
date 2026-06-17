// Komponen Formulir Skrining Deteksi Dini Preeklampsia

import React from "react";

interface SkriningFormProps {
  // Form States
  namaIbu: string;
  setNamaIbu: (val: string) => void;
  usia: string;
  setUsia: (val: string) => void;
  sistolik: string;
  setSistolik: (val: string) => void;
  diastolik: string;
  setDiastolik: (val: string) => void;
  isFirstPregnancy: boolean;
  setIsFirstPregnancy: (val: boolean) => void;
  jarakKehamilan: string;
  setJarakKehamilan: (val: string) => void;
  imt: string;
  setImt: (val: string) => void;

  // BMI Helper
  showBmiHelper: boolean;
  setShowBmiHelper: (val: boolean) => void;
  beratBadan: string;
  setBeratBadan: (val: string) => void;
  tinggiBadan: string;
  setTinggiBadan: (val: string) => void;

  // Actions
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  hitungIMT: () => void;
  submitting: boolean;

  // Edit Mode
  editingId: string | null;
  cancelEdit: () => void;
}

export default function SkriningForm({
  namaIbu, setNamaIbu,
  usia, setUsia,
  sistolik, setSistolik,
  diastolik, setDiastolik,
  isFirstPregnancy, setIsFirstPregnancy,
  jarakKehamilan, setJarakKehamilan,
  imt, setImt,
  showBmiHelper, setShowBmiHelper,
  beratBadan, setBeratBadan,
  tinggiBadan, setTinggiBadan,
  handleSubmit, resetForm, hitungIMT,
  submitting,
  editingId, cancelEdit,
}: SkriningFormProps) {
  const isEditing = editingId !== null;
  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      
      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <h3 className="text-xl font-extrabold">
            {isEditing ? "Edit Data Skrining" : "Formulir Skrining Deteksi Dini"}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {isEditing
              ? "Perbarui data ibu hamil di bawah ini, lalu simpan perubahan."
              : "Masukkan data ibu hamil dengan cermat untuk menghitung hasil diagnosis status risiko."}
          </p>
          {isEditing && (
            <div className="mt-3 flex items-center space-x-2 text-amber-400 text-xs font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Mode Edit — Status risiko akan dihitung ulang setelah disimpan</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {/* Bagian 1: Identitas & Fisik */}
          <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100/80 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>1. Identitas &amp; Data Fisik Ibu</span>
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
                    <p className="text-xs font-bold text-slate-600">Hitung IMT dari Berat &amp; Tinggi</p>
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
                      Hitung &amp; Isi Otomatis
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
                  placeholder="Batas: 140"
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
              *Preeklampsia tinggi terpicu jika Sistolik ≥ 140 mmHg ATAU Diastolik ≥ 90 mmHg.
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
            {isEditing ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Batalkan Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Reset Form
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className={`flex-[2] py-3 px-4 ${isEditing ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'} text-white font-bold rounded-xl shadow-md hover:shadow-none transition-all flex items-center justify-center space-x-2 disabled:opacity-50`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isEditing ? 'Memperbarui...' : 'Memproses Hasil...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {isEditing ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    )}
                  </svg>
                  <span>{isEditing ? 'Simpan Perubahan' : 'Hitung Risiko & Simpan'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
