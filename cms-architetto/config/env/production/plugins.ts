export default ({ env }: any) => ({
  // ── Upload: Cloudinary ──────────────────────────────────────────────────────
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  // ── Email: Nodemailer con iCloud ────────────────────────────────────────────
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
