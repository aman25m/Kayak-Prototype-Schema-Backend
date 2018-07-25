var mysql = require('./../models/mysql');

function fetchBookingDetails(data, tableName, callback){
    var query = "select * from " + tableName + " where user_id = '" + data.user_id +"'";

    if(data.booking_date){
        query = query + " and booking_date = '" + data.booking_date + "'";
    }
    if(data.booking_amount){
        query = query + " and booking_amount = '" + data.booking_amount +"'"
    }
    mysql.fetchData(query, function(err, result){
       if(err){
           throw err;
       } else{
           callback(null, result);
       }
    });

}

module.exports.fetchBookingDetails = fetchBookingDetails;