'use strict'

let mongoose = {}
try {
  mongoose = require('mongoose');
} catch (e) {}

const BaseCacheManager = require('./BaseCacheManager')
const MongoDBCacheManager = require('./MongoDBCacheManager')
const RAMCacheManager = require('./RAMCacheManager')

let instance

// ваще хз чо тут происходит
// TODO пофиксить хзсность
function exp() {
  console.log(arguments)
  if (!instance)
    instance = new (Function.prototype.bind.apply(
        (mongoose.connection 
          && (mongoose.connection.readyState === 2 || mongoose.connection.readyState === 1)
          || (mongoose.connection.readyState === 0 && arguments[0] && arguments[0].uri)
        )
        ? MongoDBCacheManager
        : RAMCacheManager
      , [0].concat(arguments)
    ))

  return instance
};

module.exports = Object.assign(exp, {
    BaseCacheManager: BaseCacheManager,
    RAMCacheManager: RAMCacheManager,
    MongoDBCacheManager: MongoDBCacheManager
  }
)
