!function e(n,r,t){function o(u,s){if(!r[u]){if(!n[u]){var a="function"==typeof require&&require;if(!s&&a)return a(u,!0);if(i)return i(u,!0);var c=new Error("Cannot find module '"+u+"'");throw c.code="MODULE_NOT_FOUND",c}var f=r[u]={exports:{}};n[u][0].call(f.exports,function(e){var r=n[u][1][e];return o(r?r:e)},f,f.exports,e,n,r,t)}return r[u].exports}for(var i="function"==typeof require&&require,u=0;u<t.length;u++)o(t[u]);return o}({1:[function(e,n,r){e("./mobileMenu.js")},{"./mobileMenu.js":2}],2:[function(e,n,r){n.exports=function(){function e(){t?(t=!1,r.classList.remove("mobile-menu-open")):(t=!0,r.classList.add("mobile-menu-open"))}var n=document.getElementsByClassName("header__mobile-trigger")[0],r=(document.getElementsByClassName("header__nav")[0],document.body),t=!1;n.addEventListener("click",e)}()},{}]},{},[1]);
