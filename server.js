const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const models = require("./models/models");
const cors = require("cors");
const route = require("./routes/routes");
const app = express();
const env = require("dotenv");

// Load environment variables
env.config();

app.use(express.json());

// CORS Configuration (allow localhost:5173 or any other frontend)
const corsOptions = {
  origin: 'https://legendary-unicorn-13589b.netlify.app/', // Allow only this origin to access
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

app.use("/api", route); // Mount routes

// Database connection
mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("Mongoose connected");
  })
  .catch((error) => {
    console.log(error);
  });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// POST route to handle creating data
app.post("/crud", upload.single("file"), async (req, res) => {
  try {
    const bodyitems = req.body;

    // Hash password if provided
    if (bodyitems.password) {
      const hashedPassword = await bcrypt.hash(bodyitems.password, 10);
      bodyitems.password = hashedPassword;
    }

    // Save file path if file exists
    if (req.file) {
      bodyitems.filePath = req.file.path;
    }

    const newItem = new models(bodyitems);
    await newItem.save();

    res.status(200).send("Data and file saved successfully");
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log("Server connected on port 9000");
});
