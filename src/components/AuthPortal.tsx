// Komponen Portal Login & Registrasi Kader

import React from "react";

interface AuthPortalProps {
  authTab: "login" | "register";
  setAuthTab: (tab: "login" | "register") => void;
  authUsername: string;
  setAuthUsername: (val: string) => void;
  authPassword: string;
  setAuthPassword: (val: string) => void;
  authNamaLengkap: string;
  setAuthNamaLengkap: (val: string) => void;
  authPosyandu: string;
  setAuthPosyandu: (val: string) => void;
  authError: string;
  setAuthError: (val: string) => void;
  authSuccess: string;
  setAuthSuccess: (val: string) => void;
  authSubmitting: boolean;
  handleAuthSubmit: (e: React.FormEvent) => void;
  isEmbedded?: boolean;
}

export default function AuthPortal({
  authTab,
  setAuthTab,
  authUsername,
  setAuthUsername,
  authPassword,
  setAuthPassword,
  authNamaLengkap,
  setAuthNamaLengkap,
  authPosyandu,
  setAuthPosyandu,
  authError,
  setAuthError,
  authSuccess,
  setAuthSuccess,
  authSubmitting,
  handleAuthSubmit,
  isEmbedded = false,
}: AuthPortalProps) {
  const cardContent = (
    <div className={`w-full max-w-md bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative z-10 ${isEmbedded ? "" : "animate-scaleUp"}`}>
        
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
            {/* Nama Lengkap & Posyandu (Hanya saat Register) */}
            {authTab === "register" && (
              <>
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
                <div className="space-y-1.5 animate-slideDown">
                  <label className="text-xs font-bold text-slate-700">Nama Posyandu / Institusi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Posyandu Melati I"
                    value={authPosyandu}
                    onChange={(e) => setAuthPosyandu(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-white text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  />
                </div>
              </>
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
  );

  if (isEmbedded) {
    return cardContent;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-600 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Latar Belakang Lingkaran Blur */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl pointer-events-none"></div>
      {cardContent}
    </div>
  );
}
