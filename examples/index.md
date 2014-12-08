# Demo

---

<select id="province" name="province"></select>
<select id="city" name="city"></select>
<select id="country" name="country"></select>

````javascript
seajs.use(['./data', 'index'], function(DATA, Linkage) {

  function getData(pid, ds){
    var a = [];
    if (!ds) return a;
    for (var i=0, l=ds.length; i<l; i++){
      if (ds[i][2] === pid) {
        a.push({
          text: ds[i][1],
          value: ds[i][0]
        })
      }
    }
    return a;
  }

  var province = new Linkage("#province", {
    data: function(pid) {
      return getData(pid, DATA);
    }
  }).render("0001");

  var city = new Linkage("#city", {
    driver: province,
    data: function(pid) {
      return getData(pid, DATA);
    }
  });
  //$("#country").linkage("#city", DT_Area);

  var country = new Linkage("#country", {
    driver: city,
    data: function(pid) {
      return getData(pid, DATA);
    }
  });

});
````
