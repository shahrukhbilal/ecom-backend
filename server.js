require('dotenv').config()
const  express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000;

const connectDB= require('./config/dbConnection')
const heroSliderRoutes = require('./routes/heroSliderRoutes')
const categoryRoutes = require('./routes/categoryRoutes');
const featuredCategoryRoutes = require('./routes/featuredCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderHandlerRoutes = require('./routes/orderHandlerRoutes');
const handleLoginRoutes= require('./routes/handleLoginRoutes')
const contactRoutes= require('./routes/contactRoutes')
const adminRoutes = require('./routes/adminRoutes')
const paymentRoutes = require("./routes/paymentRoutes");
const stripeOrderRoutes= require('./routes/stripeOrderRoutes')

connectDB()

app.use(cors({ origin: "*" }));


app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is live 🚀');
});


app.use('/api/heroslides', heroSliderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/featured-categories', featuredCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderHandlerRoutes); 
app.use('/api/auth', handleLoginRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin' , adminRoutes)
app.use("/api/payment", paymentRoutes);
app.use('/api/stripe-orders',stripeOrderRoutes);



app.listen(PORT, (req, res)=>{
    console.log('server is running ')
})

module.exports = app;

