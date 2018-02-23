(function(){


var $body = document.body;
var $weatherForeground = document.getElementById("weather-foreground");
var $weatherBackground = document.getElementById("weather-background");
var $snowAnimation = document.getElementById("snow-animation");
var $scene = document.getElementById("scene");

var fullSupport = (function(){
  var flex = ["flex", "webkitFlex", "msFlex"];

  for (var i = 0, len = flex.length; i < len; i++) {
    if(flex[i] in $body.style){
      return true;
    }
  }
  return false;

}());

var windowResizeTimeout;
var windowResizeTimeout2;
var fontSize = parseFloat(window.getComputedStyle($body).fontSize.replace("px", ""));
var sceneWidthEM = 335;
var sceneHeightEM = $scene.offsetHeight / fontSize;
var animtionTemplate = $snowAnimation.innerHTML;
var $style = document.createElement("STYLE");
var animation = animtionTemplate.replace(/PLACEHOLDER/g, sceneHeightEM + "em");
var $error;



var backgroundHTML = "";
var foregroundHTML = "";
var htmlArray = [];
var snowFlakeDensity = 0.003; // not sure it is density but yolo
var snowFlakesVariations = 4; // class is weather__snow--style-n
var maxDelay = 10;
var minSpeed = 7;
var maxSpeed = 14;
var snowFlakesCount = Math.ceil(sceneWidthEM * sceneHeightEM * snowFlakeDensity);



for (var i = 0; i < snowFlakesCount; i++) {

  var span = "";
  var variation = "weather__snow--style-" + Math.ceil(Math.random() * 4);
  var position = Math.floor(Math.random() * sceneWidthEM)
  var delay = Math.random() * maxDelay;
  var speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;

  span = "<span class='weather__snow " + variation +"' style='" + "animation-duration:" + speed + "s;"   +"animation-delay:" + delay + "s;" + "left:" + position + "em;" +"'></span>";
  htmlArray.push(span);
}

for (var i = 0, len = htmlArray.length / 50; i < len; i++) {
  foregroundHTML += htmlArray.splice(Math.ceil(Math.random() * htmlArray.length),1);
}

backgroundHTML = htmlArray.join("");



$style.innerHTML = animation;
$body.appendChild($style);
$weatherForeground.innerHTML = foregroundHTML;
$weatherBackground.innerHTML = backgroundHTML;

if(!fullSupport){
  $error = document.createElement("DIV");
  $error.id = "error";
  $error.innerHTML = "Your browser may not support all the features to display this page properly. Please use a more up to date browser."
  $body.appendChild($error);
}

function windowResize() {
  clearTimeout(windowResizeTimeout);
  clearTimeout(windowResizeTimeout2);
  windowResizeTimeout = setTimeout(function(){
    var newFontSize = parseFloat(window.getComputedStyle($body).fontSize.replace("px", ""));
    if(newFontSize != fontSize){
      fontSize = newFontSize;
      $body.classList.add("refreshAnimation");
      windowResizeTimeout2 = setTimeout(function () {
        $body.classList.remove("refreshAnimation");
      }, 50);
    }
  },100);


}


window.addEventListener("resize", windowResize);


}());
