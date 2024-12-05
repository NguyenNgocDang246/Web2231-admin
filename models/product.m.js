const mongoose = require('mongoose');

// Định nghĩa schema cho User
const productSchema = new mongoose.Schema({
    name: { type: String},
});


// Tạo model từ schema
const Product = mongoose.model('Product', productSchema, 'products');

module.exports = ({
    all: async (page = 1, productPerPage = null) => {
        try {
            if(productPerPage)
            {
                const skip = (page - 1) * productsPerPage;
                const products = await Product.find().skip(skip).limit(productPerPage).lean();
                return products;
            }
            else 
            {
                const products = await Product.find().skip(page - 1).lean();
                return products;
            }
            
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    },
    one: async (id) => {
        try
        {
            const product = await Product.findById(id).lean();
            return product;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
        
    },
    find: async (condition = {}, page = 1, productPerPage = null, sort = {}) => {
        try {
            const skip = (page - 1) * productPerPage;
            if(productPerPage)
            {
                const products = await Product.find(condition).sort(sort).skip(skip).limit(productPerPage).lean();
                return products;
            }
            else 
            {
                const products = await Product.find(condition).sort(sort).skip(skip).lean();
                return products;
            }
            
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    }, 
    count: async (condition) => {
        return await Product.countDocuments(condition);
    }
})

