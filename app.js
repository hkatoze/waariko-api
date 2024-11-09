const bodyParser = require("body-parser");
const express = require("express");
const { initDb } = require("./src/db/sequelize");
const favicon = require("serve-favicon");
const cors = require("cors");
const admin = require("firebase-admin");

const cron = require("node-cron");

const updateExpiredSubscriptions = require("./src/utilsFunctions/updateExpiredSubscriptionPlan");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: `${process.env.FIREBASE_PROJECT_ID || "FIREBASE_PROJECT_ID"}`,

    privateKey: `${
      process.env.FIREBASE_PRIVATE_KEY ||
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCMTojM8A1ffqna\nl7W6ZdINNlClh8hmI4Lz+/KDl5q+pOp56n5HVd6LGygRLm55PR3JPYlZrkwBvGZy\ntuxtSXAX+srBhWybsjHx70azisVSJqeKpDnrKGaBw7YSRxrFEIkQAHmZ/BeZUU63\n3Hu7RjbV0N2tAjMnr7up5ANWZY6NXb0PTVfRSLmgd34WoI9hj1pQDsgGzEFaq/Xs\ngUhXTOHwqaPSfD85UmF0LSS1ji+F6lONPlQ56SFhvm2HAcyw/LNu+Z37pqgZdhlu\nAIzn6xeLEswFQSjNqX1Rhi9Sfu27XX0TeuwSuQ9bT7Vr/BsQHxJZb+mTqH4s0Xfm\n0hcI/R5NAgMBAAECggEADbahVVKDJBnHtTdNyk2oZaUw5bTrR9xhsMIn1mfLdqW8\nyzS5qfRBH5yEYoWEw7HPBvvOQGcyQ5sr8jthyV67p4RaK+cEEgWtLwXhhavjFF/1\n0S2zAYJ93mIIGio7+hXfJ6K8P+otTk1tobfZmhjHREe5Wu8Tm+XntDe2gcvETpm9\nURmoalHNcozJTaqkqwHjs15wt5FnMvjLoV8fPS/x5zWfuJtPGtKcGz+0/Ks+7eNM\n68mhfkTaWuhqSDJweadNurbwDHgPse/wrFRGXQojqMG3NW8tkOthhn45YqOTiwik\n8oRAqLuMrt7TCMe+iyvXP85Rr60vBVlS59P+nhj+MQKBgQDCVTE0ZZ/7lSicBsi5\nowOgxoseJ8xIkYUxoJ0zym51LnQbEQ9DzdxRWMDFpSyN409hgANtVCveGM9sZvCU\neugIDmRZElCzZDrEoagdYZjQWkGr9vQhSQeT7ptiHwo83Ni87BZIZ3PM39I/eLIL\nOvy+JZFZfcRKLsUz4n3jVDmHJQKBgQC41Hz+l9UdEYNxmbTueh9PQhcNr1skjZpS\nyY2HvSj1CQwSloBbZFvUC11Vt4xkBdSu/FzNNBkecjUTmtpXAEaceCf4+v8GJyse\n6ewPom/nmNUfh8LT/5vhCeI72fRLQIv8MiLJ9Os9jMFEK0AEfFXElIYKCndooDb6\nku4r/TKGCQKBgCDH3B/5kI4QsCP5pPxjeiYxt5/jmLsZCP3BGSN2X0GXD3DNZOTM\nIgD61rHAVg6tLGPHA0z66NdzGfIwPx7cyK0rOFQqGcDZBGzM1B34q51hzDgk1TOU\nLRoQItffYou3uTvNG0klYkxJ6R5ZzrbEQYQVtDoDVAwrbYp+BzxEpdudAoGABXUI\np7+15CDTP7RpGi1y5TUvVxEZYM/pgY4/5oUYQ3vb5mSZL5mb+HvJarF7rKxbZjs/\nRjPGlhaLKKQG1FDGxPHrRDes9fKMHGKNvLxwD2d8y2yHvRir8o4HJvs9ckdamryk\nOFBJ7cxNHIUmY7uEEMTN3FgIxIcOeIGEFLpqFnkCgYBqbWC3t66Ylgk9oVpiY7ma\nMvo1Qxr+l7wkEi6oI0WxyzaafF374zencL+EiCLs85RzAb68EPty5HI+z+FDv9e5\nQ02cKKeM4F2Yq0bcW+x2qRvK2RSqRZBmpxzlmxFn5vxkxNF4Dxq3sHL1QegexC+u\n0YfALUV1aFCtb+sDZjcl2w==\n-----END PRIVATE KEY-----\n"
    }`,
    clientEmail: `${
      process.env.FIREBASE_CLIENT_EMAIL || "FIREBASE_CLIENT_EMAIL"
    }`,
  }),
  databaseURL: `${
    process.env.FIREBASE_CLIENT_EMAIL || "FIREBASE_CLIENT_EMAIL"
  }`,
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
