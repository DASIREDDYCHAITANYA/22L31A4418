const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const Url = require("./models/Url");
const shortid = require("shortid");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // ✅ Allow all origins (can restrict later)
app.use(morgan("dev")); // ✅ Logs requests for debugging

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Cluster Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Health-check route
app.get("/", (req, res) => {
  res.send("✅ URL Shortener API is running...");
});

// Route to create a short URL
app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: "❌ longUrl is required" });
  }

  const urlCode = shortid.generate();
  const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

  try {
    let url = await Url.findOne({ longUrl });

    if (url) {
      return res.json(url);
    } else {
      url = new Url({ longUrl, shortUrl, urlCode });
      await url.save();
      return res.status(201).json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to redirect short URL → long URL
app.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
