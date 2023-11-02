const Fact = require('../models/factModel');

// Get all facts:
const facts_index = (req, res, next) => {
  const allFacts = req.facts.map(fact => ({
    id: fact.id,
    title: fact.title,
    category: fact.category,
    date: fact.date,
  }));

  const allCategories = [...new Set(req.facts.map(fact => fact.category))].sort();

  res.render('facts', { facts: allFacts, categories: allCategories, pageTitle: 'Facts' });
};

// Create new fact:
const facts_create_fact = async (req, res) => {
  try {
    await Fact.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category[0].toUpperCase() + req.body.category.slice(1),
    });

    res.redirect(`/facts`);
  } catch (err) {
    console.log(err);
  }
};

// Update category:
const facts_update_category = async (req, res) => {
  try {
    await Fact.updateMany({ category: req.body.category }, { category: req.body.newCategory });

    res.json({ redirect: '/facts' });
  } catch (err) {
    console.log(err);
  }
};

// Delete category:
const facts_delete_category = async (req, res) => {
  try {
    await Fact.deleteMany({ category: req.body.category });

    res.json({ redirect: '/facts' });
  } catch (err) {
    console.log(err);
  }
};

// New fact form:
const facts_new_fact = (req, res) => {
  res.render('new', { pageTitle: 'New Fact' });
};

// Getting json data:
const facts_json = (req, res) => {
  try {
    res.json(req.facts);
  } catch (err) {
    res.status(404).res.json({ message: 'Not found' });
  }
};

// Viewing a single fact:
const facts_fact = (req, res) => {
  const factDetails = req.facts.find(fact => fact.id === req.params.factId);

  if (!factDetails)
    return res.status(404).render('error', { pageTitle: 'Not Found', errorMsg: 'Page not found' });

  res.render('fact', { fact: factDetails, pageTitle: 'Fact' });
};

// Updating a fact:
const facts_update_fact = async (req, res) => {
  try {
    await Fact.updateOne({ _id: req.params.factId }, req.body);

    res.json({ redirect: '/facts' });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: 'Something went wrong' });
  }
};

// Deleting a fact:
const facts_delete_fact = async (req, res) => {
  try {
    await Fact.deleteOne({ _id: req.params.factId });

    res.json({ redirect: '/facts' });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: 'Something went wrong' });
  }
};

// Export controller functions:
module.exports = {
  facts_index,
  facts_create_fact,
  facts_update_category,
  facts_delete_category,
  facts_new_fact,
  facts_json,
  facts_fact,
  facts_update_fact,
  facts_delete_fact,
};
