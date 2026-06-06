// Komponen Modal Hasil Diagnosis Skrining

import { Skrining } from "@/lib/types";
import { kirimWhatsApp } from "@/lib/utils";

interface ResultModalProps {
  resultData: Skrining;
  onClose: () => void;
}

export default function ResultModal({ resultData, onClose }: ResultModalProps) {
  return (
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
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kriteria &amp; Analisis Pakar</h5>
            
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
            onClick={onClose}
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
          >
            Tutup &amp; Kembali Ke Dasbor
          </button>
        </div>

      </div>
    </div>
  );
}
