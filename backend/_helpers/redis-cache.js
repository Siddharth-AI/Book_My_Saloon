/**
 * Redis Cache
 */
const redis = require('redis');
let isRedis = false;

(async () => {
    let client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {});

    client.on("connect", function () {
        console.log('Connected to Redis');
        isRedis = true;
    });

    client.on("error", function (err) {
        console.log("redis connection error " + err);
        throw err;
    });

    client.on("end", function (err) {
        console.log("redis connection end " + err);
    });

    function getKeyRedis(key) {
        return new Promise(function (resolve, reject) {
            console.log("Get Redis----", key, isRedis);
            if (isRedis) {
                client.get(key).then((data, err) => {
                    if (err) {
                        reject(err);
                    }
                    if (data) {
                        resolve(data)
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    }
    function setKeyRedis(key, value) {
        return new Promise(function (resolve, reject) {
            console.log("Set Redis----", key, isRedis);
            if (isRedis) {
                client.set(key, value).then((data, err) => {
                    if (err) {
                        reject(err);
                    }
                    if (data) {
                        resolve(data);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    }
    function delKeyRedis(key) {
        return new Promise(function (resolve, reject) {
            console.log("Del Redis----", key, isRedis);
            if (isRedis) {
                client.del(key).then((data, err) => {
                    if (err) {
                        reject(err);
                    }
                    if (data) {
                        resolve(data);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    }
    function delPrefixKeyRedis(key) {
        return new Promise(function (resolve, reject) {
            console.log("Del Prefix Redis----", key, isRedis);
            if (isRedis) {
                client.keys('*').then((keys, err) => {
                    if (err) {
                        reject(err);
                    }
                    if (keys.length > 0) {
                        keys.map(item => {
                            if (item.indexOf(key, 0) !== -1) {
                                client.del(item);
                            }
                        });
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    }

    module.exports = {
        getKeyRedis,
        setKeyRedis,
        delKeyRedis,
        delPrefixKeyRedis,
    };

    // Connect
    await client.connect();
})();