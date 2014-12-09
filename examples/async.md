# Async

---

<select id="province" name="province"></select>
<select id="city" name="city"></select>
<select id="country" name="country"></select>

````javascript
seajs.use(['index', 'jquery', 'promise'], function(Linkage, $, Promise) {

  function getData(pid){

    if (!pid) {
      return [];
    }

    return new Promise(function(resolve, reject){

      $.ajax({
        url: "./datas/" + pid + ".json?nowrap",
        success: function(DATA){
          if (!DATA) {
            reject(data);
          }

          var a = [];
          for (var i=0, l=DATA.length; i<l; i++){
            if (DATA[i][2] === pid) {
              a.push({
                text: DATA[i][1],
                value: DATA[i][0]
              });
            }
          }
          resolve(a);
        },
        error: function(err){
          reject(err);
        }
      });

    });
  }

  var province = new Linkage("#province", {
    data: getData,
    defaultOption: {
      text: "请选择省份",
      value: ""
    }
  });

  var city = new Linkage("#city", {
    driver: province,
    defaultOption: {
      text: "请选择城市",
      value: ""
    },
    data: getData
  });

  var country = new Linkage("#country", {
    driver: city,
    defaultOption: {
      text: "请选择县区",
      value: ""
    },
    data: getData
  });

  province.render("0001");

});
````
