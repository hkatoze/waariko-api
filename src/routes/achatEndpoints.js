const { AchatRepertory, Achat } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  //Créer un achat
  app.post("/api/achats", auth, (req, res) => {
    Achat.create(req.body)
      .then((achat) => {
        const message = "Nouvel achat ajouté.";
        res.json({ message, data: achat });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "L'achat n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  //Modifier un achat
  app.put("/api/achats/:id", auth, (req, res) => {
    const id = req.params.id;

    Achat.update(req.body, { where: { id } })
      .then(([updated]) => {
        if (!updated) {
          return res
            .status(404)
            .json({ message: "L'achat n'a pas été trouvé." });
        }

        return Achat.findByPk(id).then((achat) => {
          const message = "Achat modifié avec succès.";
          res.json({ message, data: achat });
        });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "L'achat n'a pas pu être modifié. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  //Supprimer un achat
  app.delete("/api/achats/:id", auth, (req, res) => {
    const id = req.params.id;

    Achat.findByPk(id)
      .then((achat) => {
        if (!achat) {
          return res
            .status(404)
            .json({ message: "L'achat n'a pas été trouvé." });
        }

        return Achat.destroy({ where: { id } }).then(() => {
          const message = "Achat supprimé avec succès.";
          res.json({ message });
        });
      })
      .catch((error) => {
        const message =
          "L'achat n'a pas pu être supprimé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  //Reccupérer tous les achats d'un dossier
  app.get("/api/achats/:AchatRepertoryId", auth, (req, res) => {
    const AchatRepertoryId = req.params.AchatRepertoryId;

    Achat.findAll({ where: { AchatRepertoryId } })
      .then((achats) => {
        if (achats.length === 0) {
          return res.status(404).json({ message: "Aucun achat trouvé" });
        }
        const message = "achats récupérés avec succès.";
        res.json({ message, data: achats });
      })
      .catch((error) => {
        const message =
          "Les achats n'ont pas pu être récupérés. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  //Reccupérer tous les achats d'un utilisateur
  app.get("/api/users/:userId/achats", auth, (req, res) => {
    const userId = req.params.userId;

    Achat.findAll({
      where: { userId },
    })
      .then((achats) => {
        if (achats.length === 0) {
          return res.status(404).json({
            message: "Aucun achats trouvés pour cet utilisateur.",
          });
        }
        const message = "Achats récupérés avec succès.";
        res.json({ message, data: achats });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Les achats n'ont pas pu être récupérés. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error.message });
      });
  });
};
