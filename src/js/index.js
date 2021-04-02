/* ------------------------------------------------
                   REQUIREMENTS
-------------------------------------------------*/

const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const ytdl = require("ytdl-core");
const os = require('os');
const path = require("path");

/*
! variables from menu.js
-downloadvideo
-downloadplaylist
*/
var songs = document.querySelector(".songs");
var dropinput = document.querySelector(".input");
var webview = document.querySelector(".webview");
var videoquality = document.querySelector(".height");
var audioquality = document.querySelector(".bitrate");

var videodownloads = [];

//cleanup
var videocleanup = setInterval(() => {
    videodownloads.forEach( (video, index) => {
        if(video.finished){
            videodownloads.splice(index, 1);
        }
    });
}, 250);


//set path
var directory = path.join(os.homedir(), "YtDownloads");
if(process.platform == "win32"){
    directory += "\\";
} else {
    directory += "/";
}

//check folder existance
fs.stat(directory, (err, stats) => {
    if(err){
        fs.mkdir(directory, (err) => {
        });
    } else {
    }
})



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
        directory))
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
        directory))
    }
});

/* ------------------------------------------------
                   DIRECTORY
                   LISTING
-------------------------------------------------*/

var filecontainer = document.querySelector(".files");
var fileslastread = [];

var updatedir = setInterval(() => {
    let path = directory == "" ? __dirname : directory; 
    fs.readdir(path, (err, files) => {
        let newfiles = files.filter(file => !fileslastread.includes(file));
        let removedfiles = fileslastread.filter(file => !files.includes(file));
        
        newfiles.forEach(file => {
            let filep = document.createElement('p');
            filep.id = file;
            filep.className = "filep";
            let displayname = file.split(".");
            displayname.splice(displayname.length - 1, 1);
            displayname = displayname.join("");//join elements together without ending
            filep.innerHTML = displayname;
            filecontainer.appendChild(filep);
        });

        removedfiles.forEach(file => {
            document.getElementById(file).remove();
        });

        fileslastread = files;
    });
}, 1000);

