/* ------------------------------------------------
                   REQUIREMENTS
-------------------------------------------------*/

const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const ytdl = require("ytdl-core");

/*
! variables from menu.js
-downloadvideo
-downloadplaylist
*/
var songs = document.querySelector(".songs");
var files = document.querySelector(".files");
var dropinput = document.querySelector(".input");
var webview = document.querySelector(".webview");
var videoquality = document.querySelector(".height");
var audioquality = document.querySelector(".bitrate");

var videodownloads = [];

/* ------------------------------------------------
                   START
                   DOWNLOAD
-------------------------------------------------*/

downloadvideo.addEventListener('click', (event) => {
    let url = webview.getURL();
    
    //prepare selection inputs
    let audioquali = audioquality.value;
    audioquali = audioquali == "true" ? true : audioquali; 
    audioquali = audioquali == "false" ? false : audioquali; 
    let videoquali = videoquality.value;
    videoquali = videoquali == "true" ? true : videoquali; 
    videoquali = videoquali == "false" ? false : videoquali;

    if(!videodownloads.map(video => video.url).includes(url)){
        videodownloads.push( new Video(url, {
            audioquality: audioquali,
            videoquality: videoquali
        },
        ""))
    }
});

dropinput.addEventListener('input', (event) => {
    let url = dropinput.value;
    dropinput.value = "";
    
    //prepare selection inputs
    let audioquali = audioquality.value;
    audioquali = audioquali == "true" ? true : audioquali; 
    audioquali = audioquali == "false" ? false : audioquali; 
    let videoquali = videoquality.value;
    videoquali = videoquali == "true" ? true : videoquali; 
    videoquali = videoquali == "false" ? false : videoquali;

    if( !(videodownloads.map(video => video.url).includes(url)) && ytdl.validateURL(url)){
        videodownloads.push( new Video(url, {
            audioquality: audioquali,
            videoquality: videoquali
        },
        ""))
    }
});

// make directory listing
