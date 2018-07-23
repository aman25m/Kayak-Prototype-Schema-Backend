var mysql = require('./mysql');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var UserTrace = require('./user_trace');

function searchUser(userDetails,callback){
    var query = "select * from users where email='"+userDetails.email+"'";
    console.log("query being fired");
    mysql.fetchData(query,function(err, result){
        if(err){
            throw err;
        }else if(result.length == 0){
            var response = {code:201, message:"User doesnot exists"};
            callback(null, response);
        }else{
            var response = {code:201, result:result[0]};
            callback(null, response);
        }
    });
}


function addNewUser(userDetails,callback){
    var query = "select * from users where email='"+userDetails.email+"'";
    mysql.fetchData(query,function(err,result){
       if(err){
           console.log(err.message);
           throw err;
       }else{
           //console.log("result length is " + result.length);
           if(result.length>0){
               var response = {code:401, message:"User already exist."};
               //console.log(response);
               callback(null,response);
           }else{
               var passwordEncrypt = bcrypt.hashSync(userDetails.password,salt);
               var addUserQuery = "INSERT INTO users(email,password) VALUES('"+userDetails.email+"','"+passwordEncrypt+"')";
               mysql.fetchData(addUserQuery, function(err, result){
                   if(err){
                      callback(err,null);
                   }else{
                       var response = {code:201, message:"User Successfully registered."};
                       callback(null, response);
                   }
               });
           }
       }
    });
}


function addNewUserAdmin(userDetails, callback){
    var query = "select * from users where email='"+userDetails.email+"'";
    mysql.fetchData(query,function(err,result){
        if(err){
            console.log(err.message);
            throw err;
        }else{
            //console.log("result length is " + result.length);
            if(result.length>0){
                var response = {code:401, message:"User already exist."};
                //console.log(response);
                callback(null,response);
            }else{
                var passwordEncrypt = bcrypt.hashSync(userDetails.password,salt);
                var addUserQuery = "INSERT INTO users(email,password,first_name,last_name,address,city,state,zip,phone) VALUES('" + userdetail.email + "','" + passwordToSave + "','" +userdetail.first_name+ "','" + userdetail.last_name+ "','" + userdetail.address+ "','" + userdetail.city+ "','" +userdetail.state+"','"+ userdetail.zip+ "','" + userdetail.phone+"')";
                mysql.fetchData(addUserQuery, function(err, result){
                    if(err){
                        callback(err,null);
                    }else{
                        var response = {code:201, message:"User Successfully registered."};
                        callback(null, response);
                    }
                });
            }
        }
    });
}


function updateUserDetails(userDetails, callback){
    var query = "UPDATE users SET first_name = '"+userdetail.first_name+"',"+
        "last_name = '"+userdetail.last_name+"',"+
        "address = '"+userdetail.address+"',"+
        "city = '"+userdetail.city+"',"+
        "state = '"+userdetail.state+"',"+
        "zip = '"+userdetail.zip+"',"+
        "phone = '"+userdetail.phone+"'"+
        "where email='"+userdetail.email+"'";
    mysql.fetchData(query, function(err, result){
       if(err){
           throw err;
       }else{
           var response = {code: 201, result: result};
           callback(null, response);
       }
    });
}


function deleteUser(userDetails,callback){
    var query = "delete from users where email='"+userDetails.email+"'";
    mysql.fetchData(query, function(err, result){
        var response = {};
       if(err){
           throw err;
       } else{
           console.log(result.message);
           if(result.code == 201){
               console.log(result.message);
               response.code = 201;
               response.result = "User Deleted Successfully";
           }else{
               response.code = 204;
               response.result = "User doesnot exists";
           }

           callback(null,response);
       }
    });
}


function getUserDetails(userDetails,callback){
    var response = {};
    var query = "select * from users where email='"+userDetails.email+"'";
    mysql.fetchData(query,function(err, result){
       if(err){
           throw err;
       } else{
           if(result.length==0){
               response.code = 204;
               response.message = "User not found";

           }else{
               response.code = 201;
               response.message = "User details found";
               response.result = result;
           }
           callback(null, response);
       }
    });
}

//----------------------------------------------

function getCardDetails(carddetail, callback) {
    console.log("its carddetails in usermodel" + carddetail.email);
    var getCard = "select * from card_payment where email='" + carddetail.email + "'";
    mysql.fetchData(getCard,function (err, result) {
        if (err) {
            throw err;
        }
        else {
            if (result.length == 0) {
                var response = {
                    code: 204, message: "No card details present for this user."};
                }
            else
                {
                    var response = {result, code: 201, message: 'Card details found'};
                }
                console.log("its result in model user" + result);

                callback(null, response);
            }

    });
}

function get_user_card(userdetail, callback) {

    var getUserCard = "SELECT kayak_database.users.email,kayak_database.users.first_name,kayak_database.users.last_name,kayak_database.users.address,kayak_database.users.city,kayak_database.users.state,kayak_database.users.zip,kayak_database.users.phone,kayak_database.card_payment.name_on_card,kayak_database.card_payment.card_number,kayak_database.card_payment.card_type,kayak_database.card_payment.cvv FROM ( kayak_database.card_payment right outer join kayak_database.users on kayak_database.card_payment.email = kayak_database.users .email ) where kayak_database.users.email ='"+userdetail.email+"'";
    mysql.fetchData(getUserCard,function (err, result) {
        if (err) {
            throw err;
        }
        else
        {
            if(result.length==0){
                var response = {result,code:204,message:'User details not found'};
            }else{
                var response = {result,code:201,message:'User details found'};
            }
            console.log("its result in model user"+result);

            callback(null,response);
            if(userdetail.email){
                UserTrace.addUserActivity(userdetail.email,"booking page");
            }


        }
    });
}

