const express = require('express');
const {
  facts_index,
  facts_create_fact,
  facts_update_category,
  facts_delete_category,
  facts_new_fact,
  facts_json,
  facts_fact,
  facts_update_fact,
  facts_delete_fact,
} = require('../controllers/factsController');

// Creating the router:
const router = express.Router();

//
router.get('/', facts_index);
//
router.post('/', facts_create_fact);
//
router.put('/', facts_update_category);
//
router.delete('/', facts_delete_category);
//
// Data needed to update the list when selecting a category
router.get('/json', facts_json);
//
router.get('/new', facts_new_fact);
//
router.get('/:factId', facts_fact);
//
router.put('/:factId', facts_update_fact);
//
router.delete('/:factId', facts_delete_fact);
//
module.exports = router;
