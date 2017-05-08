if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
/**
  * You may use this code for free on any web page provided that 
  * these comment lines and the following credit remain in the code.
  * Cross Browser Fireworks from http://www.javascript-fx.com
  */
/*************************************************/
if(!window.JSFX) JSFX=new Object();

if(!JSFX.createLayer)
{/*** Include Library Code ***/

var ns4 = document.layers;
var ie4 = document.all;
JSFX.objNo=0;

JSFX.getObjId = function(){return "JSFX_obj" + JSFX.objNo++;};

JSFX.createLayer = function(theHtml)
{
	var layerId = JSFX.getObjId();

	document.write(ns4 ? "<LAYER  NAME='"+layerId+"'>"+theHtml+"</LAYER>" : 
				   "<DIV id='"+layerId+"' style='position:absolute; display: none'>"+theHtml+"</DIV>" );

	var el = 	document.getElementById	? document.getElementById(layerId) :
			document.all 		? document.all[layerId] :
							  document.layers[layerId];

	if(ns4)
		el.style=el;

	return el;
}
JSFX.fxLayer = function(theHtml)
{
	if(theHtml == null) return;
	this.el = JSFX.createLayer(theHtml);
}
var proto = JSFX.fxLayer.prototype

proto.moveTo     = function(x,y){this.el.style.left = x+'px';this.el.style.top=y+'px';}
proto.setBgColor = function(color) { this.el.style.backgroundColor = color; } 
proto.clip       = function(x1,y1, x2,y2){ this.el.style.clip="rect("+y1+" "+x2+" "+y2+" "+x1+")"; }
if(ns4){
	proto.clip = function(x1,y1, x2,y2){
		this.el.style.clip.top	 =y1;this.el.style.clip.left	=x1;
		this.el.style.clip.bottom=y2;this.el.style.clip.right	=x2;
	}
	proto.setBgColor=function(color) { this.el.bgColor = color; }
}
if(window.opera)
	proto.setBgColor = function(color) { this.el.style.color = color==null?'transparent':color; }


gX = function() { return 677 }
gY = function() { return 347 }

/*** Example extend class ***/
JSFX.fxLayer2 = function(theHtml)
{
	this.superC = JSFX.fxLayer;
	this.superC(theHtml + "C");
}
JSFX.fxLayer2.prototype = new JSFX.fxLayer;
}/*** End Library Code ***/

/*************************************************/

/*** Class Firework extends FxLayer ***/
JSFX.Firework = function(fwImages)
{
	window[ this.id = JSFX.getObjId() ] = this;
	this.imgId = "i" + this.id;
	this.fwImages  = fwImages;
	this.numImages = fwImages.length;
	this.superC = JSFX.fxLayer;
	this.superC("<img src='"+fwImages[0].src+"' name='"+this.imgId+"'>");

	this.img = document.layers ? this.el.document.images[0] : document.images[this.imgId];
	this.step = 0;
	this.timerId = -1;
	this.x = 0;
	this.y = 0;
	this.dx = 0;
	this.dy = 0;
	this.ay = 0.2;
	this.state = "OFF";
}
JSFX.Firework.prototype = new JSFX.fxLayer;

JSFX.Firework.prototype.getMaxDy = function()
{
	var ydiff = gY() - 130;
	var dy    = 1;
	var dist  = 0;
	var ay    = this.ay;
	while(dist<ydiff)
	{
		dist += dy;
		dy+=ay;
	}
	return -dy;
}
JSFX.Firework.prototype.setFrame = function()
{
	this.img.src=this.fwImages[ this.step ].src;
}
JSFX.Firework.prototype.animate = function()
{

	if(this.state=="OFF")
	{
		
		this.step = 0;
		this.x = gX()/2-20;
		this.y = gY()-100;
		this.moveTo(this.x, this.y);
		this.setFrame();
		if(Math.random() > .95)
		{
			this.el.style.display = 'block'
			this.dy = this.getMaxDy();
			this.dx = Math.random()*-8 + 4;
			this.dy += Math.random()*3;
			this.state = "TRAVEL";
		}
	}
	else if(this.state=="TRAVEL")
	{
		this.x += this.dx;
		this.y += this.dy;
		this.dy += this.ay;
		this.moveTo(this.x,this.y);
		if(this.dy > 1)
			this.state="EXPLODE"
	}
	else if(this.state == "EXPLODE")
	{
		this.step++;
		if(this.step < this.numImages)
			this.setFrame();
		else {
			this.el.style.display = 'none'
			this.state="OFF";
		}
	}
}
/*** END Class Firework***/

