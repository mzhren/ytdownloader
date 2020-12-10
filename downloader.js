//requirements
const fs = require("fs");
const ytdl = require("ytdl-core");
//const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
//ffmpeg.setFfmpegPath(ffmpegPath);
//var ffmpeg = require('fluent-ffmpeg');
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
function downloadvidaud(path, name, itagvideo, containerv, itagaudio, containera){// "", title, 18, mp4, 18, mp4,
  if(ytdl.validateURL(textinput.value)){
    if(itagvideo != null){
      ytdl(textinput.value, { quality: itagvideo})
      .pipe(fs.createWriteStream(path + name + "v" + "." + containerv));
    }
    if(itagaudio != null){
      ytdl(textinput.value, { quality: itagaudio})
      .pipe(fs.createWriteStream(path + name + "a" + "." + containera));
    }
    return [path + name + "v" + "." + containerv, path + name + "a" + "." + containera];
  }
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
    //getinfo
    let info = await ytdl.getInfo(textinput.value);
    //filter
    let formatsall = filter_vid_aud_both(info.formats);
    let formats = formatsall.filter((value) => { return !(value.hasaudio && value.hasvideo)});
    //filter for displaying
    //video
    let videoquali = formats[0].map(vheight => vheight.height);
    let vquali_unique = videoquali.filter((value, index, self) => self.indexOf(value) === index);
    vquali_unique.sort((a, b) => {
      return b-a;
    });
    //audio
    let audioquali = formats[1].map(bitrate => bitrate.audioBitrate);
    let aquali_unique = audioquali.filter((value, index, self) => self.indexOf(value) === index);
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
    inputdata = [info, formats, videoquali, vquali_unique, audioquali, aquali_unique];
  } else {
    //remove all childs of the selects and add the None option back
    //because its not a YT link anymore
    videochildren = videoformat.children;
    audiochildren = audioformat.children;
    for (let i = 0; i < videochildren.length; i++) {
      videochildren[i].remove();
    }
    for (let i = 0; i < audiochildren.length; i++) {
      audiochildren[i].remove();
    }
    makeoption(videoformat, "None");
    makeoption(audioformat, "None");
  }
});

button[0].addEventListener("click", async() => {
  //download audio and video depending on the selections; defaults for None
  //writes 2 files
  if( (videoformat.value == "None") && (audioformat.value == "None")){
    var filepaths = await downloadvidaud(path, inputdata[0].videoDetails.title, 136, "mp4", 18, "mp4");
  } else if( ((videoformat.value == "None") && (audioformat.value != "None"))){
    var aformat = inputdata[1][1].filter(value => value.audioBitrate == audioformat.value)[0];
    filepaths = await downloadvidaud(path, inputdata[0].videoDetails.title, null, null, aformat.itag, aformat.container);
  } else if( ((videoformat.value != "None") && (audioformat.value == "None"))){
    var vformat = inputdata[1][0].filter(value => value.height == videoformat.value)[0]
    filepaths = await downloadvidaud(path, inputdata[0].videoDetails.title, vformat.itag, vformat.container, null, null);
  } else {
    var vformat = inputdata[1][0].filter(value => value.height == videoformat.value)[0];
    var aformat = inputdata[1][1].filter(value => value.audioBitrate == audioformat.value)[0];
    var filepaths = await downloadvidaud(path, inputdata[0].videoDetails.title, vformat.itag, vformat.container, aformat.itag, aformat.container);
  }
  console.log(filepaths);
  //merge with ffmpeg
  try {
    //create and input vid/aud if downloaded
    var video = ffmpeg();
    if(fs.stat(filepaths[0], (err, stats) => { return stats.isFile(); })){
      console.log(filepaths[0]);
      video.input(filepaths[0]);
    }
    if(fs.stat(filepaths[1], (err, stats) => { return stats.isFile(); })){
      video.input(filepaths[1]);
    }
    video.output(fs.createWriteStream(inputdata[0].videoDetails.title + ".mp4"));
    video.run();
  } catch (e) {
    console.log(e);
  }
});
