const Fact = require('../models/factModel');

// Facts middleware
async function factsMiddleware(req, res, next) {
  try {
    const data = await Fact.find();

    req.facts = data.reverse().map(fact => ({
      id: fact._id.toString(),
      title: fact.title,
      description: fact.description,
      category: fact.category,
      date: new Date(fact.createdAt).toLocaleDateString(),
    }));
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = factsMiddleware;
