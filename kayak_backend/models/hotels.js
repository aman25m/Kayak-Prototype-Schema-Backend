var mongoose = require('mongoose');
var mysql = require('./mysql');

var hotelSchema = mongoose.Schema({
    hotel_id:{
        type: String,
        required:true
    },
    hotel_name:{
        type:String,
        required:true
    },
    hotel_address : {
        type : String,
        required : true
    },
    hotel_city : {
        type : String,
        required : true
    },
    hotel_state : {
        type : String,
        required : true
    },
    hotel_zip : {
        type : Number,
        required : true
    },
    hotel_stars : {
        type : Number,
        required : true
    },
    hotel_room_type : {
        type : [String],
        required : true
    },
    hotel_rating : {
        type : Number,
        required : true
    },
    hotel_reviews : {
        type : [String]
    },
    //hotel_capacity = number of people that can be accomadated in the hotel
    hotel_capacity : {
        type : String,
        required : true
    },
    hotel_start_date : {
        type : Date,
    },
    hotel_end_date : {
        type : Date,
    },
    hotel_price : {
        type : Number,
        required : true
    }

});

const Hotels = mongoose.model('hotels',hotelSchema);

function searchHotelsAdmin(data, callback){
    var query = {};
    if(data.hotel_id)
        query.hotel_id = data.hotel_id;
    if(data.hotel_name)
        query.hotel_name = data.hotel_name;
    console.log("searchHotel:",query);
    Hotels.find(query, callback);
}

function updateHotelAdmin(hotelDetail,callback){
    Hotels.update({hotel_id : hotelDetail.hotel_id},{$set:{
            hotel_name : hotelDetail.hotel_name,
            hotel_address :hotelDetail.hotel_address,
            hotel_city :hotelDetail.hotel_city,
            hotel_state :hotelDetail.hotel_state,
            hotel_zip :hotelDetail.hotel_zip,
            hotel_stars :hotelDetail.hotel_stars,
            hotel_room_type :hotelDetail.hotel_room_type,
            hotel_rating :hotelDetail.hotel_rating,
            hotel_reviews :hotelDetail.hotel_reviews,
            hotel_capacity :hotelDetail.hotel_capacity,
            hotel_price :hotelDetail.hotel_price,
        }},callback);
}


function searchHotel(hotel_city, callback){
    var query = {};
    if(hotel_city){
        query.hotel_city = hotel_city;
    }
    Hotels.find(query, callback);
}



function bookNewHotel(hotelbookdetail, callback) {
    var bookHotel = "INSERT INTO hotel_transaction(user_id,src_city,hotel_name,hotel_id,booking_date,booking_amount,start_date,end_date) VALUES ('" + hotelbookdetail.user_id + "','" + hotelbookdetail.src_city + "','" + hotelbookdetail.hotel_name + "','" + hotelbookdetail.hotel_id + "','" + hotelbookdetail.booking_date + "','" + hotelbookdetail.booking_amount + "','" + hotelbookdetail.start_date + "','" + hotelbookdetail.end_date + "')";
    mysql.fetchData(bookHotel, function (err, result) {
        if (err) {
            throw err;
        }
        else {
            console.log("its result after mysql query" + result);
            callback(null, result);
        }
    });
}

function addNewHotel(data, callback){
    var hotel = new Hotels({
        hotel_id: data.hotel_id,
        hotel_name : data.hotel_name ,
        hotel_address : data.hotel_address,
        hotel_city : data.hotel_city,
        hotel_state : data.hotel_state,
        hotel_zip : data.hotel_zip ,
        hotel_stars : data.hotel_stars,
        hotel_room_type : data.hotel_room_type,
        hotel_rating : data.hotel_rating,
        hotel_reviews : data.hotel_reviews,
        hotel_capacity : data.hotel_capacity,
        hotel_price : data.hotel_price
    });
    hotel.save(callback);
}


function deleteHotel(data, callback){
    Hotels.deleteOne({hotel_id:data.hotel_id}, callback);
}


module.exports.searchHotelsAdmin = searchHotelsAdmin;
module.exports.updateHotelAdmin = updateHotelAdmin;
module.exports.searchHotel = searchHotel;
module.exports.bookNewHotel = bookNewHotel;
module.exports.addNewHotel = addNewHotel;
module.exports.deleteHotel = deleteHotel;