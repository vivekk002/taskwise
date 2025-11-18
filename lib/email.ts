import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: "Verify your Taskwise Email",
    text: `Hi!

Please verify your email address by clicking the link below:

${verifyUrl}

If you did not sign up, please ignore this email.

Thanks,
The Taskwise Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #0070f3;">Welcome to Taskwise!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          margin: 20px 0;
          background-color: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">Verify Email</a>
        <p>If the button does not work, copy and paste this URL into your browser:</p>
        <a href="${verifyUrl}" style="color: #0070f3;">${verifyUrl}</a>
        <hr />
        <p>Thanks,<br/>The Taskwise Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
