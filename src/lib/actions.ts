"use server";
import nodemailer from "nodemailer";

export async function sendEmail(formData: FormData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Create a transporter using your email provider's SMTP settings
    const transporter = nodemailer.createTransport({
        service: "gmail", // or your SMTP host
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your "App Password" (not your login password)
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "parthprem30488@gmail.com",
            replyTo: email as string,
            subject: `New Contact from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to send email" };
    }
}