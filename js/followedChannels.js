class FollowedChannels{
    constructor(){
        this.storageName = 'followedChannels'
    }

    GetChannels(){
        let arr;
        if(localStorage.getItem(this.storageName) === null){
            arr = [];
        } else {
            arr = JSON.parse(localStorage.getItem(this.storageName));
        }
        return arr;
    }

    AddChannel(channelName){
        let arr = this.GetChannels();
        arr.push(channelName);
        localStorage.setItem(this.storageName,JSON.stringify(arr));
    }

    RemoveChannel(channelName){
        let arr = this.GetChannels();
        for(let i=0; i<arr.length; i++){
            if(arr[i] === channelName)
            {
                arr.splice(i,1);
                break;
            }
        }
        localStorage.setItem(this.storageName,JSON.stringify(arr));
    }

    IsFollowed(channelName){
        const arr = this.GetChannels();
        for(let i=0; i<arr.length; i++){
            if(arr[i] === channelName){
                return true;
            }
        }
        return false;
    }
}