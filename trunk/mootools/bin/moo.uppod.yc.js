var Uppod=new Class({Implements:[Options],options:{debug:false,player_id:"uppod_player_"+Math.random(),width:500,src:"swf/uppod.swf",height:375,params:{allowFullScreen:true},vars:{uid:false}},initialize:function(a,b){this.setOptions(b);this.player_id=this.options.player_id;this.container=a;this.width=this.options.width;this.height=this.options.height;this.params=this.options.params;this.vars=this.options.vars;this.vars.uid=this.player_id;this.src=this.options.src;this.timed=false;this.time=false;if(this.options.debug){if($("uppod-debug")){var c=$("uppod-debug")}else{var c=new Element("div",{id:"uppod-debug","class":"debug"});c.inject(document.body)}}this.init()}});Uppod.implement({init:function(){if(!$(this.container)){this.error("Не найден контейнер #"+this.container+" , аварийное завершение.");return}if($(this.player_id)){this.error('Плеер "'+this.player_id+'" уже существует , аварийное завершение.');return}this.obj=new Swiff(this.src+"?"+Math.random(),{id:this.player_id,container:this.container,width:this.width,height:this.height,params:this.params,vars:this.vars});this.player=this.getMovie(this.player_id);if(this.player=="undefined"){this.error('Не могу обратится к плееру "'+this.player_id+'", аварийное завершение.');return}this.bind()},log:function(b){if(this.options.debug){if(b&&b.length>0){if(console){console.info(b)}else{if($$("#uppod-debug p").length>10){$("uppod-debug").empty()}var c=new Element("p",{"class":"log",html:"Плеер "+this.player_id+" сообщает: "+b});var a=$("uppod-debug");c.inject(a)}}}},error:function(c){if(this.options.debug){if(c&&c.length>0){if(console){console.error(c)}else{var d=new Element("p",{"class":"error",html:c});var b=$("uppod-debug");var a=b.get("html");d.inject(b)}}}},bind:function(){var a=this.player;var b=this;$$("."+this.player_id+".command").addEvent("click",function(d){console.log($(this));d.stop();var g=this.get("rel").split(" ");if(g.length>0){var f=g[0];var c=g[1]}else{var f=g}switch(f){case"play":case"pause":case"toggle":case"stop":case"getpl":case"getime":case"getv":b.cmd(f);break;case"volume":b.cmd("v",c);break;case"start":b.cmd("start",c);break;case"getimed":b.getTimed();break}})},getMovie:function(a){if(Browser.Engine.trident){return window[a]}else{return document[a]}},cmd:function(c,b,d){var a=c+(b?":"+b:"");this.log("посылаю комманду "+a);if((typeof this.player.sendToUppod!="undefined")&&typeof this.player!="undefined"){return this.player.sendToUppod(a,(d?d:""))}else{this.error("Не могу выполнить комманду: "+c+' к плееру "'+this.player_id+'", аварийное завершение.')}},file:function(a){this.cmd("file")},play:function(){this.cmd("play")},pause:function(){this.cmd("pause")},toggle:function(){this.cmd("toggle")},stop:function(){this.cmd("stop")},seek:function(a){return this.cmd("seek",a)},getpl:function(){return this.cmd("getpl")},getv:function(){return this.cmd("getv")},getTime:function(a){return this.cmd("getime","",a)},getTimed:function(a){return this.cmd("getimed","",a)},getStatus:function(a){return this.cmd("getstatus","",a)},getFull:function(a){return this.cmd("getfull","",a)},setTimed:function(a){this.timed=a},setTime:function(a){this.time=a},volume:function(a){if(typeof a!="number"){a=50}if(a<0){a=0}if(a>100){a=100}this.cmd("v"+a)},setClosedText:function(a){return this.cmd("text",a)},setText:function(a){return this.cmd("text2",a)},setPl:function(a){return this.cmd("pl",JSON.encode(a))},removeText:function(){return this.cmd("xtext")},removePl:function(){return this.cmd("xpl")},random:function(){return this.cmd("random")},fullscreen:function(){return this.cmd("fullscreen")},start:function(a){if(typeof a!="number"){a=50}if(a<0){a=0}if(a>100){a=100}this.cmd("start"+a)},startTimer:function(callback,period){eval(callback);var parent=this;this.timer=setTimeout(function(){parent.startTimer(callback,period)},period)},stopTime:function(){clearTimeout(this.timer)}});