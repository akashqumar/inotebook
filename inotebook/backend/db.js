const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/inotebook";     // inotebook is the name of the database

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => {
    console.log("Connection Successful");
}).catch((e) => {
    console.log("No Connection");
});
