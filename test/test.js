const assert = require('assert')

const RAMCacheManager = require('../lib/RAMCacheManager')
const MongoDBCacheManager = require('../lib/MongoDBCacheManager')

describe('Проверяем RAMCacheManager', function() {
  describe('- Устанавливаем ключ "testKey" в значение ["testValue"]', function() {
    let ramCacheManager = new RAMCacheManager()
    it('#без времени жизни и получаем его сразу', function(done) {
      ramCacheManager.set('testKey', ['testValue'])
      .then(() => ramCacheManager.get('testKey')
        .then(testValue => {
          assert(testValue[0] === 'testValue' && (testValue.length === 1))
          done()
        })
        .catch(done)
      )
    })

    it('#со временем жизни 0.01 секунды и получаем его через 0.005 секунду', function(done) {
      ramCacheManager.set('testKey', ['testValue'], 0.01)
      setTimeout(() => {
        ramCacheManager.get('testKey')
        .then(testValue => {
          assert(testValue[0] === 'testValue' && (testValue.length === 1))
          done()
        })
        .catch(done)
      }, 5)
    })

    it('#со временем жизни 0.005 секунд и пытаемся получить его через 0.01 секунду', function(done) {
      ramCacheManager.set('testKey', ['testValue'], 0.005)
      setTimeout(() => {
        ramCacheManager.get('testKey')
        .then(testValue => {
          assert(!testValue)
          done()
        })
        .catch(done)
      }, 10)
    })
  })
})

describe('Проверяем MongoDBCacheManager', function() {
  let mongoDBCacheManager
  describe('- Инициализируем MongoDBCacheManager', function() {
    it ('#пробуем создать экземпляр MongoDBCacheManager (требует наличия mongoose и process.env.URI)', function(done) {
      try {
        mongoDBCacheManager = new MongoDBCacheManager({
          uri: process.env.URI
        })
        done()
      } catch (err) {
        if (err) return done(err);
      }
    })
  })

  if (mongoDBCacheManager) {
    describe('- Устанавливаем ключ "testKey" в значение ["testValue"]', function() {
        it('#без времени жизни и получаем его сразу', function(done) {
          mongoDBCacheManager.set('testKey', ['testValue'])
          .then(() => mongoDBCacheManager.get('testKey')
            .then(testValue => {
              assert(testValue[0] === 'testValue' && (testValue.length === 1))
              done()
            })
            .catch(done)
          )
        })

        it('#со временем жизни 0.5 секунды и получаем его через 0.25 секунд', function(done) {
          mongoDBCacheManager.set('testKey', ['testValue'], 0.5)
          .catch(done)
          setTimeout(() => {
            mongoDBCacheManager.get('testKey')
            .then(testValue => {
              assert(testValue[0] === 'testValue' && (testValue.length === 1))
              done()
            })
            .catch(done)
          }, 250)
        })

        it('#со временем жизни 0.1 секунд и пытаемся получить его через 0.25 секунд', function(done) {
          mongoDBCacheManager.set('testKey', ['testValue'], 0.1)
          .catch(done)
          setTimeout(() => {
            mongoDBCacheManager.get('testKey')
            .then(testValue => {
              assert(!testValue)
              done()
            })
            .catch(done)
          }, 250)
        })
    })
  }
})
