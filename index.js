
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

var DATA_VALUE_ATTR = "data-value";

function Linkage(element, options){
  var me = this;
  me.element = $(element);
  var options = me.options = $.extend({}, DEFAULT_OPTIONS, options);
  me._evt = new Events(me);

  if (options.driver) {
    options.driver.on("change", function(key){
      me.render(key);
    });
  }

  me.element.on("change", function(){
    me._evt.emit("change", this.value);
  });
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
    var option;
    var value;
    var select_options = me.element[0].options;
    // Clear original options.
    for(var i = select_options.length - 1; i >= 0; i--){
      select_options[i] = null;
    }
    // Set new options.
    var defaultOption = me.options.defaultOption;
    if (defaultOption) {
      option = select_options[0] = createOption(defaultOption, true);
      if (defaultOption.disabled !== false) {
        option.disabled = true;
      }
      value = option.value;
    }
    for (var i=0, l=data.length; i<l; i++) {
      option = select_options[defaultOption ? i+1 : i] = createOption(data[i]);
      // XXX: 考虑合并到 createOption(data, value===data_value)
      if (option.value === me.element.attr(DATA_VALUE_ATTR)) {
        option.selected = true;
        option.defaultSelected = true;
        value = option.value;
      }
    }

    if (select_options.length) {
      me._evt.emit("change", value);
    }
  }

  return this;
};

Linkage.prototype.val = function(){
  var me = this;

  if (arguments.length === 0) {
    return me.element.val();
  }

  var value = arguments[0];

  me.element.attr(DATA_VALUE_ATTR, value);
  setValue(me.element, value);

  function setValue(select, value) {
    select.find(">option").each(function(index, option){
      if (option.value === value) {
        option.selected = true;
        option.defaultSelected = true;
        me._evt.emit("change", value);
      }
    });
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