function getuserhistoryCars(userdetail,callback)
{
    console.log("its userhistory in usermodel" + userdetail.email);
    var getCars = "SELECT * from car_transaction where car_transaction.user_id='"+userdetail.email+"'";
    mysql.fetchData(getCars,function (err, result) {
        if (err) {
            throw err;
        }
        else
        {
            if(result.length==0){
                var response = {result:result,code:204,message:'no car transaction found'};
            }else {
                var response = {result: result, code: 201, message: 'User details found'};
            }
            callback(null,response);
        }
    });
}

function getuserhistoryFlights(userdetail,callback)
{
    console.log("its userhistory in usermodel" + userdetail.email);
    var getFlights = "SELECT * from flight_transaction where flight_transaction.user_id='"+userdetail.email+"'";
    mysql.fetchData(getFlights,function (err, result) {
        if (err) {
            throw err;
        }
        else {
            if (result.length == 0) {
                var response = {result: result, code: 204, message: 'no flight bookings found'};
            } else {
                var response = {result: result, code: 201, message: 'flight bookings found.'};

            }
            callback(null, response);
        }
    });
}

function getuserhistoryHotels(userdetail,callback)
{
    var getHotels = "SELECT * from hotel_transaction where hotel_transaction.user_id='"+userdetail.email+"'";
    mysql.fetchData(getHotels,function (err, result) {
        if (err) {
            throw err;
        }
        else
        {
            if(result.length==0){
                var response = {result:result,code:204,message:'No hotel bookings found'};
            }else{
                var response = {result:result,code:201,message:'User details found'};
            }

            callback(null,response);
        }
    });
}



function editUserDetails(userdetail, callback) {
    var editUser= "UPDATE users SET first_name='"+userdetail.first_name+"',last_name='"+userdetail.last_name+"',address='"+userdetail.address+"',city='"+userdetail.city+"',state='"+userdetail.state+"',zip='"+userdetail.zip+"',phone='"+userdetail.phone+"' WHERE email='"+userdetail.email+"'";
    mysql.fetchData(editUser,function (err, result) {
        if (err) {
            throw err;

        }
        else {
            console.log(result);
            if(result.affectedRows==0){
                var response = {result:result,code:204,message:'User not found.'};
            }else {
                var response = {result: result, code: 201, message: 'User Successfully Edited'};
            }
            callback(null,response);
        }
    });
}

function addCardDetails(carddetail, callback) {
    var addCard = "INSERT INTO card_payment(email,name_on_card,card_number,card_type,address,city,state,zip) VALUES ('" + carddetail.email + "','" + carddetail.name_on_card + "','" + carddetail.card_number + "','" + carddetail.card_type + "','" + carddetail.address + "','" + carddetail.city + "','" + carddetail.state + "','" + carddetail.zip + "')";
    mysql.fetchData(addCard,function (err, result) {
        if (err) {
            throw err;
            callback(null,response);
        }
        else {
            var response = {result:result,code:201,message:'Card Successfully Added'};
            callback(null,response);
        }
    });
}


function editCardDetails(carddetail, callback) {
    var editCard= "UPDATE card_payment SET name_on_card='"+carddetail.name_on_card+"',card_number='"+carddetail.card_number+"',card_type='"+carddetail.card_type+"',address='"+carddetail.address+"',city='"+carddetail.city+"',state='"+carddetail.state+"',zip='"+carddetail.zip+"' WHERE email='"+carddetail.email+"'";
    mysql.fetchData(editCard,function (err, result) {
        if (err) {
            throw err;
            callback(null,response);
        }
        else {
            if(result.affectedRows==0){
                var response = {result:result,code:204,message:'User not found.'};
            }else {
                var response = {result: result, code: 201, message: 'Card Successfully Edited'};
                callback(null, response);
            }
        }
    });
}

function deleteUserAccount(userdetail, callback) {
    console.log("its userdetails in usermodel" + userdetail.email);
    var deleteUser = "DELETE FROM users where email='" + userdetail.email + "'";
    mysql.fetchData(deleteUser,function (err, result) {
        if (err) {
            throw err;
        }
        else
        {
            console.log("its result in model user"+result);
            var response = {result,code:201,message:'User details found'};
            callback(null,response);
        }
    });
}

module.exports.searchUser = searchUser;
module.exports.addNewUser = addNewUser;
module.exports.addNewUserAdmin = addNewUserAdmin;
module.exports.updateUserDetails = updateUserDetails;
module.exports.deleteUser = deleteUser;
module.exports.getUserDetails = getUserDetails;
module.exports.getCardDetails = getCardDetails;
module.exports.get_user_card = get_user_card;
module.exports.getuserhistoryCars = getuserhistoryCars;
module.exports.getuserhistoryFlights = getuserhistoryFlights;
module.exports.getuserhistoryHotels = getuserhistoryHotels;
module.exports.editUserDetails = editUserDetails;
module.exports.addCardDetails = addCardDetails;
module.exports.editCardDetails = editCardDetails;
module.exports.deleteUserAccount = deleteUserAccount;