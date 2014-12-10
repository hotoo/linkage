# Async

---

<select id="province" name="province"></select>
<select id="city" name="city"></select>
<select id="country" name="country"></select>

Set Value:
<button type="button" id="chaoyang">北京-市辖区-朝阳区</button>
<button type="button" id="heping">天津-市辖区-和平区</button>

<hr />

````javascript
seajs.use(['index', 'jquery', 'promise'], function(Linkage, $, Promise) {

  function getData(pid){

    if (!pid) {
      return [];
    }

    return new Promise(function(resolve, reject){

      $.ajax({
        url: "./datas/" + pid + ".json?nowrap",
        dataType: "json",
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
      value: "",
      disabled: true
    },
    data: getData
  });

  var country = new Linkage("#country", {
    driver: city,
    defaultOption: {
      text: "请选择县区",
      value: "",
      disabled: false
    },
    data: getData
  });

  province.render("0001");



  $("#chaoyang").click(function(){
    province.val("11");
    city.val("1101");
    country.val("110105");
  });

  $("#heping").click(function(){
    province.val("12");
    city.val("1201");
    country.val("120101");
  });

});
````
