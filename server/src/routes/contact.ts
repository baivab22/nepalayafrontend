import { Router } from "express";
import nodemailer from "nodemailer";
import { ContactModel, insertContactSchema } from "../db/schema";

const router = Router();

const TO_EMAIL = "bidaribaivab7@gmail.com";

router.post("/contact", async (req, res) => {
  try {
    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.issues,
      });
      return;
    }

    const { name, email, subject, message } = parsed.data;

    await ContactModel.create({ name, email, subject, message });

    const smtpUser = process.env["SMTP_USER"];
    const smtpPass = process.env["SMTP_PASS"];

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"${name}" <${smtpUser}>`,
        replyTo: email,
        to: TO_EMAIL,
        subject: `[Contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
      });
    }

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

export default router;
