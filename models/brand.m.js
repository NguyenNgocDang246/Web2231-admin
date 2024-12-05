const mongoose = require('mongoose');

// Định nghĩa schema cho User
const brandSchema = new mongoose.Schema({
    name: { type: String},
});


// Tạo model từ schema
const Brands = mongoose.model('Brands', brandSchema, 'brands');

module.exports = ({
    all: async (page = 1, brandPerPage = null) => {
        try {
            const skip = (page - 1) * brandPerPage;
            if(brandPerPage)
            {
                const brands = await Brands.find().skip(skip).limit(brandPerPage).lean();
                return brands;
            }
            else 
            {
                const brands = await Brands.find().skip(skip).lean();
                return brands;
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
            const brand = await Brands.findById(id).lean();
            return brand;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    }
})

