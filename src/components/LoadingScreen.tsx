// Komponen Layar Loading saat memeriksa sesi

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-slate-50 to-violet-50 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-slate-500 animate-pulse">Memeriksa sesi login...</p>
    </div>
  );
}
