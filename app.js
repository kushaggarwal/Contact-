const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");

const app = express();

app.engine("handlebars", exphbs());

app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Message: ${req.body.message}</li>
    </ul>`;
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
      return process.exit(1);
    }

    console.log("Credentials obtained, sending message...");

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "jiiyyv5hj6wez47u@ethereal.email",
        pass: "nvaXDVafRWqMat2TdV"
      }
    });

    // Message object
    let message = {
      from: "Sender Name <kush.aggarwal110085@gmail.com>",
      to: "Recipient <hmwlaser@gmail.com>",
      subject: "Nodemailer is unicode friendly ✔",
      text: "Hello to myself!",
      html: output
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.render("contact", { msg: "Email has been sent" });
    });
  });
});

app.listen(3000, () => {
  console.log("server started...");
});
