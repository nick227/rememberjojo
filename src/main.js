
/*******************************************/
var app = {
	 	start:function(){
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
	preloader.hide();
	resolve();
});
/*******************************************/
background.start = function(){

	var len = this.images.length;
	var startPoint = Math.floor(Math.random() * len);
	var currentIndex = null;
	this.elm = document.getElementById(background.elmId);
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
			started = true;
			preloader.hide();
			turtle.blink();
			turtle.reposition();
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