var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mysql = require('./mysql');
var mcon = require('./MongoConnection');

var carSchema = new Schema({
    model_no:{
        type:String,
        required : true
    },
    capacity:{
        type:Number,
        required : true
    },
    no_of_bags:{
        type:Number,
        required : true
    },
    name:{
        type:String,
        required:true
    },
    no_of_doors:{
        type:Number,
        required : true
    },
    price:{
        type:Number,
        required : true
    },
    src_city:{
        type:String,
        required : true
    },
    destination_city:{
        type:String,
        required : true
    },
    rental_agency:{
        type:String,
        required : true
    },
    car_type:{
        type:String,
        required : true
    }
});

const Cars = mongoose.model('cars',carSchema);

function searchCarsAdmin(data, callback){
    var query = {};
    if(data.model_no)
        query.model_no = data.model_no;
    if(data.name)
        query.name = data.name;
    console.log("searchCarAdmin:",query);
    Cars.find(query,callback);

}

function updateCarAdmin(carDetail,callback){
    Cars.update({model_no : carDetail.model_no},{$set:{
            capacity : carDetail.capacity,
            no_of_bags :carDetail.no_of_bags,
            name :carDetail.name,
            no_of_doors :carDetail.no_of_doors,
            price :carDetail.price,
            src_city :carDetail.src_city,
            destination_city :carDetail.destination_city,
            rental_agency :carDetail.rental_agency,
            car_type :carDetail.car_type
        }},callback);
}

function searchCars(srcCity, destCity, callback){
    var query = {};
    if(srcCity){
        query.src_city = srcCity;
    }
    if(destCity){
        query.destination_city = destCity;
    }
    Cars.find(query, callback);
}


function addNewCar(data, callback){
    var carDetail = new Cars({
        model_no:data.model_no,
        name:data.name,
        capacity:data.capacity,
        no_of_bags:data.no_of_bags,
        no_of_doors:data.no_of_doors,
        price:data.price,
        src_city:data.src_city,
        destination_city:data.destination_city,
        rental_agency:data.rental_agency,
        car_type:data.car_type,
        car_name:data.car_name}
    );
    carDetail.save(callback);
}

function bookNewCar(carbookdetail, callback){
    var bookCar = "INSERT INTO car_transaction(user_id,src_city,destination_city,agency_name,car_name,booking_date,booking_amount,start_date,end_date) VALUES ('" + carbookdetail.user_id + "','" + carbookdetail.src_city + "','" + carbookdetail.destination_city + "','" + carbookdetail.rental_agency + "','" + carbookdetail.name + "','" + carbookdetail.booking_date + "','" + carbookdetail.booking_amount + "','" + carbookdetail.start_date + "','" + carbookdetail.end_date + "')";
    mysql.fetchData(bookCar,function (err, result) {
        if (err) {
            throw err;
        }
        else
        {
            console.log("its result after mysql query"+result);
            callback(null,result);
        }
    });
}


function deleteCar(model_no, callback){
    Cars.deleteOne({model_no:model_no}, callback);
}


function updateCar(model_no, carDetails, callback) {
    Cars.update({model_no: model_no}, {$et: carDetails}, callback);
}

module.exports.searchCarsAdmin = searchCarsAdmin;
module.exports.updateCarAdmin = updateCarAdmin;
module.exports.searchCars = searchCars;
module.exports.addNewCar = addNewCar;
module.exports.bookNewCar = bookNewCar;
module.exports.deleteCar = deleteCar;
module.exports.updateCar = updateCar;