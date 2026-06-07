import { Skrining, DashboardStats } from "./types";

export const kirimWhatsApp = (data: Skrining) => {
  const isRisiko = data.statusRisiko === "Risiko Tinggi";
  const kaderName = data.kader?.namaLengkap || "Kader Kesehatan";
  const tanggal = new Date(data.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  const tensiStatus = (data.sistolik >= 140 || data.diastolik >= 90) ? "Hipertensi" : "Normal";
  
  const statusText = isRisiko 
    ? "RISIKO TINGGI PREEKLAMPSIA" 
    : "AMAN / RISIKO RENDAH";
    
  // Format kriteria pemicu dengan bullet point
  const pemicuText = isRisiko
    ? data.kriteriaPemicu.split("; ").map(c => {
        if (c.toLowerCase().includes("tekanan darah")) {
          return "- Tekanan Darah Tinggi (Sistolik ≥ 140 atau Diastolik ≥ 90)";
        }
        if (c.toLowerCase().includes("usia")) {
          return "- Usia Ibu Hamil Rentan (>35 tahun)";
        }
        if (c.toLowerCase().includes("imt") || c.toLowerCase().includes("massa tubuh")) {
          return "- Obesitas Gestasional (IMT > 30)";
        }
        if (c.toLowerCase().includes("kehamilan pertama") || c.toLowerCase().includes("nulipara")) {
          return "- Kehamilan Pertama (Nulipara)";
        }
        if (c.toLowerCase().includes("jarak")) {
          return "- Jarak Kehamilan > 10 Tahun";
        }
        return `- ${c}`;
      }).join("\n")
    : "- Tidak ada kriteria risiko terpenuhi";
    
  const rekomendasi = isRisiko
    ? "Mohon tindak lanjut Bidan Desa/Puskesmas. Ibu hamil disarankan untuk pemeriksaan protein urine dan pemantauan ketat."
    : "Edukasi gizi seimbang, ingatkan jadwal kontrol rutin ke Posyandu, serta pertahankan gaya hidup sehat.";

  const text = `*MOMCARE CONNECT - LAPORAN PENAPISAN*
------------------------------------
Kader: ${kaderName}
Tanggal: ${tanggal}

*Identitas Ibu Hamil:*
- Nama: ${data.namaIbu}
- Usia: ${data.usia} Tahun

*Hasil Pemeriksaan:*
- Tensi: ${data.sistolik}/${data.diastolik} mmHg (${tensiStatus})
- IMT: ${data.imt}
- Hamil Pertama: ${data.isFirstPregnancy ? "Ya" : `Tidak (Jarak Kehamilan: ${data.jarakKehamilan} Tahun)`}

*STATUS: ${statusText}*
*Kriteria Pemicu:*
${pemicuText}

*Rekomendasi:*
${rekomendasi}`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

// Fungsi menghitung semua statistik dashboard dari data riwayat skrining
export const computeStats = (history: Skrining[]): DashboardStats => {
  const totalSkrining = history.length;
  const totalRisikoTinggi = history.filter((item) => item.statusRisiko === "Risiko Tinggi").length;
  const totalAman = history.filter((item) => item.statusRisiko === "Aman").length;

  const pctRisikoTinggi = totalSkrining > 0 ? Math.round((totalRisikoTinggi / totalSkrining) * 100) : 0;
  const pctAman = totalSkrining > 0 ? Math.round((totalAman / totalSkrining) * 100) : 0;

  let countHipertensi = 0;
  let countUsia = 0;
  let countIMT = 0;
  let countGravida = 0;
  let countJarak = 0;

  let ageUnder20 = 0;
  let age20To34 = 0;
  let age35AndOver = 0;

  history.forEach((item) => {
    // Kelompok Usia
    if (item.usia < 20) ageUnder20++;
    else if (item.usia <= 34) age20To34++;
    else age35AndOver++;

    // Pemicu Risiko (Hanya jika berstatus Risiko Tinggi)
    if (item.statusRisiko === "Risiko Tinggi") {
      if (item.sistolik >= 140 || item.diastolik >= 90) countHipertensi++;
      if (item.usia >= 35) countUsia++;
      if (item.imt > 30) countIMT++;
      if (item.isFirstPregnancy) countGravida++;
      if (!item.isFirstPregnancy && item.jarakKehamilan !== null && item.jarakKehamilan > 10) countJarak++;
    }
  });

  return {
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
  };
};
