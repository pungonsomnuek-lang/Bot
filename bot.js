import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

// ✅ เก็บ TOKEN จาก env
const TOKEN = process.env.TELEGRAM_TOKEN || "7804401485:AAG6btVvSWnOQTtfGCTc1HIWT-Q31_73KyA";
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "บอท Render ทำงานแล้ว 🚀");
});

// ฟังก์ชันวิเคราะห์ (mock)
function analyzeFace(imagePath) {
  const gender = Math.random() > 0.5 ? "ชาย" : "หญิง";
  const emotion = ["ยิ้ม", "จริงจัง", "เศร้า"][Math.floor(Math.random() * 3)];
  const description = Math.random() > 0.5 ? "ใบหน้ากลม" : "ใบหน้ายาว";
  const score = (Math.random() * 9 + 1).toFixed(1);

  return { gender, emotion, description, score };
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "สวัสดีครับ 👋 ส่งรูปมาเลย เดี๋ยวผมจะวิเคราะห์ให้!");
});

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.photo[msg.photo.length - 1].file_id;

  try {
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
    const res = await fetch(url);
    const buffer = await res.buffer();

    const tempPath = path.join("/tmp", `${chatId}.jpg`);
    fs.writeFileSync(tempPath, buffer);

    const result = analyzeFace(tempPath);
    const replyText = `👤 เพศ: ${result.gender}\n😊 อารมณ์: ${result.emotion}\n📝 ลักษณะ: ${result.description}\n⭐ คะแนน: ${result.score}/10`;

    await bot.sendMessage(chatId, replyText);
    fs.unlinkSync(tempPath);
  } catch (err) {
    console.error("Error:", err);
    bot.sendMessage(chatId, "❌ Error: " + err.message);
  }
});

console.log("Bot started...");
