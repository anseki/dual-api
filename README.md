# dualAPI

Make your module implement dual APIs.  
When the method of your module is called, if a callback Function is appended to the arguments, the method works as callback API. Otherwise the method returns a thenable [`Promise`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) instance.

For example:  
This `egg` module exports two methods.  
The `egg.fry` method returns `'fried egg'` if it is called with `'oil'`, otherwise it returns `[Error: burnt egg]`. The `egg.boil` method returns `'boiled egg'` if it is called with `'water'`, otherwise it returns `[Error: broken egg]`. These are the same as a function that is passed to `Promise` constructor.  
**After** setting up `exports`, call `require('dual-api')`.

```js
// `egg` module

function fry(resolve, reject, doWith) {
  console.log(`An egg is fried with ${doWith || 'nothing'}.`);
  setTimeout(() => {
    if (doWith === 'oil') {
      resolve('fried egg');
    } else {
      reject(new Error('burnt egg'));
    }
  }, 3000);
}

function boil(resolve, reject, doWith) {
  console.log(`An egg is boiled with ${doWith || 'nothing'}.`);
  setTimeout(() => {
    if (doWith === 'water') {
      resolve('boiled egg');
    } else {
      reject(new Error('broken egg'));
    }
  }, 3000);
}

exports.fry = fry;
exports.boil = boil;

require('dual-api');
```

A code that uses `egg` module:

```js
const egg = require('egg');

// Call methods as callback API:

egg.fry('oil', function(error, returned) {
  if (error) {
    console.error(error);
  } else {
    console.log(`Got a ${returned}.`);
  }
});

egg.boil('water', function(error, returned) {
  if (error) {
    console.error(error);
  } else {
    console.log(`Got a ${returned}.`);
  }
});

// Call methods as thenable API:

egg.fry('oil')
  .then(returned => { console.log(`Got a ${returned}.`); })
  .catch(error => { console.error(error); });

egg.boil('water')
  .then(returned => { console.log(`Got a ${returned}.`); })
  .catch(error => { console.error(error); });
```

Results:

```
An egg is fried with oil.
Got a fried egg.
An egg is boiled with water.
Got a boiled egg.
An egg is fried with oil.
Got a fried egg.
An egg is boiled with water.
Got a boiled egg.
```

A single method that is set to `module.exports` is also supported.  
For example, `egg-fly` module that exports only `fry` method:

```js
// `egg-fly` module

// There is `fry` function.

module.exports = fry;
require('dual-api');
```

A code that uses `egg-fly` module:

```js
const eggFly = require('egg-fly');

// Call method as callback API:

eggFly('oil', function(error, returned) {
  if (error) {
    console.error(error);
  } else {
    console.log(`Got a ${returned}.`);
  }
});

// Call method as thenable API:

eggFly('oil')
  .then(returned => { console.log(`Got a ${returned}.`); })
  .catch(error => { console.error(error); });
```

By default, all exported methods implement dual APIs.  
You can specify methods that implement dual APIs by using `exports._dualApi_methodNames` array.  
For example, the module exports `fry`, `boil` and `beatUp` methods, and only `boil` and `beatUp` methods implement dual APIs.

```js
// `egg` module

// There are `fry`, `boil` and `beatUp` functions.

exports.fry = fry;
exports.boil = boil;
exports.beatUp = beatUp;

exports._dualApi_methodNames = ['boil', `beatUp`];

require('dual-api');
```
