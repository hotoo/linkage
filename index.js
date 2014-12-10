
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

function isDefined(object){
  return typeof object !== "undefined";
}
function createOption(option, selected){
  if (!isObject(option)) {
    option = {
      text: option
    };
  }
  return new Option(
    isDefined(option.text) ? option.text : option.value || "",
    isDefined(option.value) ? option.value : option.text || "",
    isDefined(option.defaultSelected) ? option.defaultSelected : selected || false,
    isDefined(option.selected) ? option.selected : selected || false
  );
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
  me._setStatus("init");

  if (options.driver) {
    options.driver.on("change", function(key){
      me.render(key);
    }).on("loading", function(){
      me._setStatus("loading");
    });
  }

  me.element.on("change", function(){
    me._evt.emit("change", this.value);
  })
};

Linkage.prototype._setStatus = function(status){
  var me = this;
  me.status = status;
  me._evt.emit(status);
};

Linkage.prototype.render = function(key){
  var me = this;
  me._setStatus("loading");
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
      select_options[0] = createOption(defaultOption, true);
      if (defaultOption.disabled !== false) {
        select_options[0].disabled = true;
      }
    }
    for (var i=0, l=data.length; i<l; i++) {
      select_options[defaultOption ? i+1 : i] = createOption(data[i]);
    }

    if (select_options.length) {
      me._evt.emit("change", select_options[0].value);
    }
    if (data.length) {
      me._setStatus("ready");
    }
  }

  return this;
};

Linkage.prototype.val = function(){
  if (arguments.length === 0) {
    return this.element.val();
  }

  var me = this;
  var value = arguments[0];

  if (!me.options.driver || me.status === "ready") {
    setValue();
  } else {
    this.on("ready", setValue);
  }

  function setValue() {
    me._evt.off("ready", setValue);
    me.element.val(value);
    me._evt.emit("change", value);
  }
};

Linkage.prototype.on = function(eventName, handler){
  this._evt.on(eventName, handler);
  return this;
};
Linkage.prototype.off = function(){
  this._evt.off(eventName, handler);
  return this;
};

module.exports = Linkage;
