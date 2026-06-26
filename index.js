const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

let products = []
let nextId = 1;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Products API is running' });
})

app.get('/products', (req, res) => {
    if(products.length === 0) {
        return res.status(404).json(
            { message: 'No products found' }
        );
    }

    const { category } = req.query;

    if(!category) {
        return res.status(200).json(products);
    }
    
    const filteredProds = products.filter(prdt => 
        prdt.category.toLowerCase().includes(category.toLowerCase())
    );

    if(filteredProds.length === 0) {
        return res.status(404).json({
            message: "No products found in this category"
        });
    }
    res.status(200).json(filteredProds)
});

app.post('/products', (req, res) => {
    const { product, category } = req.body;
    const newProduct = {
        id: nextId,
        product: product,
        category: category
    }
    nextId++;
    products.push(newProduct);

    res.status(201).json(
        { message: `Product: '${product}' added successfully`}
    );
});

app.put('/products/:id', (req, res) => {
    const { product, category } = req.body;
    const productId = Number(req.params.id);
    const index = products.findIndex(prdt => prdt.id === productId);

    if(index === -1) {
        res.status(404).json(
            { message: `Product with ID: ${productId} not found` }
        );
        return;
    }

    products[index].product = product;
    products[index].category = category;
    res.status(200).json(
        { message: `ID: ${productId} | Product: '${product}' updated successfully` }
    );
});

app.delete('/products/:id', (req, res) => {
    const productId = Number(req.params.id);
    const index = products.findIndex(prdt => prdt.id === productId);

    if(index === -1) {
        res.status(404).json(
            { message: `Product with ID: ${productId} not found` }
        );
        return;
    }
    const deletedProduct = products[index];
    products.splice(index, 1);
    res.status(200).json(
        { message: `ID: ${productId} | Product: '${deletedProduct.product}' deleted successfully` }
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});