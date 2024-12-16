const nodemailer = require("nodemailer");

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
  const info = await transporter.sendMail({
    from: 'pardhiman832@gmail.com', 
    to: "newussanjay@gmail.com", 
    subject: "parteek", 
    text: "From Parteek", 
    html: "<b>Hello Sanjay</b>", 
  });
  console.log("Message sent: %s", info.messageId);
}
main().catch(console.error);
