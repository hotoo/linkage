# Demo

---

<select id="province" name="province"></select>
<select id="city" name="city"></select>
<select id="country" name="country"></select>

Set Value:
<button type="button" id="chaoyang">北京-市辖区-朝阳区</button>
<button type="button" id="xihu">浙江-杭州-西湖区</button>

<hr />

````javascript
seajs.use(['./data', 'index', 'jquery'], function(DATA, Linkage, $) {

  function getData(pid){
    var a = [];
    if (!DATA) return a;
    for (var i=0, l=DATA.length; i<l; i++){
      if (DATA[i][2] === pid) {
        a.push({
          text: DATA[i][1],
          value: DATA[i][0]
        });
      }
    }
    return a;
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

  $("#xihu").click(function(){
    province.val("33");
    city.val("3301");
    country.val("330106");
  });

});
````
