const mongoose=require('mongoose');

const URI="mongodb+srv://venkat:venkat@cluster1.aw3xe.mongodb.net/databaseName?retryWrites=true&w=majority";
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
function databaseconnection()
{
    mongoose.connect(URI,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

}

module.exports=databaseconnection;