// hapjs
// http://github.com/hapjs/promise

;
(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Promise = factory();
    };

}(this, function() {
    'use strict';

    var Promise = function(fn){

    };

    return Promise;

}));