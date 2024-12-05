const mongoose = require('mongoose');

// Định nghĩa schema cho User
const reviewSchema = new mongoose.Schema({
    name: { type: String},
});


// Tạo model từ schema
const Reviews = mongoose.model('Reviews', reviewSchema, 'reviews');

module.exports = ({
    all: async (page = 1, reviewPerPage = null) => {
        try {
            const skip = (page - 1) * reviewPerPage;
            if(reviewPerPage)
            {
                const reviews = await Reviews.find().skip(skip).limit(reviewPerPage).lean();
                return reviews;
            }
            else 
            {
                const reviews = await Reviews.find().skip(skip).lean();
                return reviews;
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
            const review = await Reviews.findById(id).lean();
            return review;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    },
    find: async (condition = {}, page = 1, reviewPerPage = null) => {
        try {
            const skip = (page - 1) * reviewPerPage;
            if(reviewPerPage)
            {
                const reviews = await Reviews.find(condition).skip(skip).limit(reviewPerPage).lean();
                return reviews;
            }
            else 
            {
                const reviews = await Reviews.find(condition).skip(skip).lean();
                return reviews;
            }
            
        }
        catch (e) 
        {
            console.error('Error:', e);
        }
    }, 
})

