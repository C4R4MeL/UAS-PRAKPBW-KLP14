// Komponen Banner Selamat Datang

interface WelcomeBannerProps {
  namaLengkap: string;
}

export default function WelcomeBanner({ namaLengkap }: WelcomeBannerProps) {
  return (
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
          Deteksi Dini Risiko Preeklampsia untuk Keselamatan Ibu &amp; Bayi
        </h2>
        <p className="text-sm md:text-base text-rose-50/90 mt-2 font-medium">
          Selamat bekerja, <strong className="font-extrabold text-white">{namaLengkap}</strong>. Deteksi dini risiko preeklampsia secara cepat dan bagikan laporan ke Bidan Desa.
        </p>
      </div>
    </div>
  );
}
