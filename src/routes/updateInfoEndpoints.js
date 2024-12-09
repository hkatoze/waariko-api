const auth = require("../auth/auth");

module.exports = (app) => {
  // reccupérer tous les tasks d'un tasklist
  app.get("/api/update-info", auth, async (req, res) => {
    try {
      const updateInfo = {
        latestVersion: "1.0.1", // Version actuelle de l'application
        downloadUrl:
          "https://waariko.lelabo-du-numerique.com/Waariko-1.0.0.exe", // Lien de téléchargement
        changelog:
          "Intégration de système de paiment d'abonnnement via Mobile Money", // Journal des modifications
      };

      res.json({
        message: "Infos de mise à jour récupérées avec succès.",
        data: updateInfo,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération  des infos de mise à jour :",
        error
      );
      res.status(500).json({
        message: "Erreur lors de la récupération  des infos de mise à jour",
        error,
      });
    }
  });
};
