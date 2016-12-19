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
            return function(fn, callback){
                if(typeof fn !== 'function') return;
                this[status === REJECT ? '_rej' : '_res'].push(function(){
                    var val = this.fn.apply(this.context, arguments);
                    if(typeof this.cb == 'function'){
                        this.cb(val);
                    };
                }.bind({ context: this, fn: fn, cb: callback}));
                emmiter.call(this);
            };
        },
        emmiter = function(){
            var status = this._status, fns = this[status === REJECT ? '_rej' : '_res'];
            if(this._status === PEDDING){
                return;
            }else{
                while(fns.length){
                    fns.shift().call(this, this._value);
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
        this._rej = [];
        this._res = [];
        callback(reslover.bind(this), rejecter.bind(this));
    }

    Promise.prototype = {
        then: function (success, failure) {
            return new Promise(function(res, rej){
                binder(RESOLVE).bind(this)(success, res);
                binder(REJECT).bind(this)(failure, rej);
            }.bind(this));
        },
        catch: function (failure) {
            return this.then(undefined, failure);
        }
    }

    return Promise;
}));