export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.mail.me.com',
        port: 587,
        secure: false, // STARTTLS
        auth: {
          user: env('SMTP_USER'), // es. tuonome@icloud.com
          pass: env('SMTP_PASS'), // App-specific password di iCloud
        },
      },
      settings: {
        defaultFrom: env('SMTP_USER'),
        defaultReplyTo: env('SMTP_USER'),
      },
    },
  },
});