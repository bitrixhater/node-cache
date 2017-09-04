'use strict'

const BaseCacheManager = require('./BaseCacheManager')
let mongoose = {}
try {
  mongoose = require('mongoose');
} catch (e) {}
let Schema = mongoose.Schema

/**
 * Cache manager that uses mongo db for storing
 */
class MongoDBCacheManager extends BaseCacheManager {
  static get CacheManagerSchema() {
    return new this.Schema({
      key: String,
      cachedUntil: {
        type: Number,
        default: 0
      },
      data: Schema.Types.Mixed,
    })
  }

  constructor(config) {
    super(config)

    let modelName = config.modelName || 'MongoDBCacheManager'
    this.Schema = config.Schema

    this.CacheManager = (mongoose.models && mongoose.models[modelName]) 
      ? mongoose.models[modelName]
      : mongoose.model(modelName, this.constructor.CacheManagerSchema)
  }

  /**
   * @param {string} key
   * @returns {Promise<Object>}
   */
  get(key) { 
    return this.CacheManager.findOne({
      key: key,
      $or: [{
        cachedUntil: { $gt: Date.now() },
      }, {
        cachedUntil: 0
      }]
    })
    .exec()
    .then(cachedData => Promise.resolve((cachedData || {}).data))
  }

  /**
   * @param {string} key
   * @param {Object} data
   * @param {number} cacheTime
   * @returns {Promise}
   */
  set(key, data, cacheTime) {
    return  new Promise((resolve, reject) => {
      this.CacheManager.findOne({
        key: key
      }, (err, cachedData) => {
        if (err)
          return reject(new Error(err))

        cachedData = cachedData || new this.CacheManager()
        cachedData.key = key
        cachedData.data = data
        if (cacheTime || this.cacheTime)
          cachedData.cachedUntil = Date.now() + (cacheTime ? cacheTime * 1000 : this.cacheTime)
        else
          cachedData.cachedUntil = 0

         resolve(cachedData.save())
      })
    })
  }

  /**
   * @param {string} key
   * @returns {Promise}
   */
  remove(key) { 
    return this.CacheManager.remove({
      key: key
    })
    .exec()
  }

  /**
   * @returns {Promise}
   */
  clear() { 
    return this.CacheManager.remove({})
    .exec()
  }
}

module.exports = MongoDBCacheManager
