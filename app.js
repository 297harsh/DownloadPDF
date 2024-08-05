require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

const Port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/generatepdf", async (req, res) => {
  const { content } = req.body;
  console.log("hi");

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 0,
    });
    const page = await browser.newPage();

    await page.setContent(content, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Disposition", "attachment; filename=content.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ success: false, message: "Error generating PDF" });
  }
});
app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});
