const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require('ffmpeg');

//dumb
const textinput = document.getElementById("urlinput");
const videoformat = document.getElementById("videofselect");
const audioformat = document.getElementById("audiofselect");


//ytdl("https://www.youtube.com/watch?v=_UX0kjOLQXs", { filter: "videoonly", quality: "highest" })
//.pipe(fs.createWriteStream("video.mp4"));

//test url "https://www.youtube.com/watch?v=_UX0kjOLQXs"

//functions
function downloadByItag(url, itag, container, filename){
  try {
    ytdl(url, { quality: itag })
    .pipe(fs.createWriteStream(path + filename + "." + container));
  } catch (error) {
    console.log(error);
  }
}

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

textinput.addEventListener("input", async() => {
  if(ytdl.validateURL(textinput.value)){
    let info = await ytdl.getInfo(textinput.value);
    //selects
    console.log(info.formats);
    videoformat.setAttribute("disabled", true);
    audioformat.setAttribute("disabled", true);
    console.log(info.formats.filter(hasaudio));
  }
});
