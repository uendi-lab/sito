export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'uendi2000@gmail.com',
          pass: 'iyjc ktxm efll hpdl',
        },
      },
      settings: {
        defaultFrom: 'uendi2000@gmail.com',
        defaultReplyTo: 'uendi2000@gmail.com',
      },
    },
  },
});