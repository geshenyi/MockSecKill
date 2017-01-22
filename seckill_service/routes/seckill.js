var express = require('express');
var router = express.Router();
var redis = require('redis');
var kafka = require('kafka-node');
var Producer = kafka.Producer;
var kafkaClient = new kafka.Client();
var producer = new Producer(kafkaClient);
var count = 0;

router.post('/seckill', function (req, res) {
    console.log('count=' + count++);
    var fn = function (optionalClient) {
        if (optionalClient == 'undefined' || optionalClient == null) {
            var client = redis.createClient();
        }else{
            var client = optionalClient;
        }
        client.on('error', function (er) {
            console.trace('Here I am');
            console.error(er.stack);
            client.end(true);
        });
        client.watch("counter");
        client.get("counter", function (err, reply) {
            if (parseInt(reply) > 0) {
                var multi = client.multi();
                multi.decr("counter");
                multi.exec(function (err, replies) {
                    if (replies == null) {
                        console.log('should have conflict')
                        fn(client);
                    } else {
                        var payload = [
                            {
                                topic: 'CAR_NUMBER',
                                messages: 'buy 1 car',
                                partition: 0
                            }
                        ];
                        producer.send(payload, function (err, data) {
                            console.log(data);
                        });
                        res.send(replies);
                        client.end(true);
                    }
                });
            } else {
                console.log("sold out!");
                res.send("sold out!");
                client.end(true);
            }
        })
    };
    fn();
});

module.exports = router;