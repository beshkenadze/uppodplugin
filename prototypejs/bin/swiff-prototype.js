var Swiff=Class.create({options:{id:null,height:1,width:1,container:null,properties:{},params:{quality:"high",allowScriptAccess:"always",wMode:"transparent",swLiveConnect:true},callBacks:{},vars:{}},toElement:function(){return this.object},initialize:function(l,m){this.instance="Swiff_"+new Date().getTime();this.setOptions(m);m=this.options;var b=this.id=m.id||this.instance;var a=$(m.container);Swiff.CallBacks[this.instance]={};var e=m.params,g=m.vars,f=m.callBacks;var h=Object.extend({height:m.height,width:m.width},m.properties);var k=this;for(var d in f){Swiff.CallBacks[this.instance][d]=(function(n){return function(){return n.apply(k.object,arguments)}})(f[d]);g[d]="Swiff.CallBacks."+this.instance+"."+d}e.flashVars=Hash.toQueryString(g);if(Prototype.Browser.IE){h.classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";e.movie=l}else{h.type="application/x-shockwave-flash";h.data=l}var j='<object id="'+b+'"';for(var i in h){j+=" "+i+'="'+h[i]+'"'}j+=">";for(var c in e){if(e[c]){j+='<param name="'+c+'" value="'+e[c]+'" />'}}j+="</object>";this.object=((a)?a.update():new Element("div")).update(j).firstChild},setOptions:function(a){this.options=Object.extend(this.options,a)},replaces:function(a){a=$(a,true);a.parentNode.replaceChild(this.toElement(),a);return this},inject:function(a){$(a,true).appendChild(this.toElement());return this},remote:function(){return Swiff.remote.apply(Swiff,[this.toElement()].extend(arguments))}});Swiff.CallBacks={};Swiff.remote=function(obj,fn){var rs=obj.CallFunction('<invoke name="'+fn+'" returntype="javascript">'+__flash__argumentsToXML(arguments,2)+"</invoke>");return eval(rs)};