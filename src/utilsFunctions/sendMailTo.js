const nodemailer = require("nodemailer");

async function sendMailTo(email, message) {
  // Configuration du transporteur SMTP
  const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: "smtp-mail.outlook.com",
    port: 587,
    secureConnection: false,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: "waariko@outlook.com",
      pass: "KXR77-7GAGM-9BS9G-XRXTQ-L29FA",
    },
  });

  // Contenu de l'e-mail
  const mailOptions = {
    from: "waariko@outlook.com",
    to: email,
    subject: "Code de vérification pour réinitialisation du mot de passe",
    html: `<!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NOUVEL ABONNEMENT WAARIKO</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        img {
          max-width: 100%;
          height: auto;
          margin-bottom: 20px;
        }
        .message {
          background-color: #f0f0f0;
          padding: 10px 20px;
          border-radius: 5px;
          font-size: 18px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://ucarecdn.com/70280d7e-8198-4787-b773-b622e2591c28/-/preview/494x505/" alt="Waariko logo">
        <h2>NOUVEL ABONNEMENT WAARIKO</h2>
        <p>Un nouvel abonnement à waariko vient d'être effectué:</p>
        <p class="message">${message}</p>
       
 
      </div>
    </body>
    </html>
    `,
  };

  // Envoi de l'e-mail

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("E-mail envoyé avec succès.");
    }
  });
}

module.exports = { sendMailTo };
