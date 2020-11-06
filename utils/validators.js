const { body } = require('express-validator');
const  User = require('../models/user');

exports.registerValidators = [
  body('email')
    .isEmail().withMessage('Input the correct email')
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('This email have already exist')
        }
      } catch (e) {
        console.log(e)
      }
    })
    .normalizeEmail(),

  body('password', 'The password should have 6 symbols')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),

  body('confirm')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('The password is not confirm')
      }
      return true
    })
    .trim(),
  body('name')
    .isLength({min: 3}).withMessage('The name should have 3 symbols')
    .trim()
];

exports.courseValidators = [
  body('title').isLength({min: 3})
    .withMessage('The name should have 3 symbols')
    .trim(),
  body('price').isNumeric()
    .withMessage('Input the correct price'),
  body('img', 'Input the correct Url oth the picture').isURL()
];
