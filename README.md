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

// 不明确的子级深度（无限级，或不限级）
var linkage = new Linkage("#level-1", {
  data: function(parentNodeID){
    return new Promise(function(resolve, reject){

      $.ajax({
        url: "/api/tree.json?pid=" + parentNodeID,
        success: function(nodes){
          resolve(nodes);
        },
        error: function(err){
          reject(err);
        }
      });

    });
  },
  names: function(){
    return "level-" + this.level;
  }
});

// 明确的子级深度。
var province = new Linkage("#province", {
  data: ["北京", "河北"]
});
var city = new Linkage("#city", {
  data: function(key){
  }
});
var county = new Linkage("#city", {});
```

## API

### Linkage Linkage(options)

### linkage.val()

Get selected value.

### linkage.val(value)

Set linkage item value.
