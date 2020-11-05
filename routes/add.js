const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');
const Course = require('../models/courses');

router.get('/', auth, (req, res) => {
  res.render('add-course', {
    title: 'Add course',
    isAdd: true
  });
});

router.post('/', auth, async (req, res) => {
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
