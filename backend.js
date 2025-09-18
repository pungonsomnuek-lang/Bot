const fs = require("fs");
const path = require("path");

// 👉 ถ้าอยากทำ Face Detection จริง ๆ ต้องใช้ library เช่น face-api.js หรือ opencv4nodejs
// แต่ตัวอย่างนี้จะ "จำลอง" การวิเคราะห์แบบสุ่มคล้ายกับโค้ด Python ของคุณ

function analyzeFace(imagePath) {
  try {
    // ตรวจสอบไฟล์ว่ามีอยู่จริงไหม
    if (!fs.existsSync(imagePath)) {
      return { error: "ไม่พบไฟล์ภาพ" };
    }

    // 👉 จำลองการตรวจจับใบหน้า (ในของจริงใช้ model ตรวจจับ)
    const detectedFace = true;

    if (!detectedFace) {
      return { error: "ไม่พบใบหน้าในภาพ" };
    }

    // 👉 จำลองผลลัพธ์แบบเดียวกับ Python
    const gender = Math.random() > 0.5 ? "ชาย" : "หญิง";
    const age = Math.floor(Math.random() * (40 - 18 + 1)) + 18; // 18 - 40
    const emotions = ["ยิ้ม", "จริงจัง", "เศร้า"];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const description = Math.random() > 0.5 ? "ใบหน้ากลม" : "ใบหน้ายาว";
    const score = (Math.random() * 9 + 1).toFixed(1); // 1.0 - 10.0

    return {
      gender,
      age,
      emotion,
      description,
      score,
    };
  } catch (err) {
    return { error: err.message };
  }
}

// ------------------------
// ทดสอบฟังก์ชัน
const testImage = path.join(__dirname, "test.jpg"); // ใส่ path ของรูปจริง
console.log(analyzeFace(testImage));
