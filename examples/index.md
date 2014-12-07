# Demo

---

<select id="p" name="p">
  <option value="11">北京</option>
  <option value="12">天津</option>
  <option value="13">河北</option>
  <option value="14">山西</option>
</select>
<select id="city" name="city"></select>
<select id="country" name="country"></select>

````javascript
seajs.use('index', function(linkage) {

  $("#city").linkage("#p", DT_Area);
  $("#country").linkage("#city", DT_Area);

});
````
