var express = require('express');
var router = express.Router();
var utils = require('./../util/utils');
var jwt = require('jsonwebtoken');
var adminServices = require('./../services/admin_services');
var hotelServices = require('./../services/hotel_services');
var carServices = require('./../services/car_services');
var flightServices = require('./../services/flight_services');


router.post('/adminsignin', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    let admininfo ={};
    admininfo.username = username;
    admininfo.password = password;
    adminServices.adminSignIn(admininfo, function(err , results){
        if(err){
            res.status(401).json({result : {}, message:"Failed to login in kafka error: "+err});
        }
        else{
                res.status(201).json(results);
            }

    });
});


router.post('/adminhotelbilling', function(req, res, next) {
    if(req.body.date || req.body.month){
        var data = {};
        data.date = req.body.date;
        data.month = req.body.month;
        adminServices.adminHotelBilling(data, function(err, result){
           if(err){
               res.status(401).json({message:err.message});
           } else{
               res.status(result.code).json(result);
           }
        });
    }else{
        res.status(401).json({result:[],message:"PLease select either month or date of booking"});
    }
});



router.post('/searchhotelsadmin', function(req, res, next) {
    console.log("In search hotels admin");
    var hotelinfo = {};
    hotelinfo.hotel_id = req.body.hotel_id;
    hotelinfo.hotel_name = req.body.hotel_name;

    hotelServices.searchHotelsAdmin(hotelinfo, function(err,result){
        if(err){
            console.log("error in searching hotels");
            res.status(403).json({result:result,message:"Admin Failed to search hotel with id :"+hotelinfo.hotel_id});
        }
        else{
            console.log("hotel search successful");
            res.status(201).json({result:result,message:"Admin Successfully searched hotel with id :"+hotelinfo.hotel_id});
        }
    });
});

router.post('/updatehoteladmin', function(req, res, next) {
    console.log("In update hotels");
    var hotelDetail = {
        hotel_id: req.body.hotel_id,
        hotel_name: req.body.hotel_name,
        hotel_address: req.body.hotel_address,
        hotel_city: req.body.hotel_city,
        hotel_state: req.body.hotel_state,
        hotel_zip: req.body.hotel_zip,
        hotel_stars: req.body.hotel_stars,
        hotel_room_type: req.body.hotel_room_type,
        hotel_rating: req.body.hotel_rating,
        hotel_reviews: req.body.hotel_reviews,
        hotel_capacity: req.body.hotel_capacity,
        hotel_price: req.body.hotel_price
    };

    hotelServices.updateHotelAdmin(hotelDetail, function(err, result){
       if(err){
           res.status(403).json({result:result,message:"Failed to add hotel :"+ hotelDetail.hotel_name})
       }else{
           res.status(201).json(result);
       }
    });
});


router.post('/searchcarsadmin', function(req, res, next) {
    console.log("In search cars admin");

    var model_no = req.body.model_no?(req.body.model_no).toLowerCase():null;
    var name = req.body.name?(req.body.name).toLowerCase():null;
    if(model_no||name){
        carServices.searchCarsAdmin({"model_no" : model_no , "name" : name}, function(err,result){
            if(err){
                console.log("error in searching cars");
                res.status(403).json({result:[],message:"Admin Failed to search car with id :"+model_no});
            }
            else{
                console.log("car search successful");
                res.status(201).json({result:result,message:"Admin Sucessfully searched car with id :"+model_no});
            }
        });
    }else{
        res.status(401).json({result:[],message:"User need to provide either car name or model no to search!!!"});
    }

});

router.post('/updatecaradmin', function(req, res, next) {
    console.log("In update cars");
    var carDetail = {
        model_no: req.body.model_no ? (req.body.model_no).toLowerCase() : '',
        capacity: req.body.capacity,
        no_of_bags: req.body.no_of_bags,
        name: req.body.name ? (req.body.name).toLowerCase() : '',
        no_of_doors: req.body.no_of_doors,
        price: req.body.price,
        src_city: req.body.src_city,
        destination_city: req.body.destination_city,
        rental_agency: req.body.rental_agency,
        car_type: req.body.car_type
    };
    carServices.updateCarAdmin(carDetails, function(err,result){
        if(err){
            console.log("error in updating car");
            res.status(403).json({result:result,message:"Failed to add hotel :"+ carDetail.model_no});
        }
        else{
            res.status(201).json({result:result,message:"Sucessfully updated car :"+carDetail.model_no});
        }
    });
});


