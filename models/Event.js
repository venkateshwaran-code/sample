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
    Eventduration:{
        type: Number,
        required: true,
    },

});


module.exports=new mongoose.model("Event",EventSchema);