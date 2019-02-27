var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const {
  check,
  validationResult
} = require('express-validator/check');

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/submit', [
  check('name').exists().isLength({
    min: 1
  }).withMessage('Please input the name'),
  check('email').exists().isEmail().withMessage('Please input the correct Email'),
  check('password').exists().isLength({
    min: 8,
    max: 16
  }).withMessage('Password must be 8-16 characters'),
  check('url').exists().isURL().withMessage('Please input the correct homepage URL'),
  check('title').isString(),
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('error', {
      errors: errors.array().map((item) => {
        return item.msg;
      })
    });
  }
  const md5sum = crypto.createHash('md5');
  md5sum.update(req.body.password);
  const pwHash = md5sum.digest('hex');

  const result = {
    code: 200,
    data: {
      ...req.body,
      password: pwHash,
    }
  };

  if (req.body.view) {
    delete result.data.view;
    return res.status(200).json(result);
  } else {
    res.status(200).render('success', result.data);
  }
});

module.exports = router;