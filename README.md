# Tanya AI Image Bot - Telegram

Bot Telegram untuk membuat gambar AI secara otomatis dengan berbagai pilihan ukuran, style, dan model. Terintegrasi dengan website https://tanya-ai-images.netlify.app/

## 📱 Daftar Perintah Bot

Bot ini memiliki menu perintah yang bisa diakses dengan mengetik `/` di Telegram:

| Perintah | Fungsi |
| --- | --- |
| `/start` | Memulai bot dan menampilkan panduan singkat |
| `/help` | Menampilkan panduan lengkap cara penggunaan bot |
| `/about` | Informasi tentang Tanya AI Image Bot |
| `/website` | Link menuju website resmi |

## ✨ Fitur Utama

1. **Pilihan Ukuran Fleksibel**
   - ⬛ Kotak 1:1 (1024x1024) - Cocok untuk postingan media sosial
   - 📱 Portrait 9:16 (768x1344) - Ideal untuk Story atau konten vertikal
   - 🖥️ Landscape 16:9 (1344x768) - Optimal untuk thumbnail atau banner

2. **Beragam Style Gambar**
   - 📸 Realistis: Hasil gambar menyerupai foto asli
   - 🎌 Anime: Gaya ilustrasi khas Jepang
   - 🎬 Cinematic: Nuansa dramatis seperti adegan film
   - 💻 Digital Art: Karya seni digital modern

3. **Pilihan Model AI**
   - ⚡ **Turbo**: Proses generate cepat, cocok untuk percobaan
   - 💎 **Flux HD**: Kualitas tinggi dengan detail tajam
   - 🧠 **GPT Image**: Model terbaru dengan pemahaman prompt yang baik

## 🚀 Cara Penggunaan

1. Ketik `/start` untuk memulai
2. Kirimkan deskripsi gambar yang Anda inginkan. Contoh: `kota futuristik di malam hari`
3. Pilih ukuran gambar melalui tombol yang tersedia
4. Pilih style gambar yang sesuai
5. Pilih model AI untuk proses generate
6. Bot akan mengirimkan hasil gambar dalam 10-30 detik

Ketik `/help` kapan saja jika butuh panduan.

## 🔧 Cara Deploy ke Render

1. **Persiapan**
   - Buat bot baru melalui @BotFather di Telegram dan salin token yang diberikan
   - Di @BotFather, ketik `/setcommands` → pilih bot Anda → paste list command di atas agar menu muncul
   - Upload ketiga file ini ke repository GitHub Anda

2. **Deploy di Render.com**
   - Pilih `New` → `Worker`
   - Hubungkan dengan repository GitHub Anda
   - Atur konfigurasi berikut:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Tambahkan Environment Variable:
     - **Key**: `TELEGRAM_TOKEN`
     - **Value**: Token bot Telegram Anda
   - Klik `Create Worker`

3. **Selesai**
   Bot akan aktif dan menu perintah akan otomatis muncul saat mengetik `/` di Telegram.

## 📋 Catatan Penting

- Waktu pembuatan gambar dapat bervariasi 10-30 detik tergantung model yang dipilih.
- Gunakan deskripsi yang jelas dan detail untuk mendapatkan hasil terbaik.
- Bot tidak menyimpan data pribadi. Sesi pengguna hanya bersifat sementara.
- Jika gagal, coba gunakan model Turbo yang lebih stabil.

## 📞 Dukungan

Untuk informasi lebih lanjut, silakan kunjungi website resmi:
https://tanya-ai-images.netlify.app/

---

Terima kasih telah menggunakan Tanya AI Image Bot.