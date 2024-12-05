const mongoose = require('mongoose');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
    name: { type: String},
});


// Tạo model từ schema
const Users = mongoose.model('Users', userSchema, 'users');

module.exports = ({
    all: async (page = 1, userPerPage = null) => {
        try {
            const skip = (page - 1) * userPerPage;
            if(userPerPage)
            {
                const users = await Users.find().skip(skip).limit(userPerPage).lean();
                return users;
            }
            else 
            {
                const users = await Users.find().skip(skip).lean();
                return users;
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
            const user = await Users.findById(id).lean();
            return user;
        }
        catch(e)
        {
            console.error('Error:', e);
        }
    }
})

