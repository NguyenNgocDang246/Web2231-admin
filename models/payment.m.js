const { create } = require("hbs");
const mongoose = require("mongoose");

// Định nghĩa schema cho User
const bankAccountSchema = new mongoose.Schema({
  id_user: { type: String, required: true, unique: true },
  balance: { type: Number },
});

const paymentLogSchema = new mongoose.Schema({
  id_receiver: { type: String, required: true },
  id_sender: { type: String, required: true },
  amount: { type: Number },
  date: { type: Date, default: Date.now() },
  description: { type: String },
  status: { type: String , default: "pending"},
})

// Tạo model từ schema
const BankAccount = mongoose.model(
  "BankAccount",
  bankAccountSchema,
  "bankAccounts"
);

const PaymentLog = mongoose.model(
  "PaymentLog",
  paymentLogSchema,
  "paymentLogs"
);

let initalized = false;
async function createShopAccount() {
    if(initalized){
        return;
    }
    initalized = true;
    const existAccount = await BankAccount.findOne({ id_user: "-1" });
    if(existAccount){
        return;
    }
    const newAccount = {
        id_user: "-1",
        balance: 0,
    };
    BankAccount.create(newAccount);
}

async function ensureInitalized() {
    if(initalized) return;
    await createShopAccount();
}

module.exports = {
  all: async (page = 1, accountPerPage = null) => {
    await ensureInitalized();
    try {
      const skip = (page - 1) * accountPerPage;
      if (accountPerPage) {
        const account = await BankAccount.find()
          .skip(skip)
          .limit(accountPerPage)
          .lean();
        return account;
      } else {
        const account = await BankAccount.find().skip(skip).lean();
        return account;
      }
    } catch (e) {
      console.error("Error:", e);
    }
  },
  one: async (id) => {
    await ensureInitalized();
    try {
      const account = await BankAccount.findById(id).lean();
      return account;
    } catch (e) {
      console.error("Error:", e);
    }
  },
  getByUserId: async (userId) => {
    await ensureInitalized();
    try {
      const accounts = await BankAccount.findOne({ id_user: userId }).lean();
      return accounts;
    } catch (e) {
      console.error("Error:", e);
    }
  },

  updateBalance: async (userId, newBalance) => {
    await ensureInitalized();
    try {
      const updatedAccount = await BankAccount.findOneAndUpdate(
        { id_user: userId },
        { $set: { balance: newBalance } },
        { new: true, lean: true }
      );
      return updatedAccount;
    } catch (e) {
      console.error("Error:", e);
    }
  },
  insert: async (account) => {
    await ensureInitalized();
    try {
      const newAccount = await BankAccount.create(account);
      return newAccount;
    } catch (e) {
      console.error("Error:", e);
    }
  },
  createPaymentLog: async (paymentLog) => {
    await ensureInitalized();
    try {
      const newPaymentLog = await PaymentLog.create(paymentLog);
      return newPaymentLog;
    } catch (e) {
      console.error("Error:", e);
    }
  },
};
