/**
 * Created by ssge on 1/15/17.
 */
var kafka = require('kafka-node');
var Producer = kafka.Producer;
var client = new kafka.Client();
var producer = new Producer(client);

var payload = [
    {
        topic: 'TEST_TOPIC',
        messages: 'hi2',
        partition: 0
    }
];

producer.on('ready', function(){
   producer.send(payload, function(err, data){
       console.log(data);
   })
});
