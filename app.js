const bodyParser = require("body-parser");
const express = require("express");
const { initDb } = require("./src/db/sequelize");
const favicon = require("serve-favicon");
const cors = require("cors");
const admin = require("firebase-admin");
const fs = require("fs");
const cron = require("node-cron");
const {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
} = require("./src/auth/firebase_private_key");
const updateExpiredSubscriptions = require("./src/utilsFunctions/updateExpiredSubscriptionPlan");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: `${process.env.FIREBASE_PROJECT_ID || FIREBASE_PROJECT_ID}`,

    privateKey: `${process.env.FIREBASE_PRIVATE_KEY || FIREBASE_PRIVATE_KEY}`,
    clientEmail: `${
      process.env.FIREBASE_CLIENT_EMAIL || FIREBASE_CLIENT_EMAIL
    }`,
  }),
  databaseURL: `${process.env.FIREBASE_CLIENT_EMAIL || FIREBASE_CLIENT_EMAIL}`,
  storageBucket: "kaalan-801d7.appspot.com",
});

const app = express();
const port = process.env.PORT || 3000;
app
  .use(bodyParser.json())
  .use(cors())
  .use(favicon(__dirname + "/favicon.ico"));
initDb();

/* ........All routes list........... */
require("./src/routes/adminEndpoints")(app);
require("./src/routes/authenticationEndpoints")(app);
require("./src/routes/clientEndpoints")(app);
require("./src/routes/companyEndpoints")(app);
require("./src/routes/factureEndpoints")(app);
require("./src/routes/projectEndpoints")(app);
require("./src/routes/userEndpoints")(app);
require("./src/routes/factureItemEndpoints")(app);
require("./src/routes/personnelRepertoryEndpoints")(app);
require("./src/routes/personnelEndpoints")(app);
require("./src/routes/prestataireRepertoryEndpoints")(app);
require("./src/routes/prestataireEndpoints")(app);
require("./src/routes/fournisseurRepertoryEndpoints")(app);
require("./src/routes/fournisseurEndpoints")(app);
require("./src/routes/uploadFileOnFirebase")(app);

// Configurer le Cron Job pour s'exécuter tous les jours/Exécuter chaque jour à minuit
cron.schedule("0 0 * * *", updateExpiredSubscriptions);
//404 error managment
app.use(({ res }) => {
  const message = `Impossible de trouver la ressource demandée! Vous pouvez essayer une autre URL.`;
  res?.status(404).json({ message });
});

app.listen(port, () => {
  console.log(`Notre api a démaré sur : http://localhost:${port}`);
});

module.exports = app;
