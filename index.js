
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
  me.status = "init";

  if (options.driver) {
    options.driver.on("change", function(key){
      me.render(key);
    }).on("loading", function(){
      me.status = "loading";
    });
  }

  me.element.on("change", function(){
    me._evt.emit("change", this.value);
  })
};

Linkage.prototype.render = function(key){
  var me = this;
  me.status = "loading";
  me._evt.emit(me.status);
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
    for (var i=0, d, l=data.length; i<l; i++) {
      d = isObject(data[i]) ? data[i] : {
        text: data[i]
      };
      select_options[defaultOption ? i+1 : i] = createOption(d);
    }

    if (select_options.length) {
      me._evt.emit("change", select_options[0].value);
    }
    if (data.length) {
      me.status = "ready";
      me._evt.emit("ready");
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
