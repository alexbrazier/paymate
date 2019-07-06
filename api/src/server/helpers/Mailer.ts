import nodemailer from 'nodemailer';
import config from '../../config/env';
import logger from '../../config/winston';
import magicLinkEmail from './magicLinkEmail';

const FROM = 'PayMate <noreply@paymate.me>';

const emailDisabled = !config.email.user || !config.email.pass;

function sendMagicLinkEmail({ email, link }) {
  if (emailDisabled) {
    logger.info(`Email: ${email}, link: ${link}`);
  }
  const mailOpts = {
    from: FROM,
    to: email,
    subject: `PayMate Magic Login Link`,
    html: magicLinkEmail(link),
  };

  return sendEmail(mailOpts);
}

function sendEmail(mailOpts) {
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

  return new Promise(resolve => {
    transporter.sendMail(mailOpts, err => {
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

export { sendMagicLinkEmail };
