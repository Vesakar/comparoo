const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scrapeRoutes = require('./routes/scrapeRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://pvvesakar:pvvesakar@clustercomparo.9twnd.mongodb.net/?retryWrites=true&w=majority&appName=Clustercomparo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', scrapeRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
