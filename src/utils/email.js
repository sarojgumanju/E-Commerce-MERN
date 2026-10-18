import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.resendEmailApiKey);

const sendEmail = async ({ recipient, subject, html }) => {
  console.log("Recipient received:", recipient);

  if (
    !recipient ||
    typeof recipient !== "string" ||
    recipient.trim() === ""
  ) {
    throw new Error("Invalid email recipient");
  }

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: recipient,
      subject,
      html,
    });

    console.log("Email response:", response);
    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};


export default sendEmail;
