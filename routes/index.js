const express = require('express');
const router = express.Router();
const crypto = require('crypto');
// const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const iconv = require('iconv-lite');
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
  check('url').exists().isURL().withMessage('Please input the correct homepage URL')
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('error', {
      errors: errors.array().map((item) => {
        return item.msg;
      }).join(',')
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

  request({
    url: req.body.url,
    encoding: null
  }, function (error, response, body) {
    if (response && response.statusCode === 200) {
      const $ = cheerio.load(body.toString());
      let charset = 'UTF-8';
      for (let i = 0; i < $("meta").length; i++) {
        // console.log($("meta")[i].attribs);
        if ($("meta")[i].attribs.charset) {
          charset = $("meta")[i].attribs.charset;
          break;
        }
      }
      const html = iconv.decode(body, charset)
      const $$ = cheerio.load(html, {
        decodeEntities: false
      });
      result.data.title = $$('title').text();
    }
    if (req.body.view) {
      delete result.data.view;
      res.status(200).json(result);
    } else {
      res.status(200).render('success', result.data);
    }
  })
});

module.exports = router;