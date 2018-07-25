var Cars = require('../models/cars');
var UserTrace = require('../models/user_trace');
var kafka = require('./../kafka/kafka-connection');



exports.searchCarsAdmin = function(data, callback){
    console.log("In searchCarsAdmin");
    Cars.searchCarsAdmin( data,  function(err , results){
        console.log("result is" + results);
        if(err){
            callback(err,null);
        }
        else{
            console.log("car admin search data passed to model function");
            callback(null,results);
        }
    });
};


exports.updateCarAdmin =function(data, callback){
    console.log("In update car admin");
    Cars.updateCarAdmin(data, function(err , results){
        if(err){
            callback(err,null);
        }
        else{
            console.log("Hotel update data passed to model function");
            callback(null,results);
        }
    });
};


exports.searchCars = function(data, callback){
    Cars.searchCars( data.src_city, data.destination_city , function(err , results){
        if(err){
            callback(null,err);
        }
        else{
            callback(null,results);
            if(data.user_id){
                UserTrace.addUserActivity(data.user_id,"search car");
            }

        }
    });
};


exports.addCar = function(data, callback){
    Cars.addNewCar(data , function(err , results){
        if(err){
            callback(err,null);
        }else{
            callback(null,results);
        }

    });
};


exports.bookCar = function(data, callback){
    Cars.bookNewCar(data , function(err , results){
        console.log("[Kafka] booknewcar in car_services");
        if(err){
            callback(err, null);
        }else{
            if(data.user_id){
                UserTrace.addUserActivity(data.user_id,"book car");
            }
            callback(null,results);
            
            var carBookingMail = kafka.getProducer();
            carBookingMail.on('ready', function(){
                console.log('Producer is ready');
                let message = JSON.stringify(data);
                let payload = [{topic:"carBookingMail", messages: message, partition:0}];
                carBookingMail.send(payload, function(err, result){
                    if(err){
                        console.log("Error sending email");
                    }else{
                        console.log("Mail sent successfully");
                    }
                });
            });

        }
    });
};

exports.deleteCar = function(data, callback){
    console.log("delete car data",data);
    Cars.deleteCar( data.model_no , function(err , results){
        if(err){
            callback(err,null);
        }else {
            callback(null, results);
        }
    });
};



exports.editCar = function(data, callback){
    console.log("edit car data",data);
    if(!data.model_no){
        callback("Model No missing, failed to edit without model_no",null);
    }else{
        var carEditData = {};
        if(data.car_name)
            carEditData.car_name = data.car_name;
        if(data.capacity)
            carEditData.capacity = data.capacity;
        if(data.no_of_bags)
            carEditData.no_of_bags = data.no_of_bags;
        if(data.no_of_doors)
            carEditData.no_of_doors = data.no_of_doors;
        if(data.price)
            carEditData.price = data.price;
        if(data.src_city)
            carEditData.src_city = data.src_city;
        if(data.destination_city)
            carEditData.destination_city = data.destination_city;
        if(data.rental_agency)
            carEditData.rental_agency = data.rental_agency;
        if(data.car_type)
            carEditData.car_type = data.car_type;
        Cars.updateCar(data.model_no, carEditData, function(err,result){
            if(err){
                callback(err, null);
            }else{
                callback(null, result);
            }
        });
    }

};