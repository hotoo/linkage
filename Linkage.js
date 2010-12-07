/*
var LinkageItem = function(curr, prev){
    this.elem = curr;
    this.parent = prev;

    var ME=this;
    this.parent.change(function(){
        ME.setData(ME.getData(ME.parent.value));
    });
};
LinkageItem.prototype = {
    getData : function(pid){
        var a = [];
        if (!this._ds) return a;
        for (var i=0, l=this._ds.length; i<l; i++){
            if (this._ds[i][2]===k)
                a[a.length] = this._ds[i];
        }
        return a;
    },
    setData : function(datas){
        for (var i=0, l=this.elem.options.length; i<l; i++){
            this.elem.options[0] = null;
            //! this.elem.options.remove(0); // IE support.
        }
        //! if (d.length===0){return;}
        for (var i=0, l=d.length; i<l; i++){
            this.elem.options[i] = new Option(d[i][1], d[i][0])
        }
    }
};*/
(function($){
    function getData(pid, ds){
        var a = [];
        if (!ds) return a;
        for (var i=0, l=ds.length; i<l; i++){
            if (ds[i][2]===pid)
                a[a.length] = ds[i];
        }
        return a;
    }
    $.fn.linkage = function(prev,datas){
        this.each(function(){
            var ME=this, OPS=ME.options;
            $(prev).change(function(){
                // clear original options.
                for(var i=0,l=OPS.length; i<l; i++){
                    OPS[i] = null;
                }
                var d=getData(this.value, datas);

                for(var i=0, l=d.length; i<l; i++){
                    ME.options[i] = new Option(d[i][1], d[i][0])
                }

                $(ME).change();
                //ME.options[0].selected = true;
            });
        });
    };
})(jQuery);
