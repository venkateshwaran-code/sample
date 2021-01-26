const mongoose=require('mongoose');

const DonationSchema=new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Phone: {
        type: Number,
        required: true,
    },
    City: {
        type: String,
        required:true,
    },
});

module.exports=new mongoose.model("Donation",DonationSchema);