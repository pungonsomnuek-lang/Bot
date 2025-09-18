const functions = require("firebase-functions");
const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// -------------------------
// ใส่ TOKEN ของคุณ
const TOKEN = "7804401485:AAG6btVvSWnOQTtfGCTc1HIWT-Q31_73KyA";
const bot = new TelegramBot(TOKEN, { polling: true });

// -------------------------
// ฟังก์ชันวิเคราะห์ (จำลอง logic จาก Python)
function analyzeFace(imagePath) {
  // NOTE: ใน Node.js เราจะใช้โมดูล ML/AI เพิ่มเติมได้
  // ตอนนี้ขอทำ mock แบบง่าย ๆ
  const hairLength = Math.random() > 0.5 ? "ผมยาว" : "ผมสั้น";
  const noseSize = Math.random() > 0.5 ? "จมูกโด่ง" : "จมูกเล็ก";
  const faceShape = Math.random() > 0.5 ? "ใบหน้ากลม/กว้าง" : "ใบหน้ายาว/เรียว";
  const score = (Math.random() * 10).toFixed(1);

  return `🔎 วิเคราะห์:\n- ${hairLength}\n- ${noseSize}\n- ${faceShape}\n⭐ คะแนน: ${score}/10`;
} // <<<<<< ขาดอันนี้

// -------------------------
// เมื่อผู้ใช้ส่งรูปภาพ
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const fileId = msg.photo[msg.photo.length - 1].file_id;

  try {
    // ดาวน์โหลดไฟล์จาก Telegram
    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;

    const response = await fetch(url);
    const buffer = await response.buffer();

    // เก็บไฟล์ชั่วคราว
    const tempPath = path.join("/tmp", "temp.jpg");
    fs.writeFileSync(tempPath, buffer);

    // วิเคราะห์
    const result = analyzeFace(tempPath);

    // ตอบกลับผู้ใช้
    bot.sendMessage(chatId, result);

    // ลบไฟล์
    fs.unlinkSync(tempPath);
  } catch (err) {
    console.error("Error analyzing photo:", err);
    bot.sendMessage(chatId, "❌ เกิดข้อผิดพลาดในการวิเคราะห์");
  }
});

// -------------------------
// ฟังก์ชัน Firebase HTTP endpoint (ทดสอบได้)
exports.bot = functions.https.onRequest((req, res) => {
  res.send("🤖 Telegram Bot is running on Firebase!");
});
