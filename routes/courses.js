const { Router } = require('express');
const router = Router();
const { validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const Course = require('../models/courses');

router.get('/', async (req, res) => {
  const courses = await Course.find().populate('userId', 'email name');
  res.render('courses', {
    title: 'Courses',
    isCourses: true,
    courses,
  });
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }
  const course = await Course.findById(req.params.id);
  res.render('course-edit', {
    title: `Edit ${course.title}`,
    course,
  })
});

router.post('/edit', auth, courseValidators, async (req, res) => {
  const error = validationResult(req);
  const { id } = req.body;
  if (!error.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }
  try {
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
  } catch (e) {
    console.log(e)
  }
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect('/courses');
  } catch (e) {
    console.log(e)
  }
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render('course', {
    layout: 'empty',
    title: `Course ${course.title}`,
    course
  });
});

module.exports = router;
