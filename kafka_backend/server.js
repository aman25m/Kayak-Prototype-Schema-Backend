var kafka = require("./connection/kafka-connection");
var service_manager = require("./services/service_manager");
var kafka_topics = require("./config/kafka_topic").getTopicList();



kafka_topics.map((topic)=>{
    var consumer = kafka.getConsumer(topic);
    consumer.on("message", function(message){
        console.log("consumer created for topic "+ topic);

        //var data = JSON.parse(message.value);
        service_manager.handle_request(topic, message.value, function(err, result){
           if(err){
               console.log("error while handling request");
           } else{
               console.log("request handled successfully");
           }
        });

    });
});
