const Product = require('../Models/Product');

// @desc    Get paginated, filtered, and sorted catalog items
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      campus,
      maxPrice,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    // 1. Build Base Filter Object
    const filter = { status: 'active' };

    // Filter by Search Query (Case-Insensitive Regex)
    if (search && search.trim() !== '') {
      filter.productTitle = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by Category
    if (category && category.trim() !== '') {
      filter.category = category.trim();
    }

    // Filter by Campus (Supports single string or array/comma-separated campuses)
    if (campus) {
      const campusList = Array.isArray(campus)
        ? campus
        : campus.split(',').map((c) => c.trim());
      filter.campus = { $in: campusList };
    }

    // Filter by Max Price
    if (maxPrice && !isNaN(maxPrice)) {
      filter.price = { $lte: Number(maxPrice) };
    }

    // 2. Build Sorting Strategy
    let sortOptions = { createdAt: -1 }; // Default: Newest first

    if (sort === 'Price: Low to High') {
      sortOptions = { price: 1 };
    } else if (sort === 'Price: High to Low') {
      sortOptions = { price: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    // 3. Setup Pagination Logic
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // 4. Query Database & Join Seller Profile
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate('sellerId', 'fullName shopName campusLocation whatsappNumber')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private (Seller/Verified)
exports.createProduct = async (req, res) => {
  try {
    const { productTitle, category, campus, price, description, images } = req.body;

    const product = await Product.create({
      sellerId: req.user._id, // Set automatically from 'protect' middleware
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID with joined seller profile info
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get campus recommendations (4 same-category + 2 cross-category)
// @route   GET /api/products/:id/recommendations
// @access  Public
exports.getCampusRecommendations = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);

    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 1. Fetch 4 items from SAME campus AND SAME category (excluding current item)
    const sameCategory = await Product.aggregate([
      {
        $match: {
          campus: currentProduct.campus,
          category: currentProduct.category,
          _id: { $ne: currentProduct._id },
          status: 'active',
        },
      },
      { $sample: { size: 4 } },
    ]);

    // Extract IDs so we don't duplicate them in cross-category
    const excludedIds = [currentProduct._id, ...sameCategory.map((p) => p._id)];

    // 2. Fetch 2 items from SAME campus AND DIFFERENT category
    const crossCategory = await Product.aggregate([
      {
        $match: {
          campus: currentProduct.campus,
          category: { $ne: currentProduct.category },
          _id: { $nin: excludedIds },
          status: 'active',
        },
      },
      { $sample: { size: 2 } },
    ]);

    res.status(200).json({
      success: true,
      recommendations: [...sameCategory, ...crossCategory],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get search recommendations (6 category-matched items based on search term)
// @route   GET /api/products/search-recommendations
// @access  Public
exports.getSearchRecommendations = async (req, res) => {
  try {
    const { term } = req.query;

    if (!term) {
      return res.status(200).json({ success: true, recommendations: [] });
    }

    // Find the primary product matching the term to identify its category
    const matchedProduct = await Product.findOne({
      productTitle: { $regex: term, $options: 'i' },
      status: 'active',
    });

    if (!matchedProduct) {
      return res.status(200).json({ success: true, recommendations: [] });
    }

    // Fetch up to 6 items from that matched category
    const recommendations = await Product.aggregate([
      {
        $match: {
          category: matchedProduct.category,
          status: 'active',
        },
      },
      { $sample: { size: 6 } },
    ]);

    res.status(200).json({
      success: true,
      category: matchedProduct.category,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};