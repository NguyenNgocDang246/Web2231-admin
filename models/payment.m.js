const mongoose = require("mongoose");

// Định nghĩa schema cho User
const bankAccountSchema = new mongoose.Schema({
  id_user: { type: String },
  balance: { type: Number },
});

// Tạo model từ schema
const BankAccount = mongoose.model(
  "BankAccount",
  bankAccountSchema,
  "bank_account"
);

module.exports = {
  all: async (page = 1, accountPerPage = null) => {
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
    try {
      const account = await BankAccount.findById(id).lean();
      return account;
    } catch (e) {
      console.error("Error:", e);
    }
  },
  getByUserId: async (userId) => {
    try {
      const accounts = await BankAccount.find({ id_user: userId }).lean();
      return accounts;
    } catch (e) {
      console.error("Error:", e);
    }
  },

  updateBalance: async (userId, newBalance) => {
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
};
