/**
 * @author Александр Бешкенадзе beshkenadze@gmail.com
 * @description Uppod - Mootools плагин для работы с Uppod Player
 * Released under the GNU GPLv2 Licenses.
 * @version 0.8
 */
var Uppod = new Class({
			Implements : [Options],
			options : { // опции по умолчанию
				debug:false,
				player_id : 'uppod_player_'+Math.random(),
				width:500,
				src: 'swf/uppod.swf',
				height:375,
				params: {
					allowFullScreen: true
				},
				vars : {
					uid:false
				}
			},
			initialize : function(container,options) {
				this.setOptions(options);
				this.player_id = this.options.player_id;
				this.container = container;
				this.width = this.options.width;
				this.height = this.options.height;
				this.params = this.options.params;
				this.vars = this.options.vars;
				this.vars.uid = this.player_id;
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
		this.obj = new Swiff(this.src + '?' + Math.random(), {
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
			if(message && message.length > 0) {
				if(console){
					console.info(message);
				}else{
					if($$('#uppod-debug p').length > 10) $('uppod-debug').empty();
					var p = new Element('p',{'class':'log','html':'Плеер '+this.player_id+' сообщает: '+message});
					var log = $('uppod-debug');
					p.inject(log);
				}
			}
		}
	},
	error:function(message){
		if(this.options.debug){
			if(message && message.length > 0) {
				if(console) {
					console.error(message);
				}else{
					var p = new Element('p',{'class':'error','html':message});
					var log = $('uppod-debug');
					var html = log.get('html');
					p.inject(log);
				}
			}
		}
	},
	bind:function(){
		var player = this.player;
		var parent = this;

		$$('.'+this.player_id+'.command').addEvent('click',function(e){
			console.log($(this));
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
		var cmd = command+(value?':'+value:'');
		this.log('посылаю комманду '+cmd);
		if((typeof this.player.sendToUppod != 'undefined') && typeof this.player != 'undefined') {
			return this.player.sendToUppod(cmd,(callback?callback:''));
		}else{
			this.error('Не могу выполнить комманду: '+command+' к плееру "'+this.player_id+'", аварийное завершение.');
		}
	},
	file: function(file_path) {
		this.cmd('file');
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
	seek: function(pos){
        return this.cmd('seek',pos);
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
	getStatus: function(callback){
        return this.cmd('getstatus','',callback);
    },
    getFull: function(callback){
        return this.cmd('getfull','',callback);
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
	setClosedText: function(message){
		return this.cmd('text',message);
	},
	setText: function(message){
        return this.cmd('text2',message);
    },
    setPl: function(playlists){
        return this.cmd('pl',JSON.encode(playlists));
    },
    removeText: function(){
        return this.cmd('xtext');
    },
    removePl: function(){
        return this.cmd('xpl');
    },
    random: function(){
        return this.cmd('random');
    },
    fullscreen: function(){
        return this.cmd('fullscreen');
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
