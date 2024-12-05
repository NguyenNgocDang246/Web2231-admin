module.exports = ({
    add: async (req, res) => {
        const { productId, quantity } = req.body;
        // Logic xử lý thêm sản phẩm vào giỏ hàng
        res.json({ message: 'Product added to cart successfully!' });
    }
})