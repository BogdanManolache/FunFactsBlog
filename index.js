require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const factsRouter = require('./routes/factsRouter');
const factsMiddleware = require('./middleware/factsMiddleware');

const app = express();

// Serve static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Using facts middleware
app.use(factsMiddleware);

// Homepage
app.get('/', (req, res) => {
  const homePageFacts = req.facts
    .slice(0, 3)
    .map(fact => ({ id: fact.id, title: fact.title, date: fact.date }));

  res.render('index', {
    facts: homePageFacts,
    pageTitle: 'Home',
  });
});

// Facts router
app.use('/facts', factsRouter);

// ERROR page:
app.all('*', (req, res) =>
  res.status(404).render('error', { pageTitle: 'Not Found', errorMsg: 'Page not found' })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // res.status(500).json({ message: 'Something went wrong!' });
  res.status(500).render('error', { pageTitle: 'Error', errorMsg: 'Something went wrong...' });
});

// Start server and connect to db
const PORT = process.env.PORT || 3000;
const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.9ksy5yf.mongodb.net/funfacts?retryWrites=true&w=majority`;

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}...`);
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
});
