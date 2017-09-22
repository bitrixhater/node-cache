# node-cache
A little cache manager, used in my own projects


# Usage

## Install

```bash
$ npm install bitrixhater-node-cache --save
```

## Require

Auto-detect preferer cache manager
```JS
const cacheManager = require('bitrixhater-node-cache')({
  cacheTime: 0,
  modelName: 'MongoDBCacheManager',
  uri: false
})
```

RAM cache manager
```JS
const cacheManager = new (require('./node-cache')).RAMCacheManager({
  cacheTime: 15
})
```

MongoDB cache manager (require connected `mongoose` (or pass `uri` option to connect))
```JS
const cacheManager = new (require('./node-cache')).MongoDBCacheManager({
  cacheTime: 15,
  modelName: 'MongoDBCacheManager',
  uri: false
})
```

## Options list

| Key         | Type     | Default               |
| ----------- | -------- | --------------------- |
| cacheTime   | int      | 0 - infinity          |
| modelName   | string   | 'MongoDBCacheManager' |
| uri         | string   | undefined             |

## Methods

| Method | Arguments                                    |
| ------ | -------------------------------------------- |
| set    | key = string, data = object, cacheTime = int |
| get    | key = string                                 |
| remove | key = string                                 |
| clear  | flush cache storage                          |

## Code example

You can find examples in the `./test/test.js` file. But if you dont like read a code I wrote examples below only for you, my friend <3

```JS
/**
 * Just require it and pass the options. That's it.
 *
 * If lib detect mongoose and if mongoose has been connected to db, you will be use MongoDBCacheManager, otherwise - RAMCacheManager. 
 * If you dont have active mongodb connection and you want to connect, just pass uri option
 */
const cacheManager = require('bitrixhater-node-cache')({
  cacheTime: 0
})

let testResults = {}

cacheManager.set('testKey', ['testValue'])
.then(() => cacheManager.get('testKey')
  .then(testValue => {
    testResults[1] = (testValue[0] === 'testValue' && (testValue.length === 1))
  })
  .catch(function() {
    testResults[1] = false
  })
)

ramCacheManager.set('testKey', ['testValue'], 0.01)
setTimeout(() => {
  ramCacheManager.get('testKey')
  .then(testValue => {
    testResults[2] = (testValue[0] === 'testValue' && (testValue.length === 1))
  })
  .catch(function() {
    testResults[2] = false
  })
}, 5)

ramCacheManager.set('testKey', ['testValue'], 0.005)
setTimeout(() => {
  ramCacheManager.get('testKey')
  .then(testValue => {
    testResults[3] = (!testValue)
  })
  .catch(function() {
    testResults[3] = false
  })
}, 10)

console.log(testResults)
```


# Tests
```bash
$ npm test
```


# Contributions
PRs and issues are open. But just use only 2 spaces, not tabs for PRs


# License

MIT
