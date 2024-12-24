const express = require('express');
const router = express.Router();

const data = [
    {
        link: "/product",
        name: "Danh sách sản phẩm",
    }, 
    {
        link: "/product/add",
        name: "Thêm sản phẩm",
    },
    {
        link: "/user",
        name: "Danh sách người dùng",
    },
    {
        link: "/order",
        name: "Danh sách đơn hàng",
    },
    {
        link: "/discount",
        name: "Danh sách mã giảm giá",
    },
    {
        link: "/discount/add",
        name: "Thêm mã giảm giá",
    },
    {
        link: "/category",
        name: "Danh sách danh mục",
    },
    {
        link: "/category/add",
        name: "Thêm danh mục",
    },
    {
        link: "/brand",
        name: "Danh sách thương hiệu",
    },
    {
        link: "/brand/add",
        name: "Thêm thương hiệu",
    },
];

router.get('/', (req, res) => {
    const query = req.query.query || "";
    const results = data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json(results);
});

module.exports = router;