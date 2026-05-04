export default {
  async afterCreate(event: any) {
    console.log('LIFECYCLE PARTITO');

    const { result } = event;
    console.log(result);

    try {
      await strapi.plugins['email'].services.email.send({
        to: 'uendi2000@gmail.com',
        subject: `Nuovo messaggio da ${result.nome}`,
        text: `
Nome: ${result.nome}
Email: ${result.email}
Oggetto: ${result.oggetto}

Messaggio:
${result.messaggio}
        `,
      });

      console.log('EMAIL INVIATA');
    } catch (error) {
      console.error('ERRORE INVIO EMAIL:', error);
    }
  },
};