const { Router } = require('express');
const router = Router();
const { validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const Course = require('../models/courses');
const { courseValidators } = require('../utils/validators');

router.get('/', auth, (req, res) => {
  res.render('add-course', {
    title: 'Add course',
    isAdd: true
  });
});

router.post('/', auth, courseValidators, async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render('add-course', {
      title: 'Add course',
      isAdd: true,
      error: error.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
      }
    })
  }

  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user
  });

  try {
    await course.save();
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
