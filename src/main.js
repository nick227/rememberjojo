
	!function(e){function n(){}function t(e,n){return function(){e.apply(n,arguments)}}function o(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(e,this)}function i(e,n){for(;3===e._state;)e=e._value;return 0===e._state?void e._deferreds.push(n):(e._handled=!0,void o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null===t)return void(1===e._state?r:u)(n.promise,e._value);var o;try{o=t(e._value)}catch(i){return void u(n.promise,i)}r(n.promise,o)}))}function r(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var i=n.then;if(n instanceof o)return e._state=3,e._value=n,void f(e);if("function"==typeof i)return void s(t(i,n),e)}e._state=1,e._value=n,f(e)}catch(r){u(e,r)}}function u(e,n){e._state=2,e._value=n,f(e)}function f(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)i(e,e._deferreds[n]);e._deferreds=null}function c(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function s(e,n){var t=!1;try{e(function(e){t||(t=!0,r(n,e))},function(e){t||(t=!0,u(n,e))})}catch(o){if(t)return;t=!0,u(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var o=new this.constructor(n);return i(this,new c(e,t,o)),o},o.all=function(e){var n=Array.prototype.slice.call(e);return new o(function(e,t){function o(r,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(e){o(r,e)},t)}n[r]=u,0===--i&&e(n)}catch(c){t(c)}}if(0===n.length)return e([]);for(var i=n.length,r=0;r<n.length;r++)o(r,n[r])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(n,t){for(var o=0,i=e.length;o<i;o++)e[o].then(n,t)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},o._setImmediateFn=function(e){o._immediateFn=e},o._setUnhandledRejectionFn=function(e){o._unhandledRejectionFn=e},"undefined"!=typeof module&&module.exports?module.exports=o:e.Promise||(e.Promise=o)}(this);

/*******************************************/
var app = {
	 	start:function(){
		if (!window.Promise) {
			window.Promise = Promise;
		}
			background.preload.then(function(){
				background.start();
		  	});
			turtle.start();
	 	}
	 };
/*******************************************/
var preloader = {
	hide:function(){
		var elm = document.getElementById('preloader');
		elm.classList.add('vanish');
	}
};
/*******************************************/
var background = {
	images:['Sequence1.png','Sequence2.png','Sequence3.png','Sequence4.png','Sequence5.png','Sequence6.png','Sequence7.png','Sequence8.png','Sequence9.png','Sequence10.png','Sequence11.png','Sequence12.png','Sequence0.png'],
	path:'./images',
	timeout:3333,
	elmId:'background',
	elm:{}
};
/*******************************************/
background.preload = new Promise(function(resolve, reject){
	background.images.forEach(function(item, i){
		var imgPath = background.path + '/' + background.images[i];
		new Image().src = imgPath;
	});
	resolve();
});
/*******************************************/
background.start = function(){

	var len = this.images.length;
	var startPoint = Math.floor(Math.random() * len);
	var currentIndex = null;
	this.elm = document.getElementById(background.elmId);
	preloader.hide();
	background.next(startPoint);
	var timer = setInterval(function(){
		currentIndex = typeof currentIndex === 'number' ? currentIndex < len-1 ? parseInt(currentIndex+1) : 0 : startPoint;
		background.next(currentIndex);
	}, this.timeout);
};
/*******************************************/
background.next = function(index){
	/* add new bg img */
	var imgPath = this.path + '/' + this.images[index];
	this.elm.style.backgroundImage = "url(" + imgPath + ")";
	/* add new tmp img */
	var tempImg = document.createElement('img');
	var prevImg = index > 0 ? index-1 : this.images.length-1;
	tempImg.src = this.path + '/' + this.images[prevImg];
	this.elm.appendChild(tempImg);
	tempImg.classList.add('vanish');
	/* clear current tmp img */
	var currentImg = this.elm.getElementsByTagName('img');
	if(typeof currentImg[0] === 'object'){
		setTimeout(function(){currentImg[0].remove();}, background.timeout*10);
	}
}
/*******************************************/
var turtle = {
	imgPath:'./images/jojo-on-turtle.png',
	img2Path:'./images/jojo-on-turtle-blink.png',
	elmId:'turtle',
	timeout:5000
};
turtle.start = function(){
	this.elm = document.getElementById(turtle.elmId);
	var newImg = document.createElement('img');
	var started = false;
	newImg.addEventListener('load', function(){
		if(!started){
			preloader.hide();
			turtle.blink();
			turtle.reposition();
			started = true;
		}
	});
	var imgPath = this.imgPath;
	new Image().src = imgPath;
	var imgPath2 = this.img2Path;
	new Image().src = imgPath2;
	var elm = this.elm;
	newImg.src = this.imgPath;
	elm.appendChild(newImg);
}
/*******************************************/
turtle.blink = function(){
	var elm = this.elm;
	var timer = setInterval(blink, turtle.timeout);
	var img = elm.getElementsByTagName('img')[0];
	function blink(){
		img.src = turtle.img2Path;
		setTimeout(function(){
			img.src = turtle.imgPath
		}, turtle.timeout/10)
	}
}
turtle.reposition = function(){
		var elm = this.elm;
		function move(){
			var screenWidth = document.documentElement.clientWidth,
				screenHeight = document.documentElement.clientHeight,
				xmax = screenWidth / 2,
				xmin = 0 - xmax
				ymax = screenHeight / 2,
				ymin = 0 - ymax;
			var marginLeft = Math.floor(Math.random() * (xmax - xmin)) + xmin;
			var marginTop = Math.floor(Math.random() * (ymax - ymin)) + ymin;
			elm.style.marginLeft = marginLeft+'px';
			elm.style.marginTop = marginTop+'px';
		}
	setInterval(move, Math.floor(Math.random() * 20000) + 2000);
}
/*******************************************/
window.addEventListener("load", app.start, false);