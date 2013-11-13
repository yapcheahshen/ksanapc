define(['underscore','text!./nav.tmpl','backbone'], 
 function(_,template,Backbone) {
  return {
   type:"Backbone",
    events: {
      "click .breadcrumb li":"goback",
      "click .list-group-item":"opennode",
    },
   haschildren:function(data) {
        if (typeof data!='object') return [];
        var arr=Object.keys(data);
          var toc=[];
          for (var i in arr) {
            var count=0,extratype=extratype="label-success";
            var c=data[arr[i]];
            if (typeof c=='string' && c.charCodeAt(0)==0) {
              count='?'; //unknown , to be load
              c="...";
              extratype="label-default";
            } else if ( typeof c=='object') {
              count=c.length;
              if (typeof count=='undefined') count=Object.keys(c).length;
              extratype="label-warning";
              c="";
            }
            toc.push({ extratype: extratype, value:c, text:arr[i] , childcount:count});
          }
          return toc;
   },
   getpath:function(path) {
      var that=this;
      var yadb=this.sandbox.yadb;
      yadb.getRaw(path, function(err,data) {
        if (typeof data=='object') {
          var toc=that.haschildren(data);
          that.rendertoc(path,toc);
        } else { //update the current dom node
          var p=JSON.parse(JSON.stringify(path));
          var field=p.pop();
          for (var i in that.toc) { //this is an dirty hack
            if (that.toc[i].text==field) {
              that.toc[i].value=data;
              that.toc[i].childcount=0;
              that.toc[i].extratype="label-success";
            }
          }
          that.rendertoc(p,that.toc);
        }
      });   
   }, 
    goback:function(e) {
      $e=$(e.target);
      var path=[];
      while ($e.length) {
        path.unshift( $e.html());
        $e=$e.parent().prev().children('a');
      }
      path.shift();
      this.getpath(path);
      e.preventDefault();
    },
    opennode:function(e) {
      $e=$(e.target);
      var node=($e.attr("data-node"));
      $e.parent().children().removeClass('active');
      $e.addClass('active')
      var path=JSON.parse(JSON.stringify(this.parents));
      path.push(node);
      this.getpath(path);
      e.preventDefault();
    },
     rendertoc:function(path,toc) {
      this.toc=toc;
      this.parents=path;
      var patharr=JSON.parse(JSON.stringify(path));
      patharr.unshift('YDB');
      var size=0;
      $(this.el).html( _.template(template, {children:this.toc,parents:patharr,size:size}));
      this.router.navigate(path.join('/'));
    },
    pathchange:function() {
        var patharr=[];
        var path=this.model.get("path");
        if (path) patharr=path.split('/');
        this.getpath(patharr);
    },
    initialize: function() {
      this.model=new Backbone.Model();
      this.model.on("change:path",this.pathchange,this);
      var that=this;
      this.router = new Backbone.Router();
      this.html(_.template(template,{parents:{},children:{},size:0}) );
      this.router.route("*path","setpath",function(path) {
        that.model.set({"path":path});
      });
      var hash=window.location.href.match(/.*#.*/);
      if (hash) {
        this.model.set({"path":hash[1]}); 
      } else {
        this.model.set({"path":""})
      }
      this.sandbox.logger.log('initialized');
    }
  }
});
