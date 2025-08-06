// Import the Product and FeaturedCategory models
const Product = require('../models/productModel');
const FeaturedCategory = require('../models/featuredCategoryModel');

// =========================================
// 🔵 CREATE PRODUCT FUNCTION
// =========================================
const createProduct = async (req, res) => {
  try {
    // Destructure required fields from request body
    const {
      title,
      slug,
      category,
      price,
      stock,
      description,
      sizes,
      images // images will be an array of image URLs
    } = req.body;

    // 📝 Create a new product instance using the Product model
    const product = new Product({
      title,
      slug,
      category,
      price,
      stock,
      description,
      sizes,
      images // should be an array like ['url1', 'url2']
    });

    // 💾 Save product to database
    const savedProduct = await product.save();

    // ✅ Send success response
    res.status(201).json(savedProduct);
  } catch (error) {
    // ❌ Handle and send any error that occurs
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Product creation failed', error });
  }
};

// =========================================
// 🟠 GET ALL PRODUCTS WITH FILTERING
// =========================================
const getAllProducts = async (req, res) => {
  try {
    // Extract filters from query params (optional)
    const { category, min, max, sort } = req.query;

    const filter = {}; // 🧱 Initialize empty MongoDB query object

    console.log('🔍 Incoming query params:', req.query); // Log for debugging

    // ✅ If category slug is passed, find its corresponding _id
   // ✅ If category slug is passed, find its corresponding _id or fallback to plain match
if (category) {
  const categoryDoc = await FeaturedCategory.findOne({ slug: category });

  if (categoryDoc) {
    filter.category = category
  } else {
    // Fallback for string-based categories (like 'men', 'electronics', etc.)
    filter.category = category;
  }
}


    // 💰 Handle price filtering
    if (min || max) filter.price = {};
    if (min) filter.price.$gte = Number(min); // greater than equal to
    if (max) filter.price.$lte = Number(max); // less than equal to

    console.log('🧱 Final MongoDB filter:', filter); // Final filter object

    let query = Product.find(filter); // Create initial Mongoose query

    // 🔃 Apply sorting logic
    if (sort === 'low') query = query.sort({ price: 1 }); // low to high
    else if (sort === 'high') query = query.sort({ price: -1 }); // high to low
    else query = query.sort({ createdAt: -1 }); // default: newest first

    // 📦 Populate category details inside each product
    const products = await query.populate('category', 'name slug');

    // ✅ Return the final result
    res.status(200).json(products);
  } catch (error) {
    // ❌ Catch any unexpected errors
    console.error('❌ Error fetching filtered products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// =========================================
// 🟢 GET SINGLE PRODUCT BY SLUG
// =========================================
const getProductBySlug = async (req, res) => {
  try {
    console.log('🔍 Requested slug:', req.params.slug);

    // Double check if slug exists in DB
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      'category',
      'name slug'
    );

    if (!product) {
      console.warn('⚠️ No product found with slug:', req.params.slug);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('✅ Product found:', {
      title: product.title,
      slug: product.slug,
      category: product.category,
    });

    res.status(200).json(product);
  } catch (error) {
    console.error('❌ Error fetching product by slug:', error.message);
    console.error('📛 Full Error Stack:', error.stack);
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};


// =========================================
// EXPORT CONTROLLERS
// =========================================
module.exports = {
  createProduct,
  getAllProducts,
  getProductBySlug,
};
