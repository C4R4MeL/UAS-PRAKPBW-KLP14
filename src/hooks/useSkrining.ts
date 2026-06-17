"use client";

import { useState, useEffect } from "react";
import { Skrining, User } from "@/lib/types";

export function useSkrining(currentUser: User | null) {
  // Riwayat & Hasil States
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

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Deleting State (untuk UI feedback)
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  // Submit handler untuk skrining baru ATAU update
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

      const isEditing = editingId !== null;
      const url = isEditing ? `/api/skrining/${editingId}` : "/api/skrining";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
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

  // Mengisi form dengan data yang akan di-edit
  const startEdit = (item: Skrining) => {
    setEditingId(item.id);
    setNamaIbu(item.namaIbu);
    setUsia(String(item.usia));
    setSistolik(String(item.sistolik));
    setDiastolik(String(item.diastolik));
    setIsFirstPregnancy(item.isFirstPregnancy);
    setJarakKehamilan(item.jarakKehamilan !== null ? String(item.jarakKehamilan) : "");
    setImt(String(item.imt));
    setShowBmiHelper(false);
    setBeratBadan("");
    setTinggiBadan("");
  };

  // Batalkan mode edit
  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  // Hapus data skrining
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data skrining ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/skrining/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        fetchHistory();
      } else {
        alert("Gagal menghapus data: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    } finally {
      setDeletingId(null);
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
    setEditingId(null);
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

  // Filter history berdasarkan pencarian dan filter risiko
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.namaIbu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "All" || item.statusRisiko === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return {
    // History & Result
    history,
    setHistory,
    loadingHistory,
    submitting,
    resultData,
    setResultData,
    fetchHistory,

    // Form States
    namaIbu, setNamaIbu,
    usia, setUsia,
    sistolik, setSistolik,
    diastolik, setDiastolik,
    isFirstPregnancy, setIsFirstPregnancy,
    jarakKehamilan, setJarakKehamilan,
    imt, setImt,

    // BMI Helper
    showBmiHelper, setShowBmiHelper,
    beratBadan, setBeratBadan,
    tinggiBadan, setTinggiBadan,

    // Search & Filter
    searchQuery, setSearchQuery,
    riskFilter, setRiskFilter,
    filteredHistory,

    // Edit & Delete
    editingId,
    setEditingId,
    startEdit,
    cancelEdit,
    deletingId,
    handleDelete,

    // Actions
    handleSubmit,
    resetForm,
    hitungIMT,
  };
}
