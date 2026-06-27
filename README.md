# Products API

A REST API to manage products built with Node.js, Express.js and MongoDB.

## Features
- Add a new product
- Get all products
- Get a product by ID
- Update a product
- Delete a product
- Filter products by category

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose

## How to Run
npm install
npm run dev

## API Endpoints
- POST   /products               - Add a product
- GET    /products               - Get all products
- GET    /products/:id           - Get a product by ID
- PUT    /products/:id           - Update a product
- DELETE /products/:id           - Delete a product
- GET    /products?category=     - Filter by category
