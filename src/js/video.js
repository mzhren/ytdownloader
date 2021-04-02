/*
creates an object which downloads the video and destroys itself at the end

* @params
-url
-options
    audioquality: int(audiobitrate), true or false
    videoquality: int(height), true or false
*/

/*
! requires this packages
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const ytdl = require("ytdl-core");
*/

class Video {
    constructor(url, options, path){
        this.url = url;
        this.path = path;
        this.options = options;

        //get info and download
        ytdl.getInfo(url).then((info) => {
            //get general information
            this.title = this.removeChars(info.videoDetails.title, String.raw`<>:"/\|?*`);
            this.thumbnails = info.videoDetails.thumbnails;
            this.channelname = info.videoDetails.author.name;
            
            this.downloaditem = new DownloadItem(this.thumbnails[this.thumbnails.length - 1].url, this.title);

            /* ------------------------------------------------
                               FILTER FORMATS
            -------------------------------------------------*/
            this.formats = info.formats;

            //! set the possible formats in the 2 arrays
            //! each with all possible audio or video formats

            //audio
            if(typeof this.options.audioquality == "number"){
                //search for specific bitrate
                this.audioformats = this.formats.filter((format) => {
                    return format.audioBitrate == this.options.audioquality;
                });
                if(this.audioformats.length == 0){
                    this.audioformats = this.formats.filter((format) => {
                        return format.hasAudio;
                    });
                }
            } else {
                if(this.options.audioquality){
                    //return any format with audio
                    this.audioformats = this.formats.filter((format) => {
                        return format.hasAudio;
                    });
                } else {
                    //no audio selected
                    this.audioformats = null;
                }
            }

            //video
            if(typeof this.options.videoquality == "number"){
                //search for specific video height
                this.videoformats = this.formats.filter((format) => {
                    return format.height == this.options.videoquality;
                });
                if(this.videoformats.length == 0){
                    this.videoformats = this.formats.filter((format) => {
                        return format.hasVideo;
                    });
                }
            } else {
                if(this.options.videoquality){
                    //return any format with video
                    this.videoformats = this.formats.filter((format) => {
                        return format.hasVideo;
                    });
                } else {
                    //mp video selected
                    this.videoformats = null;
                }
            }


            //find the itags you want to donwload and for earch itag the video
            //gets downloaded
            this.downloadformats = [];
            this.videooutput = true;
            this.audiooutput = true;

            if(this.options.audioquality && this.options.videoquality){//both 
                //if possible format that matches height and audioBitrate,
                //elsewise download both seperately and merge with ffmpeg
                this.audiobitrates = this.audioformats.map( format => format.audioBitrate);
                this.videoheights = this.videoformats.map( format  => format.height );  
                let formats = this.formats.filter( 
                    format => 
                    this.audiobitrates.includes(format.audioBitrate) && 
                    this.videoheights.includes(format.height)
                )

                if(formats.length > 0){//found matching format
                    this.downloadformats.push(formats[0]);
                } else {//download both and merge
                    this.downloadformats.push(this.audioformats[0]);
                    this.downloadformats.push(this.videoformats[0]);               
                }
                        
            } else if(this.options.audioquality ? !this.options.videoquality : this.options.videoquality) {//audio xor video
                if(this.options.audioquality){//audio
                    this.downloadformats.push(this.audioformats[0]);
                    this.videooutput = false;
                } else {//video
                    this.downloadformats.push(this.videoformats[0]);
                    this.audiooutput = false;
                }
            
            } else {//both arrays are null
                this.finished = true;
            }   

             /* ------------------------------------------------
                               DOWNLOAD
            -------------------------------------------------*/
            //download by itag
            this.downloads = [];
            this.downloadsfinished = 0;
            this.downloadformats.forEach((format, index) => {
                this.downloads.push(this.path + this.title + index.toString() + "." + format.container);
                ytdl.downloadFromInfo(info, { 
                    quality: format.itag
                }).pipe(fs.createWriteStream(this.path + this.title + index.toString() + "." + format.container))
                .on('finish', () => {
                    this.downloadsfinished += 1;
                    if(this.downloadsfinished == this.downloadformats.length){
                        this.downloaditem.changeProgress("Merging...");
                        if(this.downloads.length == 2){
                            let splittedfilename = this.downloads[0].split(".");
                            this.output = this.title + "." + splittedfilename[splittedfilename.length - 1];
                            this.merge = new ffmpeg();
                            this.merge
                            .input(this.downloads[0])
                            .input(this.downloads[1])
                            .on('end', () => {
                                this.downloads.forEach(file => {
                                    fs.unlink(file, () => {});
                                });
                                document.getElementById(this.title).remove();
                                this.finished = true;
                            })
                            .output(this.path + this.output)
                            .run();
                        
                        } else if(!this.videooutput || !this.audiooutput){//one of them is false
                            let splittedfilename = this.downloads[0].split(".");
                            if(!this.videooutput){
                                splittedfilename.splice(splittedfilename.length - 1, 1, "mp3");
                            }
                            this.output = this.title + "." + splittedfilename[splittedfilename.length - 1];
                            this.merge = new ffmpeg();
                            this.merge.input(this.downloads[0])
                            .on('end', () => {
                                this.downloads.forEach(file => {
                                    fs.unlink(file, () => {});
                                });
                                document.getElementById(this.title).remove();
                                this.finished = true;
                            });
                            if(!this.videooutput){
                                this.merge.noVideo();
                            } else {
                                this.merge.noAudio();
                            }
                            this.merge.output(this.path + this.output)
                            .run();
                        } else {//format matches the qualities without merging
                            document.getElementById(this.title).remove();
                            this.finished = true;
                        }                
                    }
                });
            });
        });
    }

    removeChars(text, chars){
        for (let i = 0; i < text.length; i++) {
            for(let j = 0; j < chars.length; j++){
                text = text.replace(chars[j], "");
            }
        }
        return text;
    }
}
