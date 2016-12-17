// hapjs
// http://github.com/hapjs/promise
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Promise = factory();
    };
}(this, function () {
    
    var PEDDING = 1, 
        RESOLVE = 2, 
        REJECT = 3,
        transition = function(status, value){
            if(!this._status === PEDDING) return;
            this._status = status;
            this._value = value;
            emmiter.call(this);
        },
        binder = function(status){
            return function(fn){
                if(typeof fn !== 'function') return;
                this[status === REJECT ? '_rejects' : '_resolves'].push(fn);
                emmiter.call(this);
            };
        },
        emmiter = function(){
            var status = this._status, 
                fns = this[status === REJECT ? '_rejects' : '_resolves'],
                val = this._value;
            if(this._status === PEDDING){
                return;
            }else{
                while(fns.length){
                    val = fns.shift().call(this, val);
                };
            };
        },
        reslover = function(value){
            transition.call(this, RESOLVE, value);
        },
        rejecter = function(err){
            transition.call(this, REJECT, err);
        };

    var Promise = function (callback) {
        this._status = PEDDING;
        this._rejects = [];
        this._resolves = [];
        callback(reslover.bind(this), rejecter.bind(this));
    }

    Promise.prototype = {
        then: function (success, failure) {
            binder(RESOLVE).bind(this)(success);
            binder(REJECT).bind(this)(failure);
            return this;
        },
        catch: function (failure) {
            binder(REJECT).bind(this)(failure);
            return this;
        }
    }

    return Promise;
}));