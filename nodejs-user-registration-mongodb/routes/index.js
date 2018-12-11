const mongoose = require('mongoose');

// Connect to MongoDB...
mongoose.connect('mongodb://localhost/demo');

const userModel = require('../models/userModel');
const User = mongoose.model('Users');

let crypto = require('crypto'), hmac, signature;

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize }   = require('express-validator/filter');

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'New User Register' });
});

/* POST user registration page. */
router.post('/register',[

  check('full_name','Name cannot be left blank')
      .isLength({ min: 1 }),

  check('email')
      .isEmail().withMessage('Please enter a valid email address')
      .trim()
      .normalizeEmail()
      .custom(value => {
        return findUserByEmail(value).then(User => {
          //if user email already exists throw an error
        })
      }),

  check('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 chars long')
      .matches(/\d/).withMessage('Password must contain one number')
      .custom((value,{req, loc, path}) => {
        if (value !== req.body.cpassword) {
          // throw error if passwords do not match
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),

  check('terms','Please accept our terms and conditions').equals('yes'),

], function(req, res, next) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    res.json({status : "error", message : errors.array()});

  } else {

    hmac = crypto.createHmac("sha1", 'auth secret');
    var encpassword = '';

    if(req.body.password){
      hmac.update(req.body.password);
      encpassword = hmac.digest("hex");
    }
    var document = {
      full_name:   req.body.full_name,
      email:       req.body.email,
      password:    encpassword
    };

    var user = new User(document);
    user.save(function(error){
      console.log(user);
      if(error){
        throw error;
      }
      res.json({message : "Data saved successfully.", status : "success"});
    });
  }
});

function findUserByEmail(email){

  if(email){
    return new Promise((resolve, reject) => {
      User.findOne({ email: email })
          .exec((err, doc) => {
            if (err) return reject(err)
            if (doc) return reject(new Error('This email already exists. Please enter another email.'))
            else return resolve(email)
          })
    })
  }
}


module.exports = router;