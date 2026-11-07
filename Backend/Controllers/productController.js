const Product = require('../Models/Product');
const { rankProducts } = require('../Utilities/rankingEngine');

// @desc Get paginated, filtered, and sorted catalog items
// @route GET /api/products
// @access Public
exports.getProducts = async (req, res, next) => {
try {
const {
seller_id,
search,
category,
campus,
maxPrice,
sort,
page = 1,
limit = 20,
} = req.query;

const filter = { status: 'active' };

if (seller_id) {
filter.sellerId = seller_id;
}

if (search && search.trim() !== '') {
filter.productTitle = { $regex: search.trim(), $options: 'i' };
}

if (category && category.trim() !== '') {
filter.category = category.trim();
}

if (Array.isArray(campus) && campus.length > 0) {
const campusList = campus.map((value) => value.trim()).filter(Boolean);
filter.campus = { $in: campusList };
}

const requestedCampus = typeof campus === 'string' && campus.trim() && !campus.includes(',')
? campus.trim()
: null;

if (typeof campus === 'string' && campus.includes(',')) {
filter.campus = { $in: campus.split(',').map((value) => value.trim()).filter(Boolean) };
}

if (maxPrice && !isNaN(maxPrice)) {
filter.price = { $lte: Number(maxPrice) };
}

let sortOptions = { createdAt: -1 };

if (sort === 'Price: Low to High') {
sortOptions = { price: 1 };
} else if (sort === 'Price: High to Low') {

sortOptions = { price: -1 };

} else if (sort === 'oldest') {

sortOptions = { createdAt: 1 };

}


const pageNum = parseInt(page, 10) || 1;

const limitNum = parseInt(limit, 10) || 20;

const skip = (pageNum - 1) * limitNum;


const totalProducts = await Product.countDocuments(filter);

let rankedProducts;


if (requestedCampus) {

const campusFilter = { ...filter, campus: requestedCampus };

const otherCampusFilter = { ...filter, campus: { $ne: requestedCampus } };

const tierOneCount = await Product.countDocuments(campusFilter);

const tierOneSkip = Math.min(skip, tierOneCount);

const tierOneLimit = Math.max(0, Math.min(limitNum, tierOneCount - tierOneSkip));

const tierTwoSkip = Math.max(0, skip - tierOneCount);

const tierTwoLimit = limitNum - tierOneLimit;


const [tierOneProducts, tierTwoProducts] = await Promise.all([

tierOneLimit > 0

? Product.find(campusFilter)

.populate('sellerId', 'fullName shopName campusLocation whatsappNumber')

.sort(sortOptions)

.skip(tierOneSkip)

.limit(tierOneLimit)

: [],

tierTwoLimit > 0

? Product.find(otherCampusFilter)

.populate('sellerId', 'fullName shopName campusLocation whatsappNumber')

.sort(sortOptions)

.skip(tierTwoSkip)

.limit(tierTwoLimit)

: [],

]);


rankedProducts = [

...rankProducts(tierOneProducts, requestedCampus),

...rankProducts(tierTwoProducts, null),

];

} else {

const products = await Product.find(filter)

.populate('sellerId', 'fullName shopName campusLocation whatsappNumber')

.sort(sortOptions)

.skip(skip)

.limit(limitNum);

rankedProducts = rankProducts(products, req.query.userCampus || null);

}


const totalPages = Math.ceil(totalProducts / limitNum);


res.status(200).json({

success: true,

count: rankedProducts.length,

totalProducts,

totalPages,

currentPage: pageNum,

products: rankedProducts,

});

} catch (error) {

return next(error);

}

};


// @desc Create a new product listing

// @route POST /api/products

// @access Private (Seller/Verified)

exports.createProduct = async (req, res, next) => {

try {

const { productTitle, category, campus, price, description, images } = req.body;


const product = await Product.create({

sellerId: req.user._id,

productTitle,

category,

campus,

price,

description,

images,

});


res.status(201).json({

success: true,

product,

});

} catch (error) {

return next(error);

}

};


// @desc Update a product listing

// @route PUT /api/products/:id

// @access Private (Seller/Owner only)

