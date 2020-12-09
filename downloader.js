const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require('ffmpeg');

//dumb
const textinput = document.getElementById("urlinput");
const videoformat = document.getElementById("videofselect");
const audioformat = document.getElementById("audiofselect");
const button = document.getElementsByName("button");

//const
const path = "";

//var
var itagvideo = null;
var itagaudio = null;


//functions

//filter
function filter_vid_aud_both(formats){
  audiof = formats.filter(hasaudio);
  videof = formats.filter(hasvideo);
  both = audiof.filter(function(format){
    return videof.includes(format);
  });
  return [videof, audiof, both];
}


//one liner formats.filter(format => format.attribute =/</> wish);
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
    formats = filter_vid_aud_both(info.formats);
    //filter for displaying; video
    videoquali = formats[0].map(vheight => vheight.height);
    vquali_unique = videoquali.filter((value, index, self) => self.indexOf(value) === index);
    vquali_unique.sort((a, b) => {
      return b-a;
    });
    //audio
    audioquali = formats[1].map(bitrate => bitrate.audioBitrate);
    aquali_unique = audioquali.filter((value, index, self) => self.indexOf(value) === index);
    aquali_unique.sort((a, b) => {
      return b-a;
    });
    //display video
    for (let i = 0; i < vquali_unique.length; i++) {
      makeoption(videoformat, vquali_unique[i]);
    }
    //display audio
    for (let i = 0; i < aquali_unique.length; i++) {
      makeoption(audioformat, aquali_unique[i]);
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
