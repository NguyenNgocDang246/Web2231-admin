const model = require("../models/payment.m");
const jwt = require("jsonwebtoken");

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
    const Id = req.body.Id;
    const user = { id: Id };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    model.insertRefreshToken(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
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
