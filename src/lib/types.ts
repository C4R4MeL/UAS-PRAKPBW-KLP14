// Struktur data Skrining
export interface Skrining {
  id: string;
  namaIbu: string;
  usia: number;
  sistolik: number;
  diastolik: number;
  isFirstPregnancy: boolean;
  jarakKehamilan: number | null;
  imt: number;
  statusRisiko: string;
  kriteriaPemicu: string;
  createdAt: string;
  kader?: {
    namaLengkap: string;
  };
}

export interface User {
  id: string;
  username: string;
  namaLengkap: string;
  posyandu: string;
}

// Struktur data statistik dashboard
export interface DashboardStats {
  totalSkrining: number;
  totalRisikoTinggi: number;
  totalAman: number;
  pctRisikoTinggi: number;
  pctAman: number;
  countHipertensi: number;
  countUsia: number;
  countIMT: number;
  countGravida: number;
  countJarak: number;
  ageUnder20: number;
  age20To34: number;
  age35AndOver: number;
}
