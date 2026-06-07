"use client";

import React, { useState, useMemo } from "react";

// Custom Hooks
import { useAuth } from "@/hooks/useAuth";
import { useSkrining } from "@/hooks/useSkrining";

// Utilitas
import { computeStats } from "@/lib/utils";

// Komponen Modular
import LoadingScreen from "@/components/LoadingScreen";
import LandingPage from "@/components/LandingPage";
import AppHeader from "@/components/AppHeader";
import WelcomeBanner from "@/components/WelcomeBanner";
import DashboardView from "@/components/DashboardView";
import SkriningForm from "@/components/SkriningForm";
import ResultModal from "@/components/ResultModal";

export default function Home() {
  // State navigasi tab aktif
  const [activeTab, setActiveTab] = useState<"dashboard" | "form">("dashboard");

  // Hook autentikasi (sesi, login, register, logout)
  const auth = useAuth();

  // Hook skrining (form, history, submit, filter)
  const skrining = useSkrining(auth.currentUser);

  // Hitung statistik dari riwayat skrining (memoized)
  const stats = useMemo(() => computeStats(skrining.history), [skrining.history]);

  // --- Render Kondisional ---

  // 1. Layar loading saat memeriksa sesi
  if (auth.checkingSession) {
    return <LoadingScreen />;
  }

  // 2. Landing Page profesional jika belum login
  if (!auth.currentUser) {
    return (
      <LandingPage
        authTab={auth.authTab}
        setAuthTab={auth.setAuthTab}
        authUsername={auth.authUsername}
        setAuthUsername={auth.setAuthUsername}
        authPassword={auth.authPassword}
        setAuthPassword={auth.setAuthPassword}
        authNamaLengkap={auth.authNamaLengkap}
        setAuthNamaLengkap={auth.setAuthNamaLengkap}
        authError={auth.authError}
        setAuthError={auth.setAuthError}
        authSuccess={auth.authSuccess}
        setAuthSuccess={auth.setAuthSuccess}
        authSubmitting={auth.authSubmitting}
        handleAuthSubmit={auth.handleAuthSubmit}
      />
    );
  }

  // 3. Tampilan utama (Dashboard / Form)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white pb-12">
      {/* Header Premium */}
      <AppHeader
        namaLengkap={auth.currentUser.namaLengkap}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setResultData={() => skrining.setResultData(null)}
        handleLogout={() => {
          auth.handleLogout();
          skrining.setHistory([]);
          skrining.setResultData(null);
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Banner Selamat Datang */}
        <WelcomeBanner namaLengkap={auth.currentUser.namaLengkap} />

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <DashboardView
            stats={stats}
            filteredHistory={skrining.filteredHistory}
            loadingHistory={skrining.loadingHistory}
            searchQuery={skrining.searchQuery}
            setSearchQuery={skrining.setSearchQuery}
            riskFilter={skrining.riskFilter}
            setRiskFilter={skrining.setRiskFilter}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Screening Form View */}
        {activeTab === "form" && (
          <SkriningForm
            namaIbu={skrining.namaIbu} setNamaIbu={skrining.setNamaIbu}
            usia={skrining.usia} setUsia={skrining.setUsia}
            sistolik={skrining.sistolik} setSistolik={skrining.setSistolik}
            diastolik={skrining.diastolik} setDiastolik={skrining.setDiastolik}
            isFirstPregnancy={skrining.isFirstPregnancy} setIsFirstPregnancy={skrining.setIsFirstPregnancy}
            jarakKehamilan={skrining.jarakKehamilan} setJarakKehamilan={skrining.setJarakKehamilan}
            imt={skrining.imt} setImt={skrining.setImt}
            showBmiHelper={skrining.showBmiHelper} setShowBmiHelper={skrining.setShowBmiHelper}
            beratBadan={skrining.beratBadan} setBeratBadan={skrining.setBeratBadan}
            tinggiBadan={skrining.tinggiBadan} setTinggiBadan={skrining.setTinggiBadan}
            handleSubmit={skrining.handleSubmit}
            resetForm={skrining.resetForm}
            hitungIMT={skrining.hitungIMT}
            submitting={skrining.submitting}
          />
        )}

        {/* Modal Hasil Diagnosis */}
        {skrining.resultData && (
          <ResultModal
            resultData={skrining.resultData}
            onClose={() => {
              skrining.setResultData(null);
              setActiveTab("dashboard");
            }}
          />
        )}

      </main>
    </div>
  );
}
