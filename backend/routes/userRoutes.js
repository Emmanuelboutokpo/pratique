const express = require('express');
const { requireSignin } = require('../common-middleware');
const { signup, signin, refreshToken, deleteUser } = require('../controller/userCntroller');
const router = express.Router();

router.post('/refresh',refreshToken);
router.post('/signup', signup);
router.post('/signin',signin);
router.delete('/deleted/:id',requireSignin, deleteUser)
module.exports = router;