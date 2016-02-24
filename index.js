/*
 * dualAPI
 * https://github.com/anseki/dual-api
 *
 * Copyright (c) 2016 anseki
 * Licensed under the MIT license.
 */

/* eslint no-underscore-dangle: [2, {"allow": ["_dualApi_methodNames"]}] */

'use strict';

function implementApi(method) {
  return function() {
    var args = Array.prototype.slice.call(arguments), cb;

    if (args.length && args[args.length - 1] instanceof Function) {

      // Callback
      cb = args.pop();
      args.unshift(
        // resolve: cb(null, rtn1, rtn2 ...)
        function() {
          Array.prototype.unshift.call(arguments, null);
          cb.apply(null, arguments);
        },
        // reject: cb(error, rtn1, rtn2 ...)
        function() { cb.apply(null, arguments); });
      return method.apply(null, args);

    } else {

      // Promise
      return new Promise(function(resolve, reject) {
        args.unshift(resolve, reject);
        method.apply(null, args);
      });

    }
  };
}

var baseModuleObj = module.parent;
if (baseModuleObj.exports) {
  if (baseModuleObj.exports instanceof Function) {

    baseModuleObj.exports = implementApi(baseModuleObj.exports);

  } else {

    (baseModuleObj.exports._dualApi_methodNames ||
      Object.keys(baseModuleObj.exports))
    .forEach(function(methodName) {
      if (baseModuleObj.exports[methodName] instanceof Function) {
        baseModuleObj.exports[methodName] = implementApi(baseModuleObj.exports[methodName]);
      }
    });

  }
}
