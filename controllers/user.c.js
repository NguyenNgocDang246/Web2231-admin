const userModel = require("../models/user.m");
const CError = require("../utils/cerror");
const PER_PAGE = 10;

module.exports = {
    index: async (req, res, next) => {
        try {
            const currentPage = 1;
            const totalUsers = await userModel.count();
            const users = await userModel.users(currentPage, PER_PAGE);
            const totalPages = Math.ceil(totalUsers / PER_PAGE);
            const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

            res.render("user/list", {
                title: "Người dùng",
                user: req.session.user,
                users,
                currentPage,
                pages,
                prevPage: currentPage > 1 ? currentPage - 1 : null,
                nextPage: currentPage < totalPages ? currentPage + 1 : null,
                totalPages,
            });
        } catch (error) {
            console.log(error);
            next(new CError(500, "Error get all users", error.message));
        }
    },
    list: async (req, res, next) => {
        try {
            const currentPage = req.query.page || 1;
            const users = await userModel.users(currentPage, PER_PAGE);
            res.json(users);
        } catch (error) {
            next(new CError(500, "Error get all users", error.message));
        }
    },
    one: async (req, res, next) => {
        try {
        const id = req.params.id;
        const user = await userModel.one(id);
        res.render("user/userDetail", {
            user: req.session.user,
            thisUser: user,
            title: "Thông tin người dùng",
        });
        } catch (error) {
            next(new CError(500, "Error get user", error.message));
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.id;
            await userModel.delete(id);
            res.redirect("/users");
        } catch (error) {
            next(new CError(500, "Error delete user", error.message));
        }
    },
};

