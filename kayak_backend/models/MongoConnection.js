var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/kayak_database";


function MongoConnection(){
    mongoose.connect(url, function(err){
       if(err){
           throw err;
       }else{
           return mongoose;
       }
    });
}


function closeConnection(conn){
    conn.end();
}