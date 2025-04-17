const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const moment = require('moment');

// Replace with your Telegram bot token
const token = '8123514953:AAHaclvZWTI2VPWRLeR7aCW98XbA7mPnr_E';
const bot = new TelegramBot(token, {polling: true});

const userSessions = {};

const defaultHeaders = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 OPR/100.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 OPR/100.0.0.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 OPR/100.0.0.0",
    "Mozilla/5.0 (Linux; Android 12; SM-G993U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5005.115 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-G998U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5005.115 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-G992U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5005.115 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/16A5367e Safari/604.1",
    "Mozilla/5.0 (iPad; CPU iPadOS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/16A5367e Safari/604.1",
    "Mozilla/5.0 (iPod touch; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/16A5367e Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5005.115 Safari/537.36 Edg/103.0.5005.115",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5005.115 Safari/537.36 Vivaldi/6.1.3035.257",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5005.115 Brave/1.43.120"
];

const acceptLanguages = [
    "en-US,en;q=0.9",
    "en-GB,en;q=0.8",
    "fr-FR,fr;q=0.9",
    "es-ES,es;q=0.9",
    "de-DE,de;q=0.9",
    "it-IT,it;q=0.9",
    "pt-PT,pt;q=0.9",
    "nl-NL,nl;q=0.9",
    "sv-SE,sv;q=0.9",
    "no-NO,no;q=0.9",
    "da-DK,da;q=0.9",
    "fi-FI,fi;q=0.9",
    "pl-PL,pl;q=0.9",
    "ru-RU,ru;q=0.9",
    "tr-TR,tr;q=0.9",
    "ja-JP,ja;q=0.9",
    "ko-KR,ko;q=0.9",
    "zh-CN,zh;q=0.9",
    "ar-SA,ar;q=0.9",
    "hi-IN,hi;q=0.9",
    "he-IL,he;q=0.9",
    "th-TH,th;q=0.9",
    "vi-VN,vi;q=0.9",
    "id-ID,id;q=0.9",
    "ms-MY,ms;q=0.9",
    "fil-PH,fil;q=0.9"
];

const otherHeaders = {
    "Referer": "https://www.google.com/",
    "Connection": "keep-alive",
    "DNT": "1",
    "Upgrade-Insecure-Requests": "1",
    "Cache-Control": "max-age=0",
    "TE": "Trailers"
};

// Function to get current date and time
function getCurrentDateTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss (dddd)');
}

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `🚀 *BAN TIKTOK BOT* 🚀\n\n` +
        `Selamat datang di TikTok Mass Reporter Bot!\n\n` +
        `📅 *Tanggal/Waktu:* ${getCurrentDateTime()}\n\n` +
        `Gunakan perintah berikut:\n` +
        `/ban [username] - Mulai melaporkan username TikTok\n` +
        `/clear - Bersihkan chat\n` +
        `/tutor - Lihat tutorial penggunaan\n\n` +
        `Bot ini akan otomatis melaporkan username TikTok yang Anda targetkan.`;
    
    bot.sendMessage(chatId, welcomeMessage, {parse_mode: 'Markdown'});
});

// Ban command
bot.onText(/\/ban (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = match[1];
    
    if (!userSessions[chatId]) {
        userSessions[chatId] = {
            reportsSent: 0,
            startTime: Date.now(),
            isRunning: true
        };
    } else {
        userSessions[chatId].isRunning = true;
    }
    
    const targetUrl = `https://www.tiktok.com/@${username}`;
    
    bot.sendMessage(chatId, `🚀 Memulai proses ban untuk @${username}...\n` +
        `📅 ${getCurrentDateTime()}\n\n` +
        `Bot akan mulai mengirim laporan ke TikTok.`);
    
    while (userSessions[chatId] && userSessions[chatId].isRunning) {
        try {
            const userAgent = defaultHeaders[Math.floor(Math.random() * defaultHeaders.length)];
            const acceptLanguage = acceptLanguages[Math.floor(Math.random() * acceptLanguages.length)];
            
            const headers = {
                "User-Agent": userAgent,
                "Accept-Language": acceptLanguage,
                ...otherHeaders
            };
            
            const response = await axios.post(targetUrl, {}, { headers });
            
            if (response.status === 200) {
                userSessions[chatId].reportsSent++;
                const elapsedTime = (Date.now() - userSessions[chatId].startTime) / 1000;
                const reportsPerMinute = (userSessions[chatId].reportsSent / elapsedTime) * 60;
                
                const statusMessage = `✅ Laporan terkirim: ${userSessions[chatId].reportsSent}\n` +
                    `📊 Kecepatan: ${reportsPerMinute.toFixed(2)} laporan/menit\n` +
                    `🕒 Terakhir: ${getCurrentDateTime()}\n` +
                    `🔧 User-Agent: ${userAgent.substring(0, 30)}...`;
                
                bot.sendMessage(chatId, statusMessage);
            }
        } catch (error) {
            bot.sendMessage(chatId, `❌ Gagal mengirim laporan: ${error.message}`);
        }
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
});

// Stop command
bot.onText(/\/stop/, (msg) => {
    const chatId = msg.chat.id;
    
    if (userSessions[chatId]) {
        userSessions[chatId].isRunning = false;
        const totalReports = userSessions[chatId].reportsSent;
        bot.sendMessage(chatId, `🛑 Proses dihentikan!\n` +
            `📊 Total laporan terkirim: ${totalReports}\n` +
            `📅 ${getCurrentDateTime()}`);
    } else {
        bot.sendMessage(chatId, 'Tidak ada proses yang berjalan.');
    }
});

// Clear command
bot.onText(/\/clear/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Chat akan dibersihkan...', {
        reply_markup: {
            remove_keyboard: true
        }
    });
});

// Tutorial command
bot.onText(/\/tutor/, (msg) => {
    const chatId = msg.chat.id;
    const tutorialMessage = `📚 *Tutorial Penggunaan BOT* 📚\n\n` +
        `1. Gunakan perintah /ban [username] untuk memulai proses report\n` +
        `   Contoh: /ban contoh_user\n\n` +
        `2. Bot akan otomatis mengirim laporan ke TikTok\n\n` +
        `3. Gunakan /stop untuk menghentikan proses\n\n` +
        `4. /clear untuk membersihkan chat\n\n` +
        `5. Bot akan menampilkan statistik laporan secara real-time\n\n` +
        `📅 Tanggal/Waktu: ${getCurrentDateTime()}`;
    
    bot.sendMessage(chatId, tutorialMessage, {parse_mode: 'Markdown'});
});

// Handle button clicks
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;
    
    if (data === 'stop_report') {
        if (userSessions[chatId]) {
            userSessions[chatId].isRunning = false;
            const totalReports = userSessions[chatId].reportsSent;
            bot.sendMessage(chatId, `🛑 Proses dihentikan!\n` +
                `📊 Total laporan terkirim: ${totalReports}\n` +
                `📅 ${getCurrentDateTime()}`);
        }
    }
});

console.log('Bot is running...');
