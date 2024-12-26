const model = require("../models/payment.m");
const jwt = require("jsonwebtoken");

module.exports = {
    createUserAccount: async (req, res) => {
        const userId = req.body.userId;
        await model.insert({id_user: userId, balance: 1000000000});
        res.sendStatus(200);
    },
  getBalance: async (req, res) => {
    const account = await model.getByUserId(req.paymentAccount.id);
    let balance = 0;

    if (!account) {
      const newAccount = {
        id_user: req.paymentAccount.id,
        balance: 0,
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
    const user = req.paymentAccount;
    const amount = req.body.amount;
    const userAccount = await model.getByUserId(user.id);
    const shopAccount = await model.getByUserId("-1");

    if(amount > userAccount.balance)
        return res.status(200).json({message: "Not enough balance"});
    const result1 = await model.updateBalance(user.id, userAccount.balance - amount);
    const result2 = await model.updateBalance("-1", shopAccount.balance + amount);
    return res.status(200).json({message: "success"});
  },
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.paymentAccount = user;
      next();
    });
  },

  getAccessToken: async (req, res) => {
    const id = req.body.id;
    const user = { id };
    const accessToken = generateAccessToken(user);
    //const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    //model.insertRefreshToken(refreshToken);
    res.json({ accessToken: accessToken });
  },

  getNewAccessToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken === null) return res.sendStatus(401);
    if (!model.checkRefreshToken(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ id: user.id });
      res.json({ accessToken: accessToken });
    });
  },

  deleteRefreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken;
    await model.deleteRefreshToken(refreshToken);
    res.sendStatus(204);
  },
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}
