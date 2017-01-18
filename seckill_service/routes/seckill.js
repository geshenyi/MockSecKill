/**
 * Created by ssge on 1/18/17.
 */
var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient();

router.post('/seckill', function (req, res) {

    var fn = function () {
        client.get("counter", function (err, reply) {
            client.watch("counter");
            if (parseInt(reply) > 0) {
                var multi = client.multi();
                multi.decr("counter");
                multi.exec(function (err, replies) {
                    if(replies == null){
                        fn();
                    }else {
                        console.log(replies);
                        res.send(replies);
                    }
                });
            } else {
                console.log("sold out!");
                res.send("sold out!");
            }


        })
    }
    fn();

});

module.exports = router;