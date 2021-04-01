/* ------------------------------------------------
                   SETTINGS
                   
-------------------------------------------------*/
var opensettings = document.querySelector(".open-settings");
var closesettings = document.querySelector(".close-settings");
var downloadsettings = document.querySelector(".download-settings");
var downloadsection = document.querySelector(".download-section");

opensettings.addEventListener('click', (ev) => {
    downloadsettings.style.display = "flex";
    downloadsection.style.visibility = "hidden";
});

closesettings.addEventListener('click', (ev) => {
    downloadsettings.style.display = "none";
    downloadsection.style.visibility = "";
});


/* ------------------------------------------------
                   DOWNLOAD
                   BUTTONS
-------------------------------------------------*/
var downloadvideo = document.querySelector(".video");
var downloadplaylist = document.querySelector(".playlist");

downloadvideo.addEventListener('click', (ev) => {
    downloadvideo.className += " click-animation";
    setTimeout(() => {
        downloadvideo.className = downloadvideo.className.replace(" click-animation", "");
    }, 250);
});

downloadplaylist.addEventListener('click', (ev) => {
    downloadplaylist.className += " click-animation";
    setTimeout(() => {
        downloadplaylist.className = downloadplaylist.className.replace(" click-animation", "");
    }, 250);
});


/* ------------------------------------------------
                   TABS
                   
-------------------------------------------------*/
var downloadqueque = document.querySelector(".downloadqueque");
var directorylisting = document.querySelector(".directory-listing");

//list
var tabdownloadqueque = document.querySelector(".tab-downloadqueque");
var tabdirectorylisting = document.querySelector(".tab-directory-listing");
var toggle = true;

tabdownloadqueque.addEventListener('click', (ev) => {
    if(!toggle){
        tabdirectorylisting.className = tabdirectorylisting.className.replace(" active-tab", "");
        tabdownloadqueque.className = tabdownloadqueque.className += " active-tab";
        downloadqueque.style.display = "flex";
        directorylisting.style.display = "none"; 
        toggle = true;
    } else {
    }
});

tabdirectorylisting.addEventListener('click', (ev) => {
    if(toggle){
        tabdownloadqueque.className = tabdownloadqueque.className.replace(" active-tab", "");
        tabdirectorylisting.className = tabdirectorylisting.className += " active-tab"; 
        directorylisting.style.display = "flex";
        downloadqueque.style.display = "none";
        toggle = false;
    } else {
    }
});
