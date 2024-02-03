const express = require('express');
const controllers = require('../controllers/gmailapi.controller');
const router = express.Router();

router.get('/mail/user/:email', controllers.getUser);
router.post('/mail/send', controllers.sendMail);
router.get('/mail/read/:email/:messageId', controllers.readMail);
router.get('/mail/drafts/:email', controllers.getDrafts);
router.get('/mail/list/:email', controllers.getMails);

module.exports = router;
