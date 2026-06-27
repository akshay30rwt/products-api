const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const app = express();

const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/productdb').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Connection failed', error);
});


app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Products API is running'
    });
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        const { category } = req.query;

        if(!category) {
            if(products.length === 0) {
                return res.status(404).json({
                    message: 'There are no products'
                });
            }
            return res.status(200).json(products);
        }

        const filteredProducts = products.filter(product => 
            product.category.toLowerCase().includes(category.toLowerCase())
        );

        if(filteredProducts.length === 0) {
            return res.status(404).json({
                message: `No ${category} category products here`
            });
        }
        res.status(200).json(filteredProducts);
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if(!product) {
            return res.status(404).json({
                message: 'No product with this ID'
            });
        }

        res.status(200).json(product);
    }
    catch(error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
});

app.post('/products', async (req, res) => {
    try {
        const { name, price, category, stock } = req.body;
        const product = new Product({ name, price, category, stock });
        await product.save();

        res.status(201).json({
            message: 'Product added successfully',
            product
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const { name, price, category, stock } = req.body;
        const { id } = req.params;

        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, category, stock }, { new: true });
        if(!updatedProduct) {
            return res.status(404).json({
                message: `Product with ID: ${id} not found`
            });
        }
        
        res.status(200).json({
            message: 'Product updated successfully',
            updatedProduct
        });
    }
    catch(error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct) {
            return res.status(404).json({
                message: `Invalid ID: ${id}`
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            deletedProduct
        });
    } 
    catch(error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});