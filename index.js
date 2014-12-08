
var $ = require("jquery");
var Events = require("evt");

function typeOf (type){
  return function(object) {
    return Object.prototype.toString.call(object) === '[object ' + type + ']'
  };
}
var isObject = typeOf("Object");
var isFunction = typeOf("Function");

function isPromise(object){
  return object && isFunction(object.then);
}

var DEFAULT_OPTIONS = {
  data: [],
  driver: null
};

function Linkage(element, options){
  var me = this;
  me.element = $(element);
  var options = me.options = $.extend({}, DEFAULT_OPTIONS, options);
  me._evt = new Events(me);

  if (options.driver) {
    options.driver.on("change", function(key){
      me.render(key)
    });
  }

  me.element.on("change", function(){
    me._evt.emit("change", this.value);
  })
};

Linkage.prototype.render = function(key){
  var me = this;
  var data_option = this.options.data;
  var data = isFunction(data_option) ? data_option(key) : data_option;

  if (isPromise(data)) {
    data.then(function(data){
      render(data);
    });
  } else {
    render(data);
  }

  function render(data){
    var select_options = me.element[0].options;
    // Clear original options.
    for(var i=0,l=select_options.length; i<l; i++){
      select_options[i] = null;
    }
    // Set new options.
    for (var i=0, d, l=data.length; i<l; i++) {
      d = isObject(data[i]) ? data[i] : {
        text: data[i]
      };
      select_options[i] = new Option(
          d.text || d.value,
          d.value || d.text,
          d.defaultSelected || false,
          d.selected || false
        );
    }
  }

  return this;
};

Linkage.prototype.on = function(eventName, handler){
  this._evt.on(eventName, handler);
};
Linkage.prototype.off = function(){
  this._evt.off(eventName, handler);
};

module.exports = Linkage;
