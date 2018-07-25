var transporter = require('./sendMail');
var mailUtils = require('./../config/mailingUtils');

var bookingDetails = require('./bookingDetails');

var mailingOptions = {};
mailingOptions.from = mailUtils.serverdetails.auth.user;


function handle_request(topic, data, callback){
    var data = JSON.parse(data);
    bookingDetails.fetchBookingDetails(data, "car_transaction", function(err, result) {
        if (err) {
            console.log('Unable to find transactions');
        } else {
            console.log(result[0]);
            mailingOptions.to = data.user_id;
            mailingOptions.text = JSON.stringify(result[0]);
            mailingOptions.subject = "KAYAK Booking. ";
            if (topic == "carBookingMail") {
                mailingOptions.subject = mailingOptions.subject + "Your car booking details for booking id " + result[0].booking_id;

            } else if (topic == "hotelBookingMail") {
                mailingOptions.subject = mailingOptions.subject + "Your hotel booking details for booking id " + result[0].booking_id;
            }
            transporter.transport.sendMail(mailingOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            callback(null, result);
        }
    });
}



module.exports.handle_request = handle_request;