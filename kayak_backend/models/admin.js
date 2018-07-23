var mysql = require('./mysql');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');
var utils = require('./../util/utils');

function adminSignIn(data, callback){
    var checkAdmin = "select * from admin where username='"+data.username+"'";
    mysql.fetchData(checkAdmin, function(err,result){
        let response = {};
       if(err){
           throw err;
       } else{
           response.code = 201;
           if(result.length == 0){
               response.message = "No such user exists.";
           }else{
               if(bcrypt.compareSync(data.password, result[0].password)){
                   let userinfo = {}
                   response.message = "User logged in successfully";
                   userinfo.username = data.username;
                   userinfo.type = "admin";
                   const server_token = jwt.sign({uid: data.username}, utils.server_secret_key);
                   response.result = {userinfo:userinfo, servertoken:server_token};
               }else{
                   response.message = "Wrong password."
               }
           }
           callback(null, response);
       }
    });
}


function adminHotelBilling(data, callback){
    var adminhotelbilling = "select * from hotel_transaction where " + data;
    mysql.fetchData(adminhotelbilling, function(err, result){
       if(err){
           throw err;
       } else{
           var response = {};
           response.code = 201;
           if(result.length == 0){
               response.message = "No transactions available for hotels";
           }else{
               response.message = "Successfully retrieved hotel billing information";
               response.result = result;
           }
           callback(null, response);
       }
    });
}


function adminCarBilling(where_clause, callback){
    var query = "select * from car_transaction "+where_clause;
    mysql.fetchData(query, function (err, result){
       if(err){
           throw err;
       } else{
           var response = {};
           response.code = 201;
           if(result.length == 0){
               response.message = "No transactions available.";
           }else {
              response.message = "Successfully retrieved billing information";
              response.result = result;
           }
           callback(null, response);
       }
    });
}


function adminFlightBilling(where_clause, callback){
    var query = "select * from flight_transaction "+where_clause;
    mysql.fetchData(query, function (err, result){
        if(err){
            throw err;
        } else{
            var response = {};
            response.code = 201;
            if(result.length == 0){
                response.message = "No transactions available.";
            }else {
                response.message = "Successfully retrieved billing information";
                response.result = result;
            }
            callback(null, response);
        }
    });
}

function adminDetails (admininfo,callback){
    var findAdmin = "select * from admin where username='" + admininfo.username + "'";
    mysql.fetchData(function(err,result){
        if(err){
            throw err;
        }
        else if(result.length == 0){
            console.log("admin doesn't exist");
            var response= {code:401,message:'User doesnt exists'};
            callback(null,response);
        }
        else if(result.length > 0){
            var response= {code:201,result:result};
            callback(null,response);
        }
    },findAdmin);
}



function updateAdmin(admindetail, callback){
    var updateAdmin = "UPDATE admin SET first_name = '"+admindetail.first_name+"',"+
        "last_name = '"+admindetail.last_name+"',"+
        "address = '"+admindetail.address+"',"+
        "city = '"+admindetail.city+"',"+
        "state = '"+admindetail.state+"',"+
        "zip = '"+admindetail.zip+"',"+
        "phone = '"+admindetail.phone+"'"+
        "where username='"+admindetail.username+"'";

    mysql.fetchData(updateAdmin,function(err,result){
        if(err){
            throw err;
        }
        else{
            var response= {code:201,result:result};
            callback(null,response);
        }
    });
}

module.exports.adminSignIn = adminSignIn;
module.exports.adminHotelBilling = adminHotelBilling;
module.exports.adminCarBilling = adminCarBilling;
module.exports.adminFlightBilling = adminFlightBilling;
module.exports.adminDetails = adminDetails;
module.exports.updateAdmin = updateAdmin;