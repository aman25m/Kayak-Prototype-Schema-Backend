var kafka = require('kafka-node');

function getProducer(){
    var Producer = kafka.Producer,
        client = new kafka.Client("localhost:2181"),
        producer = new Producer(client);

    producer.on('ready', function(){
       console.log('Producer is ready');
    });
    return producer;
}

function getConsumer(topicName){
    var Consumer = kafka.Consumer,
        client = new kafka.Client("localhost:2181"),
        consumer = new Consumer(client,[{topic:topicName, partition:0}]);

    consumer.on('ready', function(){
       console.log("Consumer is ready");
    });
    return consumer;
}

module.exports.getProducer = getProducer;
module.exports.getConsumer = getConsumer;