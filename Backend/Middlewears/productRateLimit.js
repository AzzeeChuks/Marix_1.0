 const Product = require('../Models/Product');


const enforceDailyProductLimit = async (req, res, next) => {

try {

const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

const recentListings = await Product.countDocuments({

sellerId: req.user._id,

createdAt: { $gte: since },

});


if (recentListings >= 5) {

return res.status(429).json({

message: 'Daily limit of 5 listings reached. Try again tomorrow!',

});

}


return next();

} catch (error) {

return next(error);

}

};


module.exports = { enforceDailyProductLimit }; 
