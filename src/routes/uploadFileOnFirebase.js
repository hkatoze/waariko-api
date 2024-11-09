const auth = require("../auth/auth");
const multer = require("multer");
const { getStorage } = require("firebase-admin/storage");

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (app) => {
  app.post(
    "/api/uploadOnFirebase",
    auth,
    upload.single("file"),
    async (req, res) => {
      try {
        // Récupérer le fichier  depuis la requête
        const reqFile = req.file;

        if (!reqFile) {
          return res.status(400).json({ error: "Aucun fichier  fourni." });
        }

        // Spécifier le chemin dans le bucket Firebase Storage où le fichier sera stocké
        const filePath = `waariko/${Date.now()}_${reqFile.originalname}`;

        // Obtenir une référence au fichier dans le bucket
        const fileRef = storage.bucket().file(filePath);

        // Utiliser la méthode createWriteStream pour télécharger le fichier
        const writeStream = fileRef.createWriteStream();
        writeStream.end(reqFile.buffer);

        // Attendre que le téléchargement soit terminé
        await new Promise((resolve, reject) => {
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });

        // Générer une URL signée avec une expiration de 5 ans
        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: Date.now() + 5 * 365 * 24 * 60 * 60 * 1000,
        });

        // Renvoyer l'URL signée du fichier dans la réponse
        res.status(200).json({
          success: true,
          message: "Fichier uploadé avec succès.",
          url,
        });
      } catch (error) {
        // Gérer les erreurs d'upload
        console.error("Erreur d'upload vers Firebase Storage:", error);
        res.status(500).json({
          error: "Une erreur est survenue lors de l'upload du fichier PDF.",
        });
      }
    }
  );
};
