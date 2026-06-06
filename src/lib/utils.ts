import { Skrining, DashboardStats } from "./types";

// Fungsi kirim laporan skrining ke WhatsApp
export const kirimWhatsApp = (data: Skrining) => {
  const isRisiko = data.statusRisiko === "Risiko Tinggi";
  const header = isRisiko 
    ? "🚨 *PEMBERITAHUAN SKRINING PREEKLAMPSIA* 🚨" 
    : "ℹ️ *LAPORAN SKRINING PREEKLAMPSIA* ℹ️";
    
  const statusText = isRisiko ? "🔴 *RISIKO TINGGI*" : "🟢 *AMAN*";
  
  const rekomendasi = isRisiko 
    ? "*Rujukan:* Segera rujuk ke Puskesmas / Bidan Desa terdekat." 
    : "*Saran:* Lakukan kontrol kehamilan rutin ke Posyandu.";

  const pemicuSection = isRisiko 
    ? `\n• *Pemicu:* ${data.kriteriaPemicu.replace(/;/g, ", ")}`
    : "";

  const text = `${header}
*MomCare Connect*

• *Nama:* ${data.namaIbu} (${data.usia} th)
• *Hasil:* ${statusText}
• *Kondisi:* TD ${data.sistolik}/${data.diastolik} mmHg, IMT ${data.imt}${pemicuSection}

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
      if (item.sistolik >= 160 || item.diastolik >= 90) countHipertensi++;
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
