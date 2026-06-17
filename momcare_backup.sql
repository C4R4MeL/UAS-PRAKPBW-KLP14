-- MomCare Connect Database Export
-- Tanggal: 2026-06-17T12:06:33.894Z
-- Database: Supabase PostgreSQL

-- ============================================
-- Tabel: Kader
-- ============================================
DROP TABLE IF EXISTS "Kader" CASCADE;
CREATE TABLE "Kader" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "namaLengkap" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "posyandu" TEXT NOT NULL DEFAULT 'Posyandu Sejahtera'::text,
  PRIMARY KEY ("id")
);

-- Data untuk tabel: Kader (6 baris)
INSERT INTO "Kader" ("id", "username", "namaLengkap", "password", "createdAt", "posyandu") VALUES ('cmq2k18wf0000fcvbkap9irvx', 'admin', 'admin', '$2b$10$YUldNB6m68sT31DA0.7sBOGQGPPRqkNrET5IqE.i9FTX0Ji84AWOO', '2026-06-06T09:15:33.712Z', 'Posyandu Sejahtera');
INSERT INTO "Kader" ("id", "username", "namaLengkap", "password", "createdAt", "posyandu") VALUES ('cmq2k9xx20000t8vb077gfqib', 'admin2', 'DMIN2', '$2b$10$XEF7akvMf4B35f7K1.kyMesC4xO1y9RCjjnZEjrnb/nU07vtHdlWm', '2026-06-06T09:22:19.382Z', 'Posyandu Sejahtera');
INSERT INTO "Kader" ("id", "username", "namaLengkap", "password", "createdAt", "posyandu") VALUES ('cmq2kaprx0001t8vb8i2tvyi0', 'admin3', 'admin3', '$2b$10$h7W0/T4gr7Rx0mxyUljfBuBBIdh5ccSKDsFNOUSPvHGzwaIrgH4K6', '2026-06-06T09:22:55.485Z', 'Posyandu Sejahtera');
INSERT INTO "Kader" ("id", "username", "namaLengkap", "password", "createdAt", "posyandu") VALUES ('cmq3hcmvi0000psvb23wy8eqm', 'farhan', 'farhan', '$2b$10$vYMh1hTh18VIY40Yj0uL7ePNzjMg.bDhcmfuJjeVV4KeXpL9weXYS', '2026-06-07T00:48:12.366Z', 'melati');
INSERT INTO "Kader" ("id", "username", "namaLengkap", "password", "createdAt", "posyandu") VALUES ('cmq3heg3a0003psvbfx9167rt', 'azlan', 'azlan', '$2b$10$Ph6eWDLTD4xXi9Vab2z/ouSa90LxjiJGGfgNCYce1E4idO64ZJyhu', '2026-06-07T00:49:36.886Z', 'melati');
INSERT INTO "Kader" ("id", "username", "namaLengkap", "password", "createdAt", "posyandu") VALUES ('cmq3ihril0000ect8l7vb9yvd', 'azlan@gmail.com', 'azlan', '$2b$10$qkp767UO5gzDTaIz.14Eu.qjKuao7t16N.pHoJ3RxXccmcjcO1JH.', '2026-06-07T01:20:11.277Z', 'Pos langsa');

-- ============================================
-- Tabel: Skrining
-- ============================================
DROP TABLE IF EXISTS "Skrining" CASCADE;
CREATE TABLE "Skrining" (
  "id" TEXT NOT NULL,
  "namaIbu" TEXT NOT NULL,
  "usia" INTEGER NOT NULL,
  "sistolik" INTEGER NOT NULL,
  "diastolik" INTEGER NOT NULL,
  "isFirstPregnancy" BOOLEAN NOT NULL,
  "jarakKehamilan" INTEGER,
  "imt" DOUBLE PRECISION NOT NULL,
  "statusRisiko" TEXT NOT NULL,
  "kriteriaPemicu" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "kaderId" TEXT,
  PRIMARY KEY ("id")
);

-- Data untuk tabel: Skrining (9 baris)
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq2ion4t0000msvbt6fpuhqi', 'Siti', 26, 160, 90, TRUE, NULL, 24.3, 'Risiko Tinggi', 'Tekanan darah tinggi (Sistolik: 160 mmHg / Diastolik: 90 mmHg, batas aman <160/<90 mmHg); Kehamilan pertama (nulipara) merupakan faktor risiko preeklampsia', '2026-06-06T08:37:46.014Z', NULL);
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq2k2lcc0001fcvb4h06p0ma', 'Aminah', 25, 120, 60, TRUE, NULL, 28.3, 'Risiko Tinggi', 'Kehamilan pertama (nulipara) merupakan faktor risiko preeklampsia', '2026-06-06T09:16:36.492Z', 'cmq2k18wf0000fcvbkap9irvx');
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq2k5k3v0002fcvbm62fyeyv', 'Rahma', 28, 120, 80, FALSE, 2, 22.5, 'Aman', 'Tidak ada kriteria risiko terpenuhi', '2026-06-06T09:18:54.859Z', 'cmq2k18wf0000fcvbkap9irvx');
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq2nph3000004wvb96xpchht', 'Siti', 26, 146, 60, FALSE, 3, 21.8, 'Aman', 'Tidak ada kriteria risiko terpenuhi', '2026-06-06T10:58:22.908Z', 'cmq2kaprx0001t8vb8i2tvyi0');
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq3gudut00014wvb0iuu4kmg', 'Rahma', 28, 140, 73, FALSE, 5, 27.1, 'Aman', 'Tidak ada kriteria risiko terpenuhi', '2026-06-07T00:34:00.869Z', 'cmq2k18wf0000fcvbkap9irvx');
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq3hdbak0001psvbjy5tr5v7', 'Rahma', 28, 140, 73, TRUE, NULL, 21.8, 'Risiko Tinggi', 'Kehamilan pertama (nulipara) merupakan faktor risiko preeklampsia', '2026-06-07T00:48:44.012Z', 'cmq3hcmvi0000psvb23wy8eqm');
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq3hdw2d0002psvbzmh3k5zc', 'Siti', 28, 140, 73, FALSE, 3, 21.7, 'Aman', 'Tidak ada kriteria risiko terpenuhi', '2026-06-07T00:49:10.933Z', 'cmq3hcmvi0000psvb23wy8eqm');
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq3hfx2b0004psvbyp8b04cb', 'sarah', 25, 130, 60, FALSE, 1, 24.1, 'Aman', 'Tidak ada kriteria risiko terpenuhi', '2026-06-07T00:50:45.539Z', 'cmq3heg3a0003psvbfx9167rt');
INSERT INTO "Skrining" ("id", "namaIbu", "usia", "sistolik", "diastolik", "isFirstPregnancy", "jarakKehamilan", "imt", "statusRisiko", "kriteriaPemicu", "createdAt", "kaderId") VALUES ('cmq3ijfbb0001ect8e8edik72', 'siti aminan', 28, 139, 90, FALSE, 4, 24.2, 'Risiko Tinggi', 'Tekanan Darah Tinggi (Sistolik ≥ 140 atau Diastolik ≥ 90)', '2026-06-07T01:21:28.775Z', 'cmq3ihril0000ect8l7vb9yvd');

-- ============================================
-- Foreign Keys
-- ============================================
ALTER TABLE "Skrining" ADD CONSTRAINT "Skrining_kaderId_fkey" FOREIGN KEY ("kaderId") REFERENCES "Kader" ("id");
