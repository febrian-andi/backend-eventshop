import nodemailer from "nodemailer";
import {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_USER,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_PORT,
} from "../env";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  // service: EMAIL_SERVICE_NAME,
  // secure: EMAIL_SMTP_SECURE,
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
  // requireTLS: true,
});

export interface ISendEmail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ ...mailParams }: ISendEmail) => {
  const result = await transporter.sendMail({
    ...mailParams,
  });
  return result;
};

export const renderMailHtml = async (template: string, data: any) => {
  const content = await ejs.renderFile(
    path.join(__dirname, `templates/${template}`),
    data
  );
  return content;
};
