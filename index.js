
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

  // {Linkage}
  driver: null,

  // default select option.
  // if not null, add first select option and default is selected.
  // example:
  //
  //   defaultOption: "Please Choose.."
  //
  // or:
  //
  //   defaultOption: {
  //     text: "Please Choose..",
  //     value: "",
  //     disabled: false
  //   }
  defaultOption: null
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
    }, function(){
      render([]);
    });
  } else {
    render(data);
  }

  function render(data){
    var select_options = me.element[0].options;
    // Clear original options.
    for(var i = select_options.length - 1; i >= 0; i--){
      select_options[i] = null;
    }
    // Set new options.
    var defaultOption = me.options.defaultOption;
    if (defaultOption) {
      select_options[0] = new Option(
          defaultOption.text || defaultOption.value,
          typeof defaultOption.value !== "undefined" ? defaultOption.value : defaultOption.text,
          typeof defaultOption.defaultSelected !== "undefined" ? defaultOption.defaultSelected : true,
          typeof defaultOption.selected !== "undefined" ? defaultOption.selected : true
        );
      if (defaultOption.disabled !== false) {
        select_options[0].disabled = true;
      }
    }
    for (var i=0, d, l=data.length; i<l; i++) {
      d = isObject(data[i]) ? data[i] : {
        text: data[i]
      };
      select_options[defaultOption ? i+1 : i] = new Option(
          d.text || d.value,
          d.value || d.text,
          d.defaultSelected || false,
          d.selected || false
        );
    }

    if (select_options.length) {
      me._evt.emit("change", select_options[0].value);
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