/*** Class FireworkDisplay extends Object ***/
JSFX.FireworkDisplay = function(n, fwImages, numImages)
{
	window[ this.id = JSFX.getObjId() ] = this;
	this.timerId = -1;
	this.fireworks = new Array();
	this.imgArray = new Array();
	this.loadCount=0;
	this.loadImages(fwImages, numImages);

	for(var i=0 ; i<n ; i++)
		this.fireworks[this.fireworks.length] = new JSFX.Firework(this.imgArray);
}
JSFX.FireworkDisplay.prototype.loadImages = function(fwName, numImages)
{
	for(var i=0 ; i<numImages ; i++)
	{
		this.imgArray[i] = document.createElement( 'img' )
		this.imgArray[i].obj = this;
		this.imgArray[i].onload = this.imageLoaded;
		this.imgArray[i].src = fwName+"/"+i+".gif";
	}
}
JSFX.FireworkDisplay.prototype.imageLoaded = function() 
{
	this.obj.loadCount++;
}

JSFX.FireworkDisplay.prototype.animate = function()
{
	status = this.loadCount;
	if(this.loadCount < this.imgArray.length)
		return;

	for(var i=0 ; i<this.fireworks.length ; i++)
		this.fireworks[i].animate();
}
JSFX.FireworkDisplay.prototype.start = function()
{
	if(this.timerId == -1)
	{
		this.state = "OFF";
		this.timerId = setInterval("window."+this.id+".animate()", 40);
	}

}
JSFX.FireworkDisplay.prototype.stop = function()
{
	if(this.timerId != -1)
	{
		clearInterval(this.timerId);
		this.timerId = -1;
		for(var i=0 ; i<this.fireworks.length ; i++)
		{
			this.fireworks[i].moveTo(-100, -100);
			this.fireworks[i].step = 0;;
			this.fireworks[i].state = "OFF";
		}	
	}
}
/*** END Class FireworkDisplay***/

JSFX.FWStart = function()
{
	if(JSFX.FWLoad)JSFX.FWLoad();
	flier = document.getElementById('flier')
	document.getElementById( 'stop_link' ).innerHTML = 'stop'
	for( i = 0; i  < myFW.length; i++ ) {
		myFW[i].start()
	}

}

function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function stopAll(link) {
	for( i = 0; i < myFW.length; i++ ) {
		myFW[i].stop()
	}
	fw_running = false;
	link.innerHTML = 'start'
}
function startAll(link) {
	for( i = 0; i < myFW.length; i++ ) {
		myFW[i].start()
	}
	fw_running = true;
	link.innerHTML = 'stop'
}
function toggleAll(link) {
	if( fw_running ) {
		stopAll(link)
	} else  {
		startAll(link)
	}
}


fwCount = 4
myFW = []

options = [1,2,3,4,5,6,7,8,9,10,11,12,13]
selections = []

for( i = 0; i < 4; i++ ) {
	selection = getRandomInt( 0, options.length-1 )
	selections.push( options[selection] )
	options.splice( selection, 1 )
}


if( selections.indexOf(1) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw01", 21) )
if( selections.indexOf(2) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw02", 34) )
if( selections.indexOf(3) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw03", 21) )
if( selections.indexOf(4) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw04", 21) )
if( selections.indexOf(5) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw05", 21) )
if( selections.indexOf(6) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw06", 21) )
if( selections.indexOf(7) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw07", 27) )
if( selections.indexOf(8) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw08", 27) )
if( selections.indexOf(9) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw09", 34) )
if( selections.indexOf(10) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw10", 34) )
if( selections.indexOf(11) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw11", 34) )
if( selections.indexOf(12) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw12", 15) )
if( selections.indexOf(13) != -1 )
	myFW.push( new JSFX.FireworkDisplay(fwCount, "fw13", 15) )

JSFX.FWLoad=window.onload;
window.onload=JSFX.FWStart;
fw_running = true