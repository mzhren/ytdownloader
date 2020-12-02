const fs = require("fs");
const ytdl = require("ytdl-core");
const http = require('http');
const ffmpeg = require('ffmpeg');

//ytdl("https://www.youtube.com/watch?v=_UX0kjOLQXs", { filter: "videoonly", quality: "highest" })
//.pipe(fs.createWriteStream("video.mp4"));

//test url "https://www.youtube.com/watch?v=_UX0kjOLQXs"

//functions
async function getVideoInfo(url){
  let info =  await ytdl.getInfo(url);
  console.log(info);
  return info;
}


function retrieveImportantInfo(formats){
  let simpformats = [];
  for (var i = 0; i < formats.length; i++) {
    //get container and itag
    let container = formats[i]["container"];
    let itag = formats[i]["itag"];

    //retrieve video data
    if(formats[i]["hasVideo"] === true){
      let video = {};
      video["fps"] = formats[i]["fps"];
      video["qualityLabel"] = formats[i]["fps"];
    } else {
      let video = null;
    }

    //retrieve audio
    if (formats[i]["hasAudio"] === true) {
      let audio = {};
      audio["audiobitrate"] = formats[i]["audiobitrate"];
    } else {
      let audio = null;
    }
    simpformats.push({"container": container, "itag": itag, "audio": audio, "video": video});
  }
  return simpformats;
}


function downloadByItag(url, itag, container, filename){
  try {
    ytdl(url, { quality: itag })
    .pipe(fs.createWriteStream(path + filename + "." + container));
  } catch (error) {
    console.log(error);
  }
}

info = getVideoInfo("https://www.youtube.com/watch?v=_UX0kjOLQXs");
