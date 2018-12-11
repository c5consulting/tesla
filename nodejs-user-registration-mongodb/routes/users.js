const express = require('express');
const router = express.Router();
const Users = require('../models/userModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let query = Users.find();
  query.sort({full_name:'desc'})
      .exec(function(err, results){
        if (err) {
          res.status(500).send(err);
        }

        res.write(results.toString());
        res.end();
      });
  //res.send('respond with a resource');
});

module.exports = router;
