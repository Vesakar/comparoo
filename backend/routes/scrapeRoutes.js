const express = require('express');
const puppeteer = require('puppeteer');
const Product = require('../models/Product');

const router = express.Router();

// Scrape Product Data
router.post('/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Emulate a browser to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.198 Safari/537.36'
    );
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });

    // Wait for the product details
    await page.waitForSelector('#productTitle', { visible: true });

    const productData = await page.evaluate(() => {
      const title = document.querySelector('#productTitle')?.textContent.trim();
      const price =
        document.querySelector('.a-price .a-offscreen')?.textContent.trim() ||
        document.querySelector('#priceblock_ourprice')?.textContent.trim();
      const image = document.querySelector('#imgTagWrapperId img')?.src;

      return { title, price, image };
    });

    await browser.close();

    if (productData.title) {
      const product = new Product(productData);
      await product.save();
      return res.status(200).json(product);
    }

    res.status(404).json({ message: 'Product details not found' });
  } catch (error) {
    console.error('Error scraping:', error.message);
    res.status(500).json({ message: 'Failed to scrape product', error: error.message });
  }
});

// Get All Products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

module.exports = router;
