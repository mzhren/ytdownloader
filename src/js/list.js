class DownloadItem{
    constructor(thumbnail, title){
        this.videotitle = title;
        
        //img
        this.img = document.createElement('img');
        this.img.className = "download-img";
        this.img.src = thumbnail;
        
        //title        
        this.title = document.createElement('p');
        this.title.className = "download-title";
        this.title.innerHTML = this.videotitle;
        //progress
        this.progress = document.createElement('p');
        this.progress.className = "download-progress";
        this.progress.innerHTML = "Downloading...";
        //text
        this.text = document.createElement('div');
        this.text.className = "download-text";
        this.text.appendChild(this.title);
        this.text.appendChild(this.progress);        

        //itemdiv
        this.itemdiv = document.createElement('div');
        this.itemdiv.className = "download-div";
        this.itemdiv.id = this.videotitle;
        this.itemdiv.appendChild(this.img);
        this.itemdiv.appendChild(this.text);
        //append to songs
        songs.appendChild(this.itemdiv);
    }

    changeProgress(text){
        document.getElementById(this.videotitle).childNodes[1].childNodes[1].innerHTML = text;
    }

}