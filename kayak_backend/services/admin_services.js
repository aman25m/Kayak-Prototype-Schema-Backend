var Admin = require('./../models/admin');
var mysql = require('./../models/mysql');
var UserTrace = require('./../models/user_trace');



function adminSignIn(data, callback){
    console.log("adminSignIn:data",data);
    Admin.adminSignIn(data , function(err , results){
        if(err){
            callback(err, null);
        }else{
            callback(err,results);
        }
    });
}

function adminHotelBilling(data, callback){
    var where_clause = "";
    if(data.date){
        where_clause += "where Date(booking_date) = "+"'"+req.body.date+"'";
    }else if(data.month){
        var date = new Date();
        var year = date.getFullYear();
        var start_d = year+"-"+req.body.month+"-"+1;
        var end_d = year+"-"+req.body.month+"-"+31;
        where_clause += "where Date(booking_date) between '"+start_d+"' and '"+end_d+"'";
    }
    Admin.adminHotelBilling(where_clause, function(err, result){
       if(err){
           callback(err, null);
       } else{
           callback(null, result);
       }
    });
}


function searchHotelsAdmin(data, callback){
    console.log("In searchHotelsAdmin");
    Hotels.searchHotelsAdmin( data.hotel_id, data.hotel_name,  function(err , results){
        console.log("result is" + results);
        if(err){
            callback(null,err);
        }
        else{
            console.log("Hotel admin search data passed to model function");
            callback(null,results);
        }
    });
}


function adminCarBilling(data, callback){
    var where_clause = '';
    if(data.date){
        where_clause += "where Date(booking_date) = "+"'"+data.date+"'";
    }else if(data.month){
        var date = new Date();
        var year = date.getFullYear();
        var start_d = year+"-"+data.month+"-"+1;
        var end_d = year+"-"+data.month+"-"+31;
        where_clause += "where Date(booking_date) between '"+start_d+"' and '"+end_d+"'";
    }
    Admin.adminCarBilling(where_clause, function(err, result){
       if(err){
           callback(err, null);
       } else{
           callback(null,result);
       }
    });
}


function adminFlightBilling(data, callback){
    var where_clause = '';
    if(data.date){
        where_clause += "where Date(booking_date) = "+"'"+data.date+"'";
    }else if(data.month){
        var date = new Date();
        var year = date.getFullYear();
        var start_d = year+"-"+data.month+"-"+1;
        var end_d = year+"-"+data.month+"-"+31;
        where_clause += "where Date(booking_date) between '"+start_d+"' and '"+end_d+"'";
    }
    Admin.adminFlightBilling(where_clause, function(err, result){
        if(err){
            callback(err, null);
        } else{
            callback(null,result);
        }
    });
}


function adminDetails(data, callback){
    Admin.adminDetails( data , function(err , results){
        if(err){
            console.log("[Kafka] Error getting admin details")
            callback(err,null);
        }else{
            console.log("its result in admin_services"+results);
            callback(null,results);
        }
    });
}


function updateAdminDetails(data, callback){
    Admin.updateAdmin( data , function(err , results){
        if(err){
            console.log("[Kafka] Error upadating admin")
            callback(err,null);
        }else{
            console.log("its result in user_services"+results);
            callback(null,results);
        }
    });
}


module.exports.adminSignIn = adminSignIn;
module.exports.adminHotelBilling = adminHotelBilling;
module.exports.searchHotelsAdmin = searchHotelsAdmin;
module.exports.adminCarBilling = adminCarBilling;
module.exports.adminFlightBilling = adminFlightBilling;
module.exports.adminDetails = adminDetails;
module.exports.updateAdminDetails = updateAdminDetails;