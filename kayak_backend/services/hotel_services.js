var Hotels = require('../models/hotels');
var UserTrace = require('./../models/user_trace');



exports.searchHotelsAdmin = function(data, callback){
    console.log("In searchHotelsAdmin");
    Hotels.searchHotelsAdmin(data,  function(err , results){
        console.log("result is" + results);
        if(err){
            callback(null,err);
        }
        else{
            console.log("Hotel admin search data passed to model function");
            callback(null,results);
        }
    });
};

exports.updateHotelAdmin = function(data, callback){
    console.log("In update Hotel admin");
    Hotels.updateHotelAdmin(data, function(err , results){
        if(err){
            callback(err,null);
        }
        else{
            console.log("Hotel update data passed to model function");
            callback(null,results);
        }
    });
};


exports.searchHotels = function(data, callback){
    Hotels.searchHotels(data.hotel_city, function(err, result){
       if(err){
           callback(err, null);
       } else{
           callback(null, result);
           if(data.user_id){
               UserTrace.addUserActivity((data.user_id))
           }
       }
    });
};


exports.bookHotel = function(data, callback){
    Hotels.bookNewHotel(data , function(err , results){
        console.log("its booknewhotel in hotel_services");
        if(err){
            callback(err, null);
        }else{
            if(data.user_id){
                UserTrace.addUserActivity(data.user_id,"book hotel");
            }
            callback(null,results);
        }

    });
};


exports.addNewHotel = function(data, callback){
    Hotels.addNewHotel(data, function(err, result){
        if(err){
            callback(err, null);
        }else{
            callback(null, result);
        }
    });
};


exports.deleteHotel = function(data, callback){
    console.log("delete hotel data",data);
    Hotels.deleteHotel( data.hotel_id , function(err , results){
        if(err){
            callback(err, null);
        }else {
            callback(null, results);
        }
    });
};