msg.chat.idrequire('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {polling: true});
const userSession = {};

// Set Menu Commands Telegram
bot.setMyCommands([
  {command: 'start', description: 'Mulai bot & lihat panduan'},
  {command: 'help', description: 'Bantuan penggunaan bot'},
  {command: 'about', description: 'Tentang Tanya AI Image Bot'},
  {command: 'website', description: 'Kunjungi website resmi'}
]);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `Selamat datang di Tanya AI Image Bot 👋\n\n` +
    `Saya akan membantu Anda membuat gambar AI dari teks.\n\n` +
    `*Cara pakai:*\n` +
    `1. Kirim deskripsi gambar yang Anda inginkan\n` +
    `2. Pilih ukuran, style, dan model AI\n` +
    `3. Tunggu gambar Anda jadi\n\n` +
    `Contoh: pemandangan danau di pagi hari\n\n` +
    `Ketik /help untuk bantuan lengkap.\n` +
    `Website: https://tanya-ai-images.netlify.app/`,
    {parse_mode: 'Markdown'}
  );
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `*📖 Panduan Tanya AI Image Bot*\n\n` +
    `*1. Kirim Prompt*\nKetik deskripsi gambar sedetail mungkin.\nContoh: \`astronot naik kuda di bulan, cinematic lighting\`\n\n` +
    `*2. Pilih Ukuran*\n⬛ 1:1 Kotak - untuk postingan IG\n📱 9:16 Portrait - untuk Story/Reels\n🖥️ 16:9 Landscape - untuk YouTube/Banner\n\n` +
    `*3. Pilih Style*\n📸 Realistis | 🎌 Anime | 🎬 Cinematic | 💻 Digital Art\n\n` +
    `*4. Pilih Model AI*\n⚡ Turbo - Hasil cepat\n💎 Flux HD - Kualitas terbaik\n🧠 GPT Image - Paling pintar baca prompt\n\n` +
    `*Tips:* Semakin detail prompt Anda, semakin bagus hasilnya.\n\n` +
    `Perintah lain: /about | /website`,
    {parse_mode: 'Markdown'}
  );
});

bot.onText(/\/about/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `*🤖 Tentang Tanya AI Image Bot*\n\n` +
    `Bot ini dibuat untuk memudahkan Anda membuat gambar AI langsung dari Telegram tanpa perlu buka website.\n\n` +
    `*Fitur:*\n- 3 pilihan ukuran gambar\n- 4 pilihan style visual\n- 3 pilihan model AI\n- Gratis tanpa batas\n\n` +
    `*Ditenagai oleh:* Pollinations AI\n` +
    `*Website Resmi:* https://tanya-ai-images.netlify.app/\n\n` +
    `Silakan kirim prompt pertama Anda untuk memulai.`,
    {parse_mode: 'Markdown'}
  );
});

bot.onText(/\/website/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `Kunjungi website resmi kami untuk fitur lebih lengkap:\n\n🌐 https://tanya-ai-images.netlify.app/`
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
  bot.sendMessage(chatId, `*Langkah 1/3:* Silakan pilih ukuran gambar:`, {parse_mode: 'Markdown',...opts});
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  await bot.answerCallbackQuery(query.id);

  if (!userSession[chatId]) {
    return bot.sendMessage(chatId, 'Sesi telah berakhir. Silakan kirim ulang deskripsi gambar Anda.');
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
    await bot.editMessageText(`*Langkah 2/3:* Silakan pilih style gambar:`, {chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown',...opts});
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
    await bot.editMessageText(`*Langkah 3/3:* Silakan pilih model AI:`, {chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown',...opts});
  }
  else if (data.startsWith('model_')) {
    const model = data.split('_')[1];
    const session = userSession[chatId];
    const fullPrompt = encodeURIComponent(`${session.prompt}, ${session.style} style, highly detailed, 8k`);
    const [width, height] = session.size.split('x');

    await bot.editMessageText(`⏳ *Sedang memproses gambar Anda...*\nMohon tunggu 10-30 detik.`, {chat_id: chatId, message_id: query.message.message_id, parse_mode: 'Markdown'});

    const imageUrl = `https://image.pollinations.ai/prompt/${fullPrompt}?width=${width}&height=${height}&model=${model}&nologo=true&enhance=true`;

    try {
      await bot.sendPhoto(chatId, imageUrl, {
        caption: `✅ *Gambar berhasil dibuat*\n\n*Prompt:* ${session.prompt}\n\nWebsite: https://tanya-ai-images.netlify.app/`,
        parse_mode: 'Markdown'
      });
    } catch (e) {
      await bot.sendMessage(chatId, 'Maaf, terjadi kendala saat membuat gambar. Silakan coba lagi dengan model Turbo atau coba beberapa saat lagi.');
    }
    delete userSession[chatId];
  }
});

console.log('Bot aktif dan siap digunakan...');