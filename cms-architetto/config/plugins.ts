export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
<<<<<<< HEAD
          user: env('SMTP_USER'),
          pass: env('SMTP_PASS'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_USER'),
        defaultReplyTo: env('SMTP_USER'),
=======
          user: 'uendi2000@gmail.com',
          pass: 'iyjc ktxm efll hpdl',
        },
      },
      settings: {
        defaultFrom: 'uendi2000@gmail.com',
        defaultReplyTo: 'uendi2000@gmail.com',
>>>>>>> d12b05c4e9ba3dfc9bb90dc8dda96349a618905d
      },
    },
  },
});