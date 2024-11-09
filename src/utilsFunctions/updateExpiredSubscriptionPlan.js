const { Op } = require("sequelize");
const { UserSubscription } = require("../db/sequelize");

async function updateExpiredSubscriptions() {
  const now = new Date();

  await UserSubscription.update(
    { planAbonnement: 0 }, // Exemple : planAbonnement mis à 0 pour marquer l'abonnement comme expiré
    {
      where: {
        endDate: { [Op.lt]: now },
        planAbonnement: { [Op.ne]: 0 }, // Seuls les abonnements actifs sont mis à jour
      },
    }
  );

  console.log("Mise à jour des abonnements expirés terminée.");
}

module.exports = updateExpiredSubscriptions;
