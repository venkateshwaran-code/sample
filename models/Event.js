const mongoose=require("mongoose");

const EventSchema=new mongoose.Schema({

    Name: {
        type: String,
        required: true,
    },
    Eventdate: {
        type: Date,
        required: true,
    },

});


module.exports=new mongoose.model("Event",EventSchema);