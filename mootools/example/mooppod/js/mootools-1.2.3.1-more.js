//MooTools More, <http://mootools.net/more>. Copyright (c) 2006-2009 Aaron Newton <http://clientcide.com/>, Valerio Proietti <http://mad4milk.net> & the MooTools team <http://mootools.net/developers>, MIT Style License.

MooTools.More={version:"1.2.3.1"};Class.Mutators.Binds=function(a){return a;};Class.Mutators.initialize=function(a){return function(){$splat(this.Binds).each(function(b){var c=this[b];
if(c){this[b]=c.bind(this);}},this);return a.apply(this,arguments);};};var Drag=new Class({Implements:[Events,Options],options:{snap:6,unit:"px",grid:false,style:true,limit:false,handle:false,invert:false,preventDefault:false,modifiers:{x:"left",y:"top"}},initialize:function(){var b=Array.link(arguments,{options:Object.type,element:$defined});
this.element=document.id(b.element);this.document=this.element.getDocument();this.setOptions(b.options||{});var a=$type(this.options.handle);this.handles=((a=="array"||a=="collection")?$$(this.options.handle):document.id(this.options.handle))||this.element;
this.mouse={now:{},pos:{}};this.value={start:{},now:{}};this.selection=(Browser.Engine.trident)?"selectstart":"mousedown";this.bound={start:this.start.bind(this),check:this.check.bind(this),drag:this.drag.bind(this),stop:this.stop.bind(this),cancel:this.cancel.bind(this),eventStop:$lambda(false)};
this.attach();},attach:function(){this.handles.addEvent("mousedown",this.bound.start);return this;},detach:function(){this.handles.removeEvent("mousedown",this.bound.start);
return this;},start:function(c){if(this.options.preventDefault){c.preventDefault();}this.mouse.start=c.page;this.fireEvent("beforeStart",this.element);
var a=this.options.limit;this.limit={x:[],y:[]};for(var d in this.options.modifiers){if(!this.options.modifiers[d]){continue;}if(this.options.style){this.value.now[d]=this.element.getStyle(this.options.modifiers[d]).toInt();
}else{this.value.now[d]=this.element[this.options.modifiers[d]];}if(this.options.invert){this.value.now[d]*=-1;}this.mouse.pos[d]=c.page[d]-this.value.now[d];
if(a&&a[d]){for(var b=2;b--;b){if($chk(a[d][b])){this.limit[d][b]=$lambda(a[d][b])();}}}}if($type(this.options.grid)=="number"){this.options.grid={x:this.options.grid,y:this.options.grid};
}this.document.addEvents({mousemove:this.bound.check,mouseup:this.bound.cancel});this.document.addEvent(this.selection,this.bound.eventStop);},check:function(a){if(this.options.preventDefault){a.preventDefault();
}var b=Math.round(Math.sqrt(Math.pow(a.page.x-this.mouse.start.x,2)+Math.pow(a.page.y-this.mouse.start.y,2)));if(b>this.options.snap){this.cancel();this.document.addEvents({mousemove:this.bound.drag,mouseup:this.bound.stop});
this.fireEvent("start",[this.element,a]).fireEvent("snap",this.element);}},drag:function(a){if(this.options.preventDefault){a.preventDefault();}this.mouse.now=a.page;
for(var b in this.options.modifiers){if(!this.options.modifiers[b]){continue;}this.value.now[b]=this.mouse.now[b]-this.mouse.pos[b];if(this.options.invert){this.value.now[b]*=-1;
}if(this.options.limit&&this.limit[b]){if($chk(this.limit[b][1])&&(this.value.now[b]>this.limit[b][1])){this.value.now[b]=this.limit[b][1];}else{if($chk(this.limit[b][0])&&(this.value.now[b]<this.limit[b][0])){this.value.now[b]=this.limit[b][0];
}}}if(this.options.grid[b]){this.value.now[b]-=((this.value.now[b]-(this.limit[b][0]||0))%this.options.grid[b]);}if(this.options.style){this.element.setStyle(this.options.modifiers[b],this.value.now[b]+this.options.unit);
}else{this.element[this.options.modifiers[b]]=this.value.now[b];}}this.fireEvent("drag",[this.element,a]);},cancel:function(a){this.document.removeEvent("mousemove",this.bound.check);
this.document.removeEvent("mouseup",this.bound.cancel);if(a){this.document.removeEvent(this.selection,this.bound.eventStop);this.fireEvent("cancel",this.element);
}},stop:function(a){this.document.removeEvent(this.selection,this.bound.eventStop);this.document.removeEvent("mousemove",this.bound.drag);this.document.removeEvent("mouseup",this.bound.stop);
if(a){this.fireEvent("complete",[this.element,a]);}}});Element.implement({makeResizable:function(a){var b=new Drag(this,$merge({modifiers:{x:"width",y:"height"}},a));
this.store("resizer",b);return b.addEvent("drag",function(){this.fireEvent("resize",b);}.bind(this));}});var Slider=new Class({Implements:[Events,Options],Binds:["clickedElement","draggedKnob","scrolledElement"],options:{onTick:function(a){if(this.options.snap){a=this.toPosition(this.step);
}this.knob.setStyle(this.property,a);},snap:false,offset:0,range:false,wheel:false,steps:100,mode:"horizontal"},initialize:function(f,a,e){this.setOptions(e);
this.element=document.id(f);this.knob=document.id(a);this.previousChange=this.previousEnd=this.step=-1;var g,b={},d={x:false,y:false};switch(this.options.mode){case"vertical":this.axis="y";
this.property="top";g="offsetHeight";break;case"horizontal":this.axis="x";this.property="left";g="offsetWidth";}this.half=this.knob[g]/2;this.full=this.element[g]-this.knob[g]+(this.options.offset*2);
this.min=$chk(this.options.range[0])?this.options.range[0]:0;this.max=$chk(this.options.range[1])?this.options.range[1]:this.options.steps;this.range=this.max-this.min;
this.steps=this.options.steps||this.full;this.stepSize=Math.abs(this.range)/this.steps;this.stepWidth=this.stepSize*this.full/Math.abs(this.range);this.knob.setStyle("position","relative").setStyle(this.property,-this.options.offset);
d[this.axis]=this.property;b[this.axis]=[-this.options.offset,this.full-this.options.offset];this.bound={clickedElement:this.clickedElement.bind(this),scrolledElement:this.scrolledElement.bindWithEvent(this),draggedKnob:this.draggedKnob.bind(this)};
var c={snap:0,limit:b,modifiers:d,onDrag:this.bound.draggedKnob,onStart:this.bound.draggedKnob,onBeforeStart:(function(){this.isDragging=true;}).bind(this),onComplete:function(){this.isDragging=false;
this.draggedKnob();this.end();}.bind(this)};if(this.options.snap){c.grid=Math.ceil(this.stepWidth);c.limit[this.axis][1]=this.full;}this.drag=new Drag(this.knob,c);
this.attach();},attach:function(){this.element.addEvent("mousedown",this.bound.clickedElement);if(this.options.wheel){this.element.addEvent("mousewheel",this.bound.scrolledElement);
}this.drag.attach();return this;},detach:function(){this.element.removeEvent("mousedown",this.bound.clickedElement);this.element.removeEvent("mousewheel",this.bound.scrolledElement);
this.drag.detach();return this;},set:function(a){if(!((this.range>0)^(a<this.min))){a=this.min;}if(!((this.range>0)^(a>this.max))){a=this.max;}this.step=Math.round(a);
this.checkStep();this.fireEvent("tick",this.toPosition(this.step));this.end();return this;},clickedElement:function(c){if(this.isDragging||c.target==this.knob){return;
}var b=this.range<0?-1:1;var a=c.page[this.axis]-this.element.getPosition()[this.axis]-this.half;a=a.limit(-this.options.offset,this.full-this.options.offset);
this.step=Math.round(this.min+b*this.toStep(a));this.checkStep();this.fireEvent("tick",a);this.end();},scrolledElement:function(a){var b=(this.options.mode=="horizontal")?(a.wheel<0):(a.wheel>0);
this.set(b?this.step-this.stepSize:this.step+this.stepSize);a.stop();},draggedKnob:function(){var b=this.range<0?-1:1;var a=this.drag.value.now[this.axis];
a=a.limit(-this.options.offset,this.full-this.options.offset);this.step=Math.round(this.min+b*this.toStep(a));this.checkStep();},checkStep:function(){if(this.previousChange!=this.step){this.previousChange=this.step;
this.fireEvent("change",this.step);}},end:function(){if(this.previousEnd!==this.step){this.previousEnd=this.step;this.fireEvent("complete",this.step+"");
}},toStep:function(a){var b=(a+this.options.offset)*this.stepSize/this.full*this.steps;return this.options.steps?Math.round(b-=b%this.stepSize):b;},toPosition:function(a){return(this.full*Math.abs(this.min-a))/(this.steps*this.stepSize)-this.options.offset;
}});