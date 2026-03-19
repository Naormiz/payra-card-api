const express = require("express");
const { createCanvas, registerFont } = require("canvas");
const cors = require("cors");

// REGISTER FONT
const fontPath = require('path').join(__dirname, 'fonts', 'OCR-B.ttf'); {
    family: "OCRB"
});

const app = express();
app.use(cors());
app.use(express.json());

// Generate realistic future expiration date
function generateExpDate() {
    const now = new Date();
    const futureYears = Math.floor(Math.random() * 4) + 2;
    const year = now.getFullYear() + futureYears;

    const month = Math.floor(Math.random() * 12) + 1;

    const monthStr = month < 10 ? "0" + month : month.toString();
    const yearStr = year.toString().slice(-2);

    return monthStr + "/" + yearStr;
}

// Format card number into groups of 4
function formatCardNumber(num) {
    return num.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
}

app.post("/generate-card", async (req, res) => {
    try {
        const { name, number } = req.body;

        const exp = generateExpDate();
        const formattedNumber = formatCardNumber(number);

        const canvas = createCanvas(1024, 1024);
        const ctx = canvas.getContext("2d");

        // Background (temporary preview only)
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, 1024, 1024);

        ctx.fillStyle = "#ffffff";

        // =========================
        // CARD NUMBER (CENTERED)
        // =========================
        ctx.font = "56px OCRB";
        ctx.textAlign = "center";

        // Proper spacing: tighter inside groups, wider between groups
        let spaced = "";
        for (let i = 0; i < formattedNumber.length; i++) {
            spaced += formattedNumber[i];
            if ((i + 1) % 5 === 0) {
                spaced += "   ";
            } else {
                spaced += " ";
            }
        }

        ctx.fillText(spaced.trim(), 512, 540);

        // =========================
        // NAME (BOTTOM LEFT)
        // =========================
        ctx.textAlign = "left";
        ctx.font = "36px OCRB";
        ctx.fillText(name.toUpperCase(), 120, 800);

        // =========================
        // EXP (INLINE)
        // =========================
        ctx.textAlign = "right";
        ctx.font = "36px OCRB";
        ctx.fillText("EXP " + exp, 900, 800);

        const buffer = canvas.toBuffer("image/png");

        res.setHeader("Content-Type", "image/png");
        res.send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating card");
    }
});

app.listen(3000, () => {
    console.log("PAYRA API running on http://localhost:3000");
});