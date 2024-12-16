const express = require("express");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const models = require("./models/models");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const route = require("./routes/routes");
const app = express();
const env = require("dotenv")


app.use(express.json());
env.config()
app.use(cors());
app.use("/api", route);

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("Mongoose connected");
  })
  .catch((error) => {
    console.log(error);
  });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/crud", upload.single("file"), async (req, res) => {
  try {
    const bodyitems = req.body;

    if (bodyitems.password) {
      const hashedPassword = await bcrypt.hash(bodyitems.password, 10);
      bodyitems.password = hashedPassword;
    }

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
