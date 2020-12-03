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




function downloadByItag(url, itag, container, filename){
  try {
    ytdl(url, { quality: itag })
    .pipe(fs.createWriteStream(path + filename + "." + container));
  } catch (error) {
    console.log(error);
  }
}

info = getVideoInfo("https://www.youtube.com/watch?v=_UX0kjOLQXs");
console.log(impinfo);
