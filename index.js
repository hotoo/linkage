
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
function createOption(option_data, selected, disabled){
  if (!isObject(option_data)) {
    option_data = {
      text: option_data
    };
  }
  if (isFunction(selected)) {
    selected = selected(option_data);
  }
  var option = new Option(
    isDefined(option_data.text) ? option_data.text : option_data.value || "",
    isDefined(option_data.value) ? option_data.value : option_data.text || "",
    isDefined(option_data.defaultSelected) ? option_data.defaultSelected : selected || false,
    isDefined(option_data.selected) ? option_data.selected : selected || false
  );
  option.disabled = isDefined(option_data.disabled) ? option_data.disabled : disabled || false;

  return option;
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
      option = select_options[0] = createOption(defaultOption, true, true);
    }
    for (var i=0, l=data.length; i<l; i++) {
      option = select_options[defaultOption ? i+1 : i] = createOption(data[i], function(option){
        return option.value === me.element.attr(DATA_VALUE_ATTR);
      });
    }

    if (select_options.length) {
      me._evt.emit("change", me.element.val());
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
