class Twitch{
    MakeUrl(type, channelName){
        // return `https://wind-bow.glitch.me/twitch-api/${type}/${channelName}?callback=?`
        return `https://wind-bow.glitch.me/twitch-api/${type}/${channelName}`;
    }
    GetChannel(url, callback){
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = function(){
            if(this.status===200){
                callback(null, this.responseText);
            }else{
                callback("Error" + this.status,null);
            }
        }

        xhr.send();
    }
}