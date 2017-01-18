/**
 * Created by ssge on 1/18/17.
 */
var redis = require('redis');
var client = redis.createClient();

client.watch("counter");

client.get("counter", function (err, reply) {
    var multi = client.multi();
    multi.decr("counter");
    multi.exec(function(err, replies){
        console.log(replies);
    });
})
