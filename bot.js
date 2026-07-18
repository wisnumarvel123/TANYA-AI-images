require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);
const userSession = {};

// URL Render akan otomatis mengisi variabel ini
const WEBHOOK_URL = process.env.RENDER_EXTERNAL_URL;
bot.setWebHook(`${WEBHOOK_URL}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Tanya AI Image Bot Aktif dan Siap Digunakan');
});

// Menu Perintah Telegram
bot.setMyCommands([
  {command: 'start', description: 'Memulai bot & panduan penggunaan'},
  {command: 'help', description: 'Bantuan lengkap penggunaan bot'},
  {command: 'about', description: 'Informasi tentang Tanya AI Image Bot'},
  {command: 'website', description: 'Kunjungi website resmi kami'}
]);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `Selamat datang di Tanya AI Image Bot 👋\n\n` +
    `Perkenalkan, saya adalah asisten yang akan membantu Anda membuat gambar berbasis AI dari deskripsi teks.\n\n` +
    `*Cara Penggunaan:*\n` +
    `1. Silakan kirimkan deskripsi gambar yang Anda inginkan\n` +
    `2. Pilih ukuran, style, dan model AI yang tersedia\n` +
    `3. Mohon tunggu beberapa saat, gambar akan segera dikirim\n\n` +
    `Contoh deskripsi: pemandangan danau di pagi hari\n\n` +
    `Untuk panduan lebih lengkap, silakan ketik /help\n` +
    `Website Resmi: https://tanya-ai-images.netlify.app/`,
    {parse_mode: 'Markdown'}
  );
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `*📖 Panduan Penggunaan Tanya AI Image Bot*\n\n` +
    `*1. Mengirim Deskripsi*\nMohon tuliskan deskripsi gambar yang ingin Anda buat sedetail mungkin.\nContoh: \`astronot sedang menunggang kuda di bulan, dengan pencahayaan sinematik\`\n\n` +
    `*2. Memilih Ukuran Gambar*\n⬛ 1:1 Kotak - Direkomendasikan untuk postingan media sosial\n📱 9:16 Portrait - Ideal untuk Story atau Reels\n🖥️ 16:9 Landscape - Cocok untuk banner atau thumbnail YouTube\n\n` +
    `*3. Memilih Style Visual*\n📸 Realistis | 🎌 Anime | 🎬 Cinematic | 💻 Digital Art\n\n` +
    `*4. Memilih Model AI*\n⚡ Turbo - Proses pembuatan lebih cepat\n💎 Flux HD - Kualitas gambar terbaik\n🧠 GPT Image - Memiliki pemahaman prompt yang sangat baik\n\n` +
    `*Tips:* Semakin detail deskripsi yang Anda berikan, semakin baik pula hasil gambar yang akan dibuat.\n\n` +
    `Perintah lainnya: /about | /website`,
    {parse_mode: 'Markdown'}
  );
});

bot.onText(/\/about/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `*🤖 Tentang Tanya AI Image Bot*\n\n` +
    `Bot ini dirancang untuk memudahkan Anda dalam membuat karya visual berbasis AI langsung melalui Telegram, tanpa perlu mengunjungi website.\n\n` +
    `*Fitur Unggulan:*\n- 3 Pilihan ukuran gambar\n- 4 Pilihan style visual\n- 3 Pilihan model AI\n- Dapat digunakan tanpa biaya\n\n` +
    `*Didukung oleh:* Pollinations AI\n` +
    `*Website Resmi:* https://tanya-ai-images.netlify.app/\n\n` +
    `Silakan kirimkan deskripsi pertama Anda untuk memulai.`,
    {parse_mode: 'Markdown'}
  );
});

bot.onText(/\/website/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `Untuk fitur yang lebih lengkap, silakan kunjungi website resmi kami:\n\n🌐 https://tanya-ai-images.netlify.app/`
  );
});

bot.on('message', (msg) => {
  if (msg.text.startsWith('/')) return;
  const chatId = msg.chat.id;
  userSession[chatId] = { prompt: msg.text };

  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{text: '⬛ Kotak 1:1', callback_data: 'size_1024x1024'}, {text: '📱 Portrait 9:16', callback_data: 'size_768x1344'}],
        [{text: '🖥️ Landscape 16:9', callback_data: 'size_1344x768'}]
      ]
    }
  };
  bot.sendMessage(chatId, `*Langkah 1 dari 3*\n\nMohon pilih ukuran gambar yang Anda inginkan:`, {parse_mode: 'Markdown',...opts});
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!userSession[chatId]) {
    return bot.sendMessage(chatId, 'Mohon maaf, sesi Anda telah berakhir. Silakan kirim ulang deskripsi gambar untuk memulai kembali.');
  }

  if (data.startsWith('size_')) {
    userSession[chatId].size = data.split('_')[1];
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{text: '📸 Realistis', callback_data: 'style_realistic'}, {text: '🎌 Anime', callback_data: 'style_anime'}],
          [{text: '🎬 Cinematic', callback_data: 'style_cinematic'}, {text: '💻 Digital Art', callback_data: 'style_digital art'}]
        ]
      }
    };
    await bot.editMessageText(`*Langkah 2 dari 3*\n\nSilakan pilih style visual untuk gambar Anda:`, {chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown',...opts});
  }
  else if (data.startsWith('style_')) {
    userSession[chatId].style = data.split('_')[1];
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [{text: '⚡ Turbo - Cepat', callback_data: 'model_turbo'}, {text: '💎 Flux HD', callback_data: 'model_flux'}],
          [{text: '🧠 GPT Image', callback_data: 'model_gptimage'}]
        ]
      }
    };
    await bot.editMessageText(`*Langkah 3 dari 3*\n\nTerakhir, silakan pilih model AI yang akan digunakan:`, {chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown',...opts});
  }
  else if (data.startsWith('model_')) {
    const model = data.split('_')[1];
    const session = userSession[chatId];
    const fullPrompt = encodeURIComponent(`${session.prompt}, ${session.style} style, highly detailed, 8k`);
    const [width, height] = session.size.split('x');

    await bot.editMessageText(`⏳ *Mohon tunggu sebentar...*\n\nGambar Anda sedang dalam proses pembuatan. Estimasi waktu 10-30 detik.`, {chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown'});

    const imageUrl = `https://image.pollinations.ai/prompt/${fullPrompt}?width=${width}&height=${height}&model=${model}&nologo=true&enhance=true`;

    try {
      await bot.sendPhoto(chatId, imageUrl, {
        caption: `✅ *Gambar Berhasil Dibuat*\n\n*Deskripsi:* ${session.prompt}\n\nTerima kasih telah menggunakan layanan kami.\nWebsite: https://tanya-ai-images.netlify.app/`,
        parse_mode: 'Markdown'
      });
    } catch (e) {
      await bot.sendMessage(chatId, 'Mohon maaf, terjadi kendala saat proses pembuatan gambar. Silakan coba kembali beberapa saat lagi atau gunakan model Turbo untuk hasil yang lebih stabil.');
    }
    delete userSession[chatId];
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server aktif di port ${PORT}`);
});
