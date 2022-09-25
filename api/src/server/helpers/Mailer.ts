import nodemailer, { SendMailOptions } from 'nodemailer';
import config from '../../config/env';
import logger from '../../config/winston';
import magicLinkEmail from './magicLinkEmail';

const FROM = 'PayMate <noreply@paymate.me>';

const emailDisabled = !config.email.user || !config.email.pass;

function sendEmail(mailOpts: SendMailOptions) {
  if (emailDisabled) {
    logger.info('Email not sent, as it is disabled');
    return {
      mock: true,
      success: true,
    };
  }
  const transporter = nodemailer.createTransport({
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
    host: config.email.host,
    port: config.email.port,
  });

  return new Promise((resolve) => {
    transporter.sendMail(mailOpts, (err) => {
      if (err) {
        console.log(err);
        throw new Error(
          'An unknown error occurred while trying to send email.'
        );
      }
    });
    resolve({ success: true });
  });
}

function sendMagicLinkEmail({ email, link }) {
  if (emailDisabled) {
    logger.info(`Email: ${email}, link: ${link}`);
  }
  const mailOpts: SendMailOptions = {
    from: FROM,
    to: email,
    subject: `PayMate Magic Login Link`,
    html: magicLinkEmail(link),
    text: `Hello,\r\nClick the link below to login to your PayMate account:\r\nLogin to PayMate <${link}>\r\nThe link will be valid for the next 10 minutes. If it expires, just request a new one.\r\nIf you did not request this link, you can safely ignore this email.\r\nPayMate`,
  };

  return sendEmail(mailOpts);
}

export { sendMagicLinkEmail };
