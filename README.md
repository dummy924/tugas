# Tugas Kuliah — Panduan Lengkap dari Nol

Aplikasi pencatat tugas kuliah: dikelompokkan per semester & mata kuliah, ada prioritas,
deadline, status selesai/belum, pilih-hapus banyak sekaligus, statistik, tema
terang/gelap, dan login Google dengan data tersimpan di Firestore milikmu sendiri
(data tiap user terpisah, tidak akan tercampur).

Panduan ini ditulis untuk yang **belum pernah** menjalankan project Node/React sama
sekali. Ikuti urut dari atas ke bawah.

---

## Bagian 1 — Install Node.js (sekali saja di komputer)

1. Buka https://nodejs.org
2. Download versi **LTS** (yang direkomendasikan), sesuai OS kamu (Windows/Mac).
3. Install seperti install aplikasi biasa (Next → Next → Finish).
4. Buka **Terminal** (Mac: aplikasi "Terminal") atau **Command Prompt / PowerShell**
   (Windows), lalu ketik:
   ```
   node -v
   npm -v
   ```
   Kalau muncul nomor versi (misalnya `v20.11.0`), berarti berhasil.

---

## Bagian 2 — Buka project ini

1. Extract/unzip folder project yang saya berikan ke lokasi mana saja, misalnya ke Desktop.
2. Buka Terminal/Command Prompt, lalu masuk ke folder tersebut. Contoh:
   ```
   cd Desktop/tugas-kuliah-app
   ```
   (Tips: di banyak sistem kamu bisa ketik `cd ` lalu drag folder-nya ke jendela
   terminal supaya path-nya otomatis terisi.)
3. Install semua dependensi (library) yang dibutuhkan:
   ```
   npm install
   ```
   Tunggu sampai selesai (ada folder baru bernama `node_modules`).

---

## Bagian 3 — Ambil Firebase Config dari project kamu

Karena kamu bilang project Firebase-nya sudah siap (Auth Google + Firestore aktif),
tinggal ambil kuncinya:

1. Buka https://console.firebase.google.com dan pilih project kamu.
2. Klik ikon **gear ⚙ → Project settings**.
3. Scroll ke bagian **"Your apps"**.
   - Kalau belum ada Web App: klik ikon `</>` (Add app → Web), beri nama bebas,
     klik "Register app".
   - Kalau sudah ada: klik app web yang sudah ada.
4. Akan muncul kode seperti ini — **copy semua isi objek `firebaseConfig`**:
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "namaproject.firebaseapp.com",
     projectId: "namaproject",
     storageBucket: "namaproject.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456",
   };
   ```
5. Buka file **`src/firebase.js`** di project ini (pakai Notepad, VS Code, text editor
   apa saja), lalu ganti bagian `firebaseConfig` dengan yang kamu copy tadi.
   Simpan filenya.

### Pastikan dua hal ini sudah aktif di Firebase Console:
- **Authentication → Sign-in method → Google** → berstatus "Enabled".
- **Firestore Database** → sudah dibuat (mode production).

### Pasang aturan keamanan Firestore (WAJIB, supaya data tiap user terpisah aman)
1. Di Firebase Console → **Firestore Database → Rules**.
2. Hapus isi yang ada, ganti dengan isi file **`firestore.rules`** yang ada di
   project ini.
3. Klik **Publish**.

Aturan ini memastikan setiap user cuma bisa baca/tulis data miliknya sendiri
(`users/{uid_dia}/...`) — user lain tidak akan bisa mengintip atau mengubah data user lain.

---

## Bagian 4 — Jalankan aplikasi di komputer kamu (mode development)

Di terminal, dari dalam folder project, ketik:
```
npm run dev
```
Akan muncul alamat seperti `http://localhost:5173`. Buka alamat itu di browser.
Coba klik "Masuk dengan Google" — kalau berhasil login dan tidak ada error merah,
berarti semua sudah tersambung dengan benar.

> Kalau muncul error `auth/unauthorized-domain`: buka Firebase Console →
> Authentication → Settings → Authorized domains, pastikan `localhost` ada di
> daftar (biasanya sudah otomatis ada).

Untuk berhenti menjalankan, tekan `Ctrl + C` di terminal.

---

## Bagian 5 — Build & Deploy (supaya bisa diakses dari HP/dimana saja)

### 5.1 Build versi produksi
```
npm run build
```
Ini menghasilkan folder `dist/` berisi file statis siap upload.

### 5.2 Deploy ke Firebase Hosting (gratis, paling gampang karena satu ekosistem)
1. Install alat Firebase (sekali saja):
   ```
   npm install -g firebase-tools
   ```
2. Login ke akun Firebase kamu lewat terminal:
   ```
   firebase login
   ```
   (akan membuka browser untuk login)
3. Hubungkan folder project ke Firebase Hosting:
   ```
   firebase init hosting
   ```
   - Pilih **"Use an existing project"** → pilih project Firebase kamu.
   - Public directory: ketik `dist`
   - Configure as a single-page app: ketik **Yes**
   - Jangan overwrite `index.html` kalau ditanya (pilih **No**).
4. Deploy:
   ```
   firebase deploy
   ```
5. Setelah selesai, terminal akan menampilkan URL seperti
   `https://namaproject.web.app` — itu alamat aplikasimu yang sudah online.
6. Domain ini **biasanya otomatis** masuk ke "Authorized domains", tapi kalau
   login Google gagal setelah deploy, cek lagi di Authentication → Settings →
   Authorized domains dan tambahkan manual `namaproject.web.app`.

Setiap kali ada perubahan kode, ulangi: `npm run build` lalu `firebase deploy`.

---

## Struktur data di Firestore

```
users (koleksi)
  └── {uid milik user}
        ├── semesters/{semesterId}     { nama, urutan, createdAt }
        ├── mataKuliah/{mkId}          { nama, semesterId, createdAt }
        └── tugas/{tugasId}            { judul, deskripsi, mkId, prioritas,
                                          deadline, selesai, createdAt }
```
`prioritas` bernilai `"tinggi" | "sedang" | "rendah"`.
`deadline` disimpan sebagai teks tanggal `YYYY-MM-DD` (boleh kosong).

---

## Struktur folder project

```
src/
  firebase.js          -> konfigurasi & koneksi Firebase (isi config kamu di sini)
  main.jsx             -> titik masuk React
  App.jsx              -> layout utama & logika filter tugas
  context/
    AuthContext.jsx     -> login/logout Google
    DataContext.jsx     -> semua fungsi CRUD ke Firestore (realtime)
    ThemeContext.jsx    -> tema terang/gelap, default ikut perangkat
  components/           -> semua tampilan (sidebar, form, modal, dst)
  utils/                -> helper tanggal & prioritas
```

## Mengubah tampilan/warna
Warna aksen dan font diatur di `tailwind.config.js` (warna `maroon` dan `gold`)
dan `index.html` (Google Fonts). Ubah nilai hex di sana kalau ingin ganti tema warna.

## Troubleshooting singkat
- **Error "permission-denied" di console browser** → aturan Firestore belum
  di-publish, atau kamu belum login.
- **Popup login tertutup sendiri / gagal** → cek popup blocker di browser, coba
  browser lain, atau pastikan sudah klik "Allow" saat browser meminta izin popup.
- **Layar putih setelah `npm run dev`** → buka Console di DevTools browser (klik
  kanan → Inspect → tab Console), baca pesan error, biasanya soal `firebaseConfig`
  yang belum diisi.
