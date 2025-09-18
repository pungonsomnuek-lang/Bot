import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// TOKEN ของคุณ
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN;  // ใช้จาก Environment Variables
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "บอท Render ทำงานแล้ว 🚀");
});


// ฟังก์ชันวิเคราะห์ (mock แทน backend Python)
function analyzeFace(imagePath) {
  // คุณสามารถเชื่อม ML API ภายนอกได้ เช่น Google Vision API
  const gender = Math.random() > 0.5 ? "ชาย" : "หญิง";
  const emotion = ["ยิ้ม", "จริงจัง", "เศร้า"][
    Math.floor(Math.random() * 3)
  ];
  const description = Math.random() > 0.5 ? "ใบหน้ากลม" : "ใบหน้ายาว";
  const score = (Math.random() * 9 + 1).toFixed(1);

  return { gender, emotion, description, score };
}

// เมื่อพิมพ์ /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "สวัสดีครับ 👋 ส่งรูปมาเลย เดี๋ยวผมจะวิเคราะห์ให้!"
  );
});

// เมื่อส่งรูป
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.photo[msg.photo.length - 1].file_id;

  try {
    // โหลดไฟล์จาก Telegram
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
    const res = await fetch(url);
    const buffer = await res.buffer();

    const tempPath = path.join("/tmp", `${chatId}.jpg`);
    fs.writeFileSync(tempPath, buffer);

    // วิเคราะห์
    const result = analyzeFace(tempPath);

    // ส่งผลลัพธ์กลับ
    const replyText = `👤 เพศ: ${result.gender}\n😊 อารมณ์: ${result.emotion}\n📝 ลักษณะ: ${result.description}\n⭐ คะแนนความสวย/หล่อ: ${result.score}/10`;
    bot.sendMessage(chatId, replyText);

    // ลบไฟล์
    fs.unlinkSync(tempPath);
  } catch (err) {
    console.error("Error:", err);
    bot.sendMessage(chatId, "❌ Error: " + err.message);
  }
});

console.log("Bot started...");