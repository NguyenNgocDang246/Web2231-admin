const mongoose = require('mongoose');

// Định nghĩa schema cho User
const categorySchema = new mongoose.Schema({
    name: { type: String},
});


// Tạo model từ schema
const Category = mongoose.model('Category', categorySchema, 'categories');

module.exports = ({
    all: async (page = 1, categoryPerPage = null) => {
        try {
            const skip = (page - 1) * categoryPerPage;
            if(categoryPerPage)
            {
                const categories = await Category.find().skip(skip).limit(categoryPerPage).lean();
                return categories;
            }
            else 
            {
                const categories = await Category.find().skip(skip).lean();
                return categories;
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
            const category = await Category.findById(id).lean();
            return category;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    },
    find: async (condition = {}, page = 1, categoryPerPage = null, sort = {}) => {
        try {
            const skip = (page - 1) * categoryPerPage;
            if(categoryPerPage)
            {
                const categories = await Category.find(condition).sort(sort).skip(skip).limit(categoryPerPage).lean();
                return categories;
            }
            else 
            {
                const categories = await Category.find(condition).sort(sort).skip(skip).lean();
                return categories;
            }
            
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    },
})