router.post('/searchflightsadmin', function(req, res, next) {
    console.log("In search flights admin");

    var flight_id = req.body.flight_id?req.body.flight_id.toLowerCase():null;
    var carrier_name = req.body.carrier_name?req.body.carrier_name.toLowerCase():null;
    if(flight_id || carrier_name){
        flightServices.searchFlightAdmin({"flight_id" : flight_id , "carrier_name" : carrier_name}, function(err,result){
            if(err){
                console.log("error in searching flights");
                res.status(403).json({result:[],message:"Admin Failed to search flight with id :"+flight_id});
            }
            else{
                console.log("flight search successful");
                res.status(201).json({result:result,message:"Admin Sucessfully searched flight with id :"+flight_id});
            }
        });
    }else{
        res.status(401).json({result:[],message:"User need to provide either flight id or flight name to search!!!"});
    }

});

router.post('/updateflightadmin', function(req, res, next) {
    console.log("In update flight");
    var flightDetail = {
        flight_id : req.body.flight_id?req.body.flight_id.toLowerCase():'',
        carrier_name : req.body.carrier_name?req.body.carrier_name.toLowerCase():'',
        src_city : req.body.src_city?req.body.src_city.toLowerCase():'',
        destination_city : req.body.destination_city?req.body.destination_city.toLowerCase():'',
        flight_duration : req.body.flight_duration,
        operational_day : req.body.operational_day,
        departure_time :req.body.departure_time,
        price : req.body.price
    };


    flightServices.updateFlightAdmin( flightDetail , function(err,result){
        if(err){
            console.log("error in updating flight");
            res.status(403).json({result:result,message:"Failed to update flight :"+ flightDetail.flight_id});
        }
        else{
            res.status(201).json({result:result,message:"Sucessfully updated flight :"+flightDetail.flight_id});
        }
    });
});

router.post('/admincarbilling', function(req, res, next) {

    if(req.body.date || req.body.month){
        adminServices.adminCarBilling({date : req.body.date, month:}, function(err,result){
            if(err){
                console.log(err);
                res.status(403).json({result:[],message:err});
            }else {
                res.status(201).json({result:result,message:"Successfully retrieved car billing information"});
            }
        });
    }else{
        res.status(403).json({result:[],message:"Please select either month or date to get billing information"});
    }

});


router.post('/adminflightbilling', function(req, res, next) {

    if(req.body.date || req.body.month){
        adminServices.adminflightBilling({date : req.body.date, month:}, function(err,result){
            if(err){
                console.log(err);
                res.status(403).json({result:[],message:err});
            }else {
                res.status(201).json({result:result,message:"Successfully retrieved car billing information"});
            }
        });
    }else{
        res.status(403).json({result:[],message:"Please select either month or date to get billing information"});
    }

});


router.post('/getadminprofile',function(req, res, next){
      adminServices.adminDetails({username: req.body.username} , function(err,result){
        if(!err){
            console.log('result*****',result);
            //console.log("user signed up ",result);
            if(result.code === 201){
                res.status(201).json({result:result});
            }else{
                res.status(401).json({result:[]})
            }
        }else{
            res.status(401).json({result:[]});
        }
    });
});


router.post('/updateadmindetails',function(req, res, next){
    var admininfo = {};
    admininfo.username = req.body.username;
    admininfo.password = req.body.password;
    admininfo.first_name = req.body.first_name;
    admininfo.last_name = req.body.last_name;
    admininfo.address = req.body.address;
    admininfo.city = req.body.city;
    admininfo.zip = req.body.zip;
    admininfo.state = req.body.state;
    admininfo.phone = req.body.phone;

    console.log("admininfo: " , admininfo);

    adminServices.updateAdminDetails(admininfo , function(err,result){
        if(!err){
            console.log('result*****',result);
            //console.log("user signed up ",result);
            if(result.code === 201){
                res.status(201).json(result);
            }
            else{
                res.status(401).json({result:[],message:"details not found"});
            }
        }else{
            res.status(401).json({});
        }
    });
});


module.exports = router;