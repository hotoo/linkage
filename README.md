# Linkage [![spm version](http://spmjs.io/badge/linkage)](http://spmjs.io/package/linkage)

---

Linkage

## INSTALL

```
$ spm install linkage --save
```

## USAGE

```js
var Linkage = require('linkage');
var $ = require("jquery");
var Promise = require('promise');

function request_data(pid){
  return new Promise(function(resolve, reject){

    $.ajax({
      url: "/api/data.json?pid=" + pid,
      success: function(nodes){
        resolve(nodes);
      },
      error: function(err){
        reject(err);
      }
    });

  });
};

var province = new Linkage("#province", {
  data: [
    "北京",
    { text: "天津", value: "12" }
  ]
});

var city = new Linkage("#city", {
  data: request_data
});

var county = new Linkage("#city", {
  data: request_data
});
```

## API

### Linkage Linkage(element, options)

* `element`
  * `{Linkage} driver`: Listener driver change event.
  * `{HTMLSelectElement}` select element.
  * `{jQuery}` jQuery select element.
  * `{String}` select selector.
* `{Object} options`
  * `{Array} data`: return `["text", {text: "Label", value: "0"}]`
  * `{Function} data`: return Array, or Promise.
  * `{String} defaultOption`, select placeholder.
  * `{Object} defaultOption`:
    * `{String} text`: optional.
    * `{String} value`: optional.
    * `{Boolean} disabled` optional.

### linkage.val()

Get selected value.

### linkage.val(value)

Set linkage item value.
