# Hanggar Movement Management System

MVP dashboard operasional untuk pendataan keluar masuk pesawat hanggar menggunakan Next.js App Router, Prisma, PostgreSQL, NextAuth, dan ExcelJS.

## Fitur Utama

- Login sederhana (ADMIN)
- Dashboard statistik + filter bulan + pencarian realtime
- Form input data hanggar dengan validasi
- Data table dengan pagination dan sorting terbaru
- Export Excel (.xlsx)
- CRUD minimal (create/read/delete)

## Struktur Folder

- app/
- components/
- lib/
- prisma/
- actions/
- types/

## Setup

1. Install dependencies

```bash
npm install
```

2. Siapkan environment variables (lihat `.env.example`)

### Google Sheets Integration (Reporting Layer)

1. Buat Google Cloud Project dan aktifkan Google Sheets API.
2. Buat Service Account dan download JSON key.
3. Share spreadsheet target ke email Service Account sebagai Editor.
4. Ambil Spreadsheet ID dari URL Google Sheets:
	`https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
5. Isi env:
	- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
	- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
	- `GOOGLE_SHEET_ID`
	- `GOOGLE_SHEET_NAME` (opsional, nama tab tujuan; default otomatis ke tab pertama)

3. Generate Prisma client + migrasi

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Jalankan dev server

```bash
npm run dev
```

## Login Admin

Gunakan kredensial dari `.env` (ADMIN_USERNAME + ADMIN_PASSWORD atau ADMIN_PASSWORD_HASH).

## Export Excel

Klik tombol "Export Excel" di dashboard untuk mengunduh file `hanggar-report-YYYY-MM-DD.xlsx`.

## Catatan

- Tidak ada mock data. Semua data berasal dari PostgreSQL.
- Spreadsheet hanya untuk reporting/monitoring, bukan database utama.
- Form dan aksi server akan menolak request tanpa session.
