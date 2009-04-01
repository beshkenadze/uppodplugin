/**
 * @author Александр Бешкенадзе beshkenadze@gmail.com
 * @description Uppod - Mootools плагин для работы с Uppod Player
 * Released under the GNU GPLv2 Licenses.
 */
var Uppod = new Class({
			Implements : [Options],
			options : { // опции по умолчанию
				debug:false,
				player_id : 'uppod_player'+Math.random(),
				width:500,
				src: 'swf/uppod.swf',
				height:375,
				params: {},
				vars : {}
			},
			initialize : function(container,options) {
				this.setOptions(options);
				this.player_id = this.options.player_id;
				this.container = container;
				this.width = this.options.width;
				this.height = this.options.height;
				this.params = this.options.params;
				this.vars = this.options.vars;
				this.src = this.options.src;
				this.timed = false;
				this.time = false;
				if(this.options.debug){
					if($('uppod-debug')){
						var log = $('uppod-debug');
					}else{
						var log = new Element('div',{
							'id':'uppod-debug',
							'class':'debug'
						});
						log.inject(document.body);
					}
				}
                this.init();
			}
		});
Uppod.implement({
	init: function(){
		if(!$(this.container)) {
			this.error('Не найден контейнер #'+this.container+' , аварийное завершение.');
			return;
		}
		if($(this.player_id)) {
			this.error('Плеер "'+this.player_id+'" уже существует , аварийное завершение.');
			return;
		}
		var obj = new Swiff(this.src + '?' + Math.random(), {
			id :this.player_id,
			container :this.container,
			width :this.width,
			height :this.height,
			params: this.params,
		    vars : this.vars
		});
		this.player = this.getMovie(this.player_id);
		if(this.player == 'undefined') {
			this.error('Не могу обратится к плееру "'+this.player_id+'", аварийное завершение.');
			return;
		}
		this.bind();
		
    },
	log:function(message){
		if(this.options.debug){
			if(message.length > 0) {
				if($$('#uppod-debug p').length > 10) $('uppod-debug').empty();
				var p = new Element('p',{'class':'log','html':'Плеер '+this.player_id+' сообщает: '+message});
				var log = $('uppod-debug');
				p.inject(log);
			}
		}
	},
	error:function(message){
		if(this.options.debug){
			if(message.length > 0) {
				var p = new Element('p',{'class':'error','html':message});
				var log = $('uppod-debug');
				var html = log.get('html');
				p.inject(log);
			}
		}
	},
	bind:function(){
		var player = this.player;
		var parent = this;
		$$('.uppod-command-'+this.player_id).addEvent('click',function(e){
			e.stop();
			var coms = this.get('rel').split(' ');
			if(coms.length > 0){
				var command = coms[0];
				var value = coms[1];
			}else{
				var command = coms;
			}
			switch(command)
			{
			case 'play':
			case 'pause':
			case 'toggle':
			case 'stop':
			case 'getpl':
			case 'getime':
			case 'getv':
			  parent.cmd(command);
			  break;
			case 'volume':
			  parent.cmd('v',value);
				break;
			case 'start':
			  parent.cmd('start',value);
				break;
			case 'getimed':
			  parent.getTimed()
				break;
			}
		});	
	},
	getMovie: function (movieName) {
		if (Browser.Engine.trident) {
			return window[movieName];
		} else {
			return document[movieName];
		}
	},
	cmd: function(command,value,callback){
		if(!value) {
			var value = '';
		}
		this.log('посылаю комманду '+command+value);
		return this.player.sendToUppod(command+value,(callback?callback:''));
	},
	play: function(){
		this.cmd('play');
	},
	pause: function(){
		this.cmd('pause');
	},
	toggle: function(){
		this.cmd('toggle');
	},
	stop: function(){
		this.cmd('stop');
	},
	getpl: function(){
		return this.cmd('getpl');
	},
	getv: function(){
		return this.cmd('getv');
	},
	getTime: function(callback){
		return this.cmd('getime','',callback);
	},
	getTimed: function(callback){
		return this.cmd('getimed','',callback);
	},
	setTimed: function(n){
		this.timed = n;
	},
	setTime : function(n){
		this.time = n;
	},
	volume: function(num){
		if(typeof num !='number') num = 50;
		if(num < 0) num = 0;
		if(num > 100) num = 100;
		this.cmd('v'+num);
	},
	start: function(num){
		if(typeof num !='number') num = 50;
		if(num < 0) num = 0;
		if(num > 100) num = 100;
		this.cmd('start'+num);
	},
	startTimer: function(callback,period){
		eval(callback);
		var parent = this;
		this.timer = setTimeout(function(){
			parent.startTimer(callback,period);
		},period);
	},
	stopTime: function() {
		clearTimeout(this.timer);
	}
});
