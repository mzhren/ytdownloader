const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require('ffmpeg');
const path = "";

//dumb
const textinput = document.getElementById("urlinput");
const videoformat = document.getElementById("videofselect");
const audioformat = document.getElementById("audiofselect");
const button = document.getElementsByName("button");

//var
var itagvideo = null;
var itagaudio = null;

//ytdl("https://www.youtube.com/watch?v=_UX0kjOLQXs", { filter: "videoonly", quality: "highest" })
//.pipe(fs.createWriteStream("video.mp4"));

//test url "https://www.youtube.com/watch?v=_UX0kjOLQXs"

//functions

//filter
function filterformats(formats){
  audiof = formats.filter(hasaudio);
  videof = formats.filter(hasvideo);
  both = audiof.filter(format => format in videof);
  return [videof, audiof, both];
}

//filter functions
function hasaudio(format){
  if(format.audioBitrate != null){//a string, not null
    return true;
  }
}

function hasvideo(format){
  if(format.height != null){
    return true;
  }
}

//download
function downloadvidaud(itagvideo, itagaudio, path, name, container){
  if(ytdl.validateURL(textinput.value)){
    if(itagvideo != null){
      ytdl(textinput.value, { quality: itagvideo})
      .pipe(fs.createWriteStream(path + name + containerv));
    }
    if(itagaudio != null){
      ytdl(textinput.value, { quality: itagaudio})
      .pipe(fs.createWriteStream(path + name + containera));
    }
  }
  return true;
}

//GUI
function makeoption(parent, value){
  newoption = document.createElement("option");
  newoption.value = value;
  newoption.innerHTML = value;
  parent.appendChild(newoption);
}


//event listener
textinput.addEventListener("input", async() => {
  if(ytdl.validateURL(textinput.value)){
    let info = await ytdl.getInfo(textinput.value);
    //filter
    formats = filterformats(info.formats);
    //add to array and display
    //videooqualis
    videooquali = [];
    for (let i = 0; i < formats[0].length; i++) {
      videoquali.push(formats[0][i].height);
      if(!(formats[0][i].height in videoquali)){
        makeoption(videoformat, formats[0][i].height);
      }
    }
    //audioqualis
    audioquali = [];
    for (let i = 0; i < formats[1].length; i++) {
      audioquali.push(formats[1][i].audioBitrate);
      if(!(formats[1][i].audioBitrate in audioquali)){
        makeoption(audioformat, formats[1][i].audioBitrate);
      }
    }
  } else {
    //remove all childs of the selects and add the None option back
  }
});

button[0].addEventListener("click", async() => {
  await downloadvidaud();
  if((itagvideo != null) && (itagaudio != null)){
    //merge
  }
});
