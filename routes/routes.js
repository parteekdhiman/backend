const express = require("express");
const nodemailer = require("nodemailer");
const models = require("../models/models");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const route = express.Router();
const JWT_SECRET = "parteek" || "Dhiman";
const cors = require("cors");

// Midleware
route.use(cookieParser());
route.use(express.json());
route.use(cors());

route
  .get("/", async (req, res) => {
    try {
      const data = await models.find();
      res.status(200).json(data);
      console.log(data);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  })
  .get("/:name", async (req, res) => {
    const username = req.params.name;
    try {
      const user = await models.find({ name: username });
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  })
  .patch("/:id", async (req, res) => {
    const userid = req.params.id;
    try {
      const user = await models.updateOne({ _id: userid }, { $set: req.body });
      if (user.nModified === 0) {
        return res
          .status(404)
          .json({ error: "User not found or no changes made" });
      }
      res.status(200).json({ message: "User updated", user });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  })
  .delete("/:id", async (req, res) => {
    const userid = req.params.id;
    try {
      const remove = await models.deleteOne({ _id: userid });
      if (remove.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  })
  .post("/login", async (req, res) => {
    try {
      const user = await models.findOne({ email: req.body.email });
      if (!user) return res.status(400).json({ error: "Invalid email" });
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(400).json({ error: "Incorrect password" });
      const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "Login successful",
        token: token,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  })
  .post("/email", (req, res) => {
    const { email, last, message, name, subject } = req.body;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "pardhiman832@gmail.com",
        pass: "rknryvkkmkkexdde",
      },
    });
    async function main() {
      const info = await transporter.jsonMail({
        from: email,
        to: "newussanjay@gmail.com",
        subject: subject,
        text: message,
        html: ` <h1> user Name : ${name}</h1> <br/> <h2>${last}</h2>
        `,
      });
      console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);
  });

module.exports = route;
