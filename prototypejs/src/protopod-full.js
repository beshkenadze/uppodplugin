/**
 * @author Александр Бешкенадзе beshkenadze@gmail.com
 * @description Uppod - PrototypeJS плагин для работы с Uppod Player Released
 *              under the GNU GPLv2 Licenses.
 * @version 0.8
 */
var Uppod = Class.create();
Uppod.prototype = {
	options : { // опции по умолчанию
		debug : false,
		player_id : 'uppod_player_' + Math.random(),
		width : 500,
		src : 'swf/uppod.swf',
		height : 375,
		params : {
			allowFullScreen : true
		},
		vars : {
			uid : false
		}
	},
	toElement: function(){
        return this.object;
    },

	initialize : function(container, options) {
		this.setOptions(options);
        options = this.options;
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
		if (this.options.debug) {
			if ($('uppod-debug')) {
				var log = $('uppod-debug');
			} else {
				var log = new Element('div', {
							'id' : 'uppod-debug',
							'class' : 'debug'
						});
				document.body.insert(log);
			}
		}
		this.init();
	},
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
        if(typeof this.player == 'undefined') {
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
    },
    getMovie: function (movieName) {
        if (Browser.browser == 'Explorer') {
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
    },
    setOptions: function(options) {
      this.options = Object.extend(this.options, options);
    },
};
/*
Script: Swiff.js
	Wrapper for embedding SWF movies. Supports (and fixes) External Interface Communication.

License:
	MIT-style license.

Credits:
	Flash detection & Internet Explorer + Flash Player 9 fix inspired by SWFObject.
*/

var Swiff = Class.create({

	options: {
		id: null,
		height: 1,
		width: 1,
		container: null,
		properties: {},
		params: {
			quality: 'high',
			allowScriptAccess: 'always',
			wMode: 'transparent',
			swLiveConnect: true
		},
		callBacks: {},
		vars: {}
	},

	toElement: function(){
		return this.object;
	},

	initialize: function(path, options){
		this.instance = 'Swiff_' + new Date().getTime();

		this.setOptions(options);
		options = this.options;
		var id = this.id = options.id || this.instance;
		var container = $(options.container);

		Swiff.CallBacks[this.instance] = {};

		var params = options.params, vars = options.vars, callBacks = options.callBacks;
		var properties = Object.extend({height: options.height, width: options.width}, options.properties);

		var self = this;

		for (var callBack in callBacks){
			Swiff.CallBacks[this.instance][callBack] = (function(option){
				return function(){
					return option.apply(self.object, arguments);
				};
			})(callBacks[callBack]);
			vars[callBack] = 'Swiff.CallBacks.' + this.instance + '.' + callBack;
		}

		params.flashVars = Hash.toQueryString(vars);
		if (Prototype.Browser.IE){
			properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
			params.movie = path;
		} else {
			properties.type = 'application/x-shockwave-flash';
			properties.data = path;
		}
		var build = '<object id="' + id + '"';
		for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
		build += '>';
		for (var param in params){
			if (params[param]) build += '<param name="' + param + '" value="' + params[param] + '" />';
		}
		build += '</object>';
		this.object =  ((container) ? container.update() : new Element('div')).update(build).firstChild;
	},
	
	setOptions: function(options) {
	  this.options = Object.extend(this.options, options);
	},

	replaces: function(element){
		element = $(element, true);
		element.parentNode.replaceChild(this.toElement(), element);
		return this;
	},

	inject: function(element){
		$(element, true).appendChild(this.toElement());
		return this;
	},

	remote: function(){
		return Swiff.remote.apply(Swiff, [this.toElement()].extend(arguments));
	}

});

Swiff.CallBacks = {};

Swiff.remote = function(obj, fn){
	var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
	return eval(rs);
};
var Browser = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {   string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {       // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        {       // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
               string: navigator.userAgent,
               subString: "iPhone",
               identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]

};
Browser.init();