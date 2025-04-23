const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

// Путь к JSON файлу
const dataPath = path.join(__dirname, '../data/products.json');

// Получение всех товаров
router.get('/', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }
        res.json(JSON.parse(data));
    });
});

// Добавление товара
router.post('/', (req, res) => {
    const newProduct = req.body;
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }
        const products = JSON.parse(data);
        products.push(newProduct);
        fs.writeFile(dataPath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving data' });
            }
            res.status(201).json(newProduct);
        });
    });
});

// Редактирование товара
router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }
        const products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }
        products[productIndex] = { ...products[productIndex], ...req.body };
        fs.writeFile(dataPath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving data' });
            }
            res.json(products[productIndex]);
        });
    });
});

// Удаление товара
router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data' });
        }
        const products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }
        products.splice(productIndex, 1);
        fs.writeFile(dataPath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving data' });
            }
            res.status(204).send();
        });
    });
});

module.exports = router;