exports.updateProduct = async (req, res, next) => {

try {

const product = await Product.findById(req.params.id);


if (!product) {

return res.status(404).json({ message: 'Product not found' });

}


if (product.sellerId.toString() !== req.user._id.toString()) {

return res.status(403).json({

message: 'Not authorized to update this listing',

});

}


const allowedFields = ['productTitle', 'category', 'campus', 'price', 'description', 'images', 'status'];

const updates = {};


Object.keys(req.body).forEach((key) => {

if (allowedFields.includes(key)) {

updates[key] = req.body[key];

}

});


if (Object.keys(updates).length === 0) {

return res.status(400).json({

success: false,

message: 'No valid fields provided for update',

});

}


const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {

new: true,

runValidators: true,

});


res.status(200).json({

success: true,

product: updatedProduct,

});

} catch (error) {

return next(error);

}

};


// @desc Delete a product listing

// @route DELETE /api/products/:id

// @access Private (Seller/Owner only)

exports.deleteProduct = async (req, res, next) => {

try {

const product = await Product.findById(req.params.id);


if (!product) {

return res.status(404).json({ message: 'Product not found' });

}


if (product.sellerId.toString() !== req.user._id.toString()) {

return res.status(403).json({

message: 'Not authorized to delete this listing',

});

}


await product.deleteOne();


res.status(200).json({

success: true,

message: 'Product deleted successfully',

productId: product._id,

});

} catch (error) {

return next(error);

}

};


// @desc Get single product by ID with joined seller profile info

// @route GET /api/products/:id

// @access Public

exports.getProductById = async (req, res, next) => {

try {

const product = await Product.findById(req.params.id).populate(

'sellerId',

'fullName shopName whatsappNumber createdAt'

);


if (!product) {

return res.status(404).json({ message: 'Product not found' });

}


res.status(200).json({

success: true,

product,

});

} catch (error) {

return next(error);

}

};


// @desc Get campus recommendations (4 same-category + 2 cross-category)

// @route GET /api/products/:id/recommendations

// @access Public

exports.getCampusRecommendations = async (req, res, next) => {

try {

const currentProduct = await Product.findById(req.params.id);


if (!currentProduct) {

return res.status(404).json({ message: 'Product not found' });

}


const recommendations = await Product.aggregate([

{

$match: {

campus: currentProduct.campus,

category: currentProduct.category,

_id: { $ne: currentProduct._id },

status: 'active',

},

},

{ $sample: { size: 6 } },

]);


res.status(200).json({

success: true,

count: recommendations.length,

recommendations,

});

} catch (error) {

return next(error);

}

};


// @desc Get search recommendations based on product title/category match

// @route GET /api/products/search-recommendations

// @access Public

exports.getSearchRecommendations = async (req, res, next) => {

try {

const { term } = req.query;


if (!term || String(term).trim() === '') {

return res.status(200).json({ success: true, recommendations: [] });

}


const cleanTerm = String(term).trim();


const recommendations = await Product.find({

status: 'active',

$or: [

{ category: { $regex: cleanTerm, $options: 'i' } },

{ productTitle: { $regex: cleanTerm, $options: 'i' } },

],

})

.sort({ createdAt: -1 })

.limit(6);


res.status(200).json({

success: true,

count: recommendations.length,

recommendations,

});

} catch (error) {

return next(error);

}

};


// @desc Increment product page views

// @route POST /api/products/:id/track-view

// @access Public

exports.trackView = async (req, res, next) => {

try {

const product = await Product.findByIdAndUpdate(

req.params.id,

{ $inc: { viewCount: 1 } },

{ new: true }

);


if (!product) {

return res.status(404).json({ message: 'Product not found' });

}


res.status(200).json({ success: true, viewCount: product.viewCount });

} catch (error) {

return next(error);

}

};


// @desc Increment WhatsApp click count

// @route POST /api/products/:id/track-whatsapp

// @access Public

exports.trackWhatsapp = async (req, res, next) => {

try {
const product = await Product.findByIdAndUpdate(
req.params.id,
{ $inc: { whatsappClicks: 1 } },
{ new: true }
);

if (!product) {
return res.status(404).json({ message: 'Product not found' });
}

res.status(200).json({ success: true, whatsappClicks: product.whatsappClicks });
} catch (error) {
return next(error);
}
}; 
