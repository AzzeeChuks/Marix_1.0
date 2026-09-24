const calculateFreshnessScore = (createdAt) => {
  if (!createdAt) return 0;

  const ageInDays =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);

  if (ageInDays >= 28) return 0;

  const freshness = 100 - (ageInDays / 28) * 100;
  return Math.max(0, Math.round(freshness));
};

const calculateInteractionScore = (product = {}) => {
  const views = Number(product.viewCount || 0);
  const whatsapp = Number(product.whatsappClicks || 0);
  const saves = Number(product.savesCount || product.savedCount || 0);

  const viewsWeight = 1;
  const whatsappWeight = 5;
  const savesWeight = 3;

  return views * viewsWeight + whatsapp * whatsappWeight + saves * savesWeight;
};

const calculateProductRank = (product, userCampus = null) => {
  const productObj = product && typeof product.toObject === 'function'
    ? product.toObject()
    : product || {};

  const freshnessScore = calculateFreshnessScore(productObj.createdAt);
  const interactionScore = calculateInteractionScore(productObj);

  let locationScore = 0;
  if (
    userCampus &&
    productObj.campus &&
    String(productObj.campus).toLowerCase() === String(userCampus).toLowerCase()
  ) {
    locationScore = 50;
  }

  const totalRankScore = freshnessScore + interactionScore + locationScore;

  return {
    ...productObj,
    scores: {
      freshnessScore,
      interactionScore,
      locationScore,
      totalRankScore,
    },
  };
};

const rankProducts = (products = [], userCampus = null) => {
  return products
    .map((product) => calculateProductRank(product, userCampus))
    .sort((a, b) => (b.scores.totalRankScore || 0) - (a.scores.totalRankScore || 0));
};

module.exports = {
  calculateFreshnessScore,
  calculateInteractionScore,
  calculateProductRank,
  rankProducts,
};
