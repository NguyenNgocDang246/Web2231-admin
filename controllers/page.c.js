const productModel = require('../models/product.m');

module.exports = ({
    home: async (req, res) => {
        const products = await productModel.all();
        
        products.forEach(product => {
            if (product.image && Array.isArray(product.image)) 
            {
                product.mainImg = product.image[0]; // Lấy hình ảnh đầu tiên
            } 
            else 
            {
                product.mainImg = null; // Không có hình ảnh
            }
        });
        res.render('Home', {
            user:  req.session.user,
            products: products
        });
    },
    login: async (req, res) => {
        const { username, password, remember } = req.body;
        const users = await userModel.getAll();
        const user = users.find(u => u.psername === username);
        if (user) {
            const salt = user.password.slice(64);
            const pwHashSaved = user.password.slice(0, 64);
            const pw_salt = password + salt;
            const pwHash = sha256(pw_salt);
            if(pwHashSaved === pwHash)
            {
                 // Lưu user vào session
                req.session.user = {
                    username: user.username, 
                    remember: false,
                    role: 'normal'};

                if(remember) 
                {
                    req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000;
                    req.session.user.remember = true;
                }
                else req.session.cookie.expires = false;
                return res.redirect('/home');
            }
            else res.redirect('/login?fail=true');
        }
        else res.redirect('/login?fail=true');
    },
    register: async (req, res) => {
        const newUser = req.body;
        const users = await userModel.getAll();
        const hasAcc = users.find(u => u.username === newUser.username);
        if(hasAcc) 
        {
            res.send('Duplicate username');
            return;
        }
        newUser.Permission = 1;

        const salt = (new Date()).getTime().toString();
        const pw_salt = newUser.password + salt;
        const pwHash = sha256(pw_salt);
        newUser.password = pwHash + salt;

        userModel.add(newUser);
        res.redirect('/login');
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) 
            {
                return res.status(500).send("Có lỗi khi đăng xuất.");
            }
        });
        res.redirect('/');
    }
})