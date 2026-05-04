export default {
  register() {},

  async bootstrap({ strapi }: any) {
    strapi.documents.use(async (context: any, next: any) => {
      const result = await next();

      if (
        context.uid === 'api::contact.contact' &&
        context.action === 'create'
      ) {
        try {
          const data = result;

          console.log('NUOVO CONTACT:', data);
          
          await strapi.plugins['email'].services.email.send({
  to: 'uendi2000@gmail.com',
  subject: `Nuovo messaggio da ${data.nome}`,
  text:
`Nuovo messaggio dal sito

Nome: ${data.nome}
Email: ${data.email}
Oggetto: ${data.oggetto}

Messaggio:
${data.messaggio}`,

  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Nuovo messaggio dal sito</h2>

      <p><strong>Nome:</strong> ${data.nome}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Oggetto:</strong> ${data.oggetto}</p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

      <p><strong>Messaggio:</strong></p>
      <p>${data.messaggio}</p>
    </div>
  `,
});
   //       await strapi.plugins['email'].services.email.send({
    //        to: 'uendi2000@gmail.com',
      //      subject: `Nuovo messaggio da ${data.nome}`,
        //    text: `
//Nome: ${data.nome}
//Email: ${data.email}
//Oggetto: ${data.oggetto}

//Messaggio:
//${data.messaggio}
  //          `,
    //      });

          console.log('EMAIL INVIATA');
        } catch (error) {
          console.error('ERRORE EMAIL:', error);
        }
      }

      return result;
    });
  },
};