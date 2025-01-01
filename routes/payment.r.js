const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.c');
router.use(express.json());

router.post('/createAccount', controller.createUserAccount);
router.get('/getBalance', controller.authenticateToken, controller.getBalance);
router.post('/getAccessToken', controller.getAccessToken); //
router.post('/token', controller.getNewAccessToken);
router.delete('/logout', controller.deleteRefreshToken);
router.post('/transferMoney', controller.authenticateToken, controller.transferMoney); //

module.exports = router;