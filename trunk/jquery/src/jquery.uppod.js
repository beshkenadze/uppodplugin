/**
 * @author <a href="mailto:beshkenadze@gmail.com">Александр Бешкенадзе</a>
 * @description jquery.uppod - jQuery плагин для работы с Uppod Player
 * @version $Id: $Rev$ $Date$ $Author$
 */
/**
    Старт Gears
    @constructor
    @returns {Boolean}
    @example
    var uppod = $.uppod('uppod-player');
*/ 
jQuery.uppod = function(container,options){
    var vars = {
		debug:false,
		player_id : 'uppod_player'+Math.random(),
		width:500,
		height:375,
		params: {
			'movie':'http://video-2-4.rutube.ru/v1-5/s1-28/297ec50dc34e9a7a586e2e9344faca9b-1224670229.iflv?e=1237968727&s=d49fc8c2be84bbeb35f0c8aa331b961f'
		},
		vars : {				
			
		}
    };
    var opts = $.extend(vars, options);
	vars.container = container
    jQuery.uppod.vars = vars;
	
	if(vars.debug){
		if($('#uppod-debug').length == 0){
			$('body').append('<div id="uppod-debug">');
			$('#uppod-debug').addClass('debug');
		}
	}
    $.uppod.init();
};
/**
    Инициация плеера
    @constructor
    @returns {Object} Объект Gears.
    @param factory {String} название фабрики.
*/ 
jQuery.uppod.init = function(){
	if($('#'+jQuery.uppod.vars.container).length==0) {
		jQuery.uppod.error('Не найден контейнер #'+jQuery.uppod.vars.container+' , аварийное завершение.');
		return;
	}
	if($('#'+jQuery.uppod.vars.player_id).length>0) {
		jQuery.uppod.error('Плеер "'+this.player_id+'" уже существует , аварийное завершение.');
		return;
	}
	$('#'+jQuery.uppod.vars.container).empty();
	$('#'+jQuery.uppod.vars.container).flash(
	        { 
			  id:jQuery.uppod.vars.player_id,
	          src: './swf/uppod.swf?' + Math.random(),
	          width: jQuery.uppod.vars.width,
	          height: jQuery.uppod.vars.height,
	          flashvars: jQuery.uppod.vars.vars
	        },
	        { version: 9 }
	);
	jQuery.uppod.player = jQuery.uppod.getMovie(jQuery.uppod.vars.player_id);
	if(jQuery.uppod.player == 'undefined') {
		jQuery.uppod.error('Не могу обратится к плееру "'+jQuery.uppod.vars.player_id+'", аварийное завершение.');
		return;
	}
	jQuery.uppod.bind();
}
jQuery.uppod.log = function(message){
	if(jQuery.uppod.vars.debug){
		if(message.length > 0) {
			var html = $('#uppod-debug').html();
			$('#uppod-debug').html(html+'<p class="log">Плеер '+jQuery.uppod.vars.player_id+' сообщает: '+message);
		}
	}
}
jQuery.uppod.error = function(message){
	if(jQuery.uppod.vars.debug){
		if(message.length > 0) {
			var html = $('#uppod-debug').html();
			$('#uppod-debug').html(html+'<p class="error">Плеер '+jQuery.uppod.vars.player_id+' сообщает: '+message);
		}
	}
}
jQuery.uppod.bind = function(){
	$('.uppod-command-'+jQuery.uppod.vars.player_id).bind('click',function(){
		var coms = $(this).attr('rel').split(' ');
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
		case 'getv':
		  jQuery.uppod.cmd(command,'',jQuery.uppod.player);
		  break;
		case 'volume':
		  jQuery.uppod.cmd('v',value,jQuery.uppod.player);
			break;
		case 'start':
		  jQuery.uppod.cmd('start',value,jQuery.uppod.player);
			break;
		}
		return false;
	});
}

jQuery.uppod.getMovie= function(movieName) {
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return window[movieName];
	} else {
		return document[movieName];
	}
}
jQuery.uppod.cmd= function(command,value,player) {
	if(!value) {
		var value = '';
	}
	if(!player){
		var player = jQuery.uppod.player;
	}
	jQuery.uppod.log('посылаю комманду '+command+value);
	player.sendToUppod(command+value);
}
jQuery.uppod.play = function(){
	jQuery.uppod.cmd('play');
}
jQuery.uppod.pause = function(){
	jQuery.uppod.cmd('pause');
}
jQuery.uppod.toggle = function(){
	jQuery.uppod.cmd('toggle');
}
jQuery.uppod.stop = function(){
	jQuery.uppod.cmd('stop');
}
jQuery.uppod.getpl = function(){
	jQuery.uppod.cmd('getpl');
}
jQuery.uppod.getv = function(){
	jQuery.uppod.cmd('getv');
}
jQuery.uppod.volume = function(num){
	if(typeof num !='number') num = 50;
	if(num < 0) num = 0;
	if(num > 100) num = 100;
	jQuery.uppod.cmd('start'+num);
}
jQuery.uppod.start = function(num){
	if(typeof num !='number') num = 50;
	if(num < 0) num = 0;
	if(num > 100) num = 100;
	jQuery.uppod.cmd('v'+num);
}