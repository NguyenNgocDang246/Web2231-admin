const model = require("../models/payment.m");

module.exports = {
  getBalance: async (req, res) => {
    const account = await model.getByUserId(req.paymentAccount.id);

    let balance = 0;

    if (!account) {
      const newAccount = {
        ID: req.paymentAccount.id,
        SoDu: 0,
      };
      try {
        await model.insert(newAccount);
      } catch (error) {
        console.log("Creat new payment account error");
      }
    } else {
      balance = account.SoDu;
    }
    res.json({ balance: balance });
  },

  transferMoney: async (req, res, next) => {
    const id = req.body.id;
    const amount = req.body.amount;
    const result1 = await model.updateBalance(id, -amount);
    const result2 = await model.updateBalance(-1, amount);
    res.sendStatus(200);
  },
};
