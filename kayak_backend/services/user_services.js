var Users = require('./../models/users');
var util = require('./../util/utils');
var jwt = require('jsonwebtoken');

function searchUserAdmin(data, callback){
    console.log("sending data to model class");
    Users.searchUser(data, function(err, result){
       if(err){
           callback(err,null);
       }else{
           callback(null,result);
       }

    });
}

function addUser(data, callback){
    Users.addNewUser(data, function(err,result){

        response = {};
       if(err){
           response.code = 401;
           response.json = {message:"Server error. Failed to signup new user !!!"};

       }else{
            if(result.code == 201){
                const server_token = jwt.sign({uid: data.email},util.server_secret_key);
                response.userinfo = {username:data.email};
                response.servertoken = server_token;
                response.code = 201;
                response.message = "User signed in successfully";
            }else if(result.code == 401){
                response.code = 401;
                response.message = "User Already exist. Please login with the same id.";

            }

       }
       callback(err,response);
    });
}

function addUserAdmin(data, callback){
    Users.addNewUserAdmin(data, function(err, result){
      if(err){
          callback(err,null);
      }else{
          callback(null,result);
      }
    });
}


function updateUserDetails(data, callback){
    Users.updateUserDetails(data, function(err, result){
        if(err){
            callback(err,null);
        }else{
            callback(null,result);
        }
    });
}


function deleteUser(data, callback){
    Users.deleteUser(data, function(err, result){
       if(err){
           callback(err,null);
       } else{
           callback(null,result);
       }
    });
}

function getUserDetails(data, callback){
    Users.getUserDetails(data, function(err, result){
       if(err){
           callback(err, null);
       } else{
           callback(null,result);
       }
    });
}
//--------------------------------------------------------

function getCardDetails(data, callback){
    Users.getCardDetails(data , function(err , result){
        if(err){
            callback(err,null);
        }else {
            callback(err, result);
        }
    });
}

function getUserCard(data, callback){

    Users.get_user_card( data , function(err , result){
        if(err){
            callback(err,null);
        }
        else {
            callback(err, result);
        }
    });
}

function getserhistoryCars(data, callback){

    Users.getuserhistoryCars( data , function(err , result){
        if(err){
            callback(err, null);
        }
        callback(err,result);
    });
}

function getuserhistoryFlights(data, callback){
    var userDetail = {
        email:data.email
    };
    Users.getuserhistoryFlights( userDetail , function(err , result){
        if(err){
            callback(err,result);
        }else {
            callback(null, result);
        }
    });
}

function getuserhistoryHotels(data, callback){

    Users.getuserhistoryHotels( data , function(err , result){
        if(err){
            callback(err,null);
        }else{
            callback(null,result);
        }

    });
}


function edituserdetails(data, callback){
    Users.editUserDetails( data , function(err , result){
        if(err){
            callback(err,null);
        }else{
            callback(null,result);
        }

    });
}


function addcarddetails(data, callback){
    Users.addcardDetails(data, function(err, result){
       if(err){
           callback(err, null);
       } else{
           callback(null, result);
       }
    });
}


function editcarddetails(data, callback){
    Users.editCardDetails( data , function(err , result){
        if(err){
            callback(err,null);
        }else{
            callback(err,result);
        }

    });
}

function deleteuser(data, callback){
    var userDetail = {
        email:data.email
    };
    Users.deleteUserAccount( userDetail , function(err , result){
        if(err){
            console.log("[Kafka] Error deleting user")
        }
        console.log("its result in user_services"+result);
        callback(err,result);
    });
}

module.exports.searchUserAdmin = searchUserAdmin;
module.exports.addUser = addUser;
module.exports.addUserAdmin = addUserAdmin;
module.exports.updateUserDetails = updateUserDetails;
module.exports.deleteUser = deleteUser;
module.exports.getUserDetails = getUserDetails;
module.exports.getCardDetails = getCardDetails;
module.exports.getUserCard = getUserCard;
module.exports.getserhistoryCars = getserhistoryCars;
module.exports.getuserhistoryFlights = getuserhistoryFlights;
module.exports.getuserhistoryHotels = getuserhistoryHotels;
module.exports.edituserdetails = edituserdetails;
module.exports.addcarddetails = addcarddetails;
module.exports.editcarddetails = editcarddetails;
module.exports.deleteuser = deleteuser;
