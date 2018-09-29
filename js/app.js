const OFFLINETITLETEXT = "Offline"
const states = {all: 'ALL', online: 'ONLINE', offline: 'OFFLINE'};
let state = states.all;
//init twitch object
const twitch = new Twitch();
//init ui object
const ui = new UI();
//init channels
const followedChannels = new FollowedChannels();

//when page loads get followed items from storage
document.addEventListener('DOMContentLoaded',()=>{
    const channels = followedChannels.GetChannels();
    if(channels.length===0){
        console.log("Nobody is being followed yet");
        return ;
    }
    for(let i=0; i<channels.length; i++){
        //first we do a get request for streams
        twitch.GetChannel(twitch.MakeUrl('streams',channels[i]),(err,response)=>{
            if (err) {
                console.log(err);
            } else {
                const data = JSON.parse(response);
                //we then check if stream is offline
                if (data.stream === null) {
                    //http request for type channels to get the most recent channel data
                    twitch.GetChannel(twitch.MakeUrl('channels',channels[i]),(err,response)=>{
                        if(err){
                            console.log(err);
                        } else{
                            const data = JSON.parse(response);
                            if(data.hasOwnProperty('error')){
                                console.log("Channel doesn't exist");
                                //show message that channel doesnt exist
                                ui.ShowAlert(`Could not load channel with name "${channels[i]}" doesn't exist`,'alert-danger');
                                ui.ClearDisplayChannel();
                            } else {
                                //show that channel with logo, name and follow btn
                                ui.ClearAlert();
                                ui.CreateFollowedChannelItem(data.display_name, data.url, OFFLINETITLETEXT, data.logo, data.game, states.offline);
                            }
                        }
                    });
                } else { 
                    //if the stream is online we put its online data
                    ui.CreateFollowedChannelItem(data.stream.channel.display_name, data.stream.channel.url,data.stream.channel.status,data.stream.channel.logo,data.stream.channel.game, states.online);
                }
            }
        });
    }
});

//When user searches for the channel
ui.el_followInput.addEventListener('keyup', ()=>{
    //check input value
    const inputText = ui.el_followInput.value;
    if(inputText != ''){
        //http call for type channels and channelName
        twitch.GetChannel(twitch.MakeUrl('channels',inputText),(err,response)=>{
            if(err){
                console.log(err);
            } else{
                const data = JSON.parse(response);
                //check if channel exists
                if(data.hasOwnProperty('error')){
                    console.log("Channel doesn't exist");
                    //show message that channel doesnt exist
                    ui.ShowAlert(`The channel with name "${inputText}" doesn't exist`,'alert-warning');
                    ui.ClearDisplayChannel();
                } else {
                    //show that channel with logo, name and follow btn
                    ui.ClearAlert();
                    ui.CreateDisplayChannelItem(data.display_name, data.url, data.status, data.logo, data.game);
                }
            }
        });
    } else{ //if input is empty clear the display channel region and alert region
        ui.ClearDisplayChannel();
        ui.ClearAlert();
    }
});

//Handle follow button click event
ui.el_displayChannel.addEventListener('click',(e)=>{
   
    if(e.target.classList.contains('follow-btn')){
        //get channel properties
        const channelProperties = ChannelProperties.GetChannelProperties(e.target.parentElement.previousElementSibling);
        // console.log(channelProperties);
        //check if the channel is already followed
        if(followedChannels.IsFollowed(channelProperties.name)){
            //throw some alert
            console.log('Followed');
            ui.ShowAlert('You are already following this channel','alert-warning');
            // return out of the function so we don't add the channel to follow list
            return;
        }
        //Do a get Request for type streams and channelName 
        twitch.GetChannel(twitch.MakeUrl('streams',channelProperties.name),(err,response)=>{
            if (err) {
                console.log(err);
            } else {
                const data = JSON.parse(response);
                //check if channel is online
                //pass properties to ui metod to build channel item
                if (data.stream === null) {
                    console.log("Stream is offline");
                    ui.CreateFollowedChannelItem(channelProperties.name, channelProperties.link, OFFLINETITLETEXT, channelProperties.logo, channelProperties.game, states.offline)
                } else {
                    console.log("Stream is online");
                    ui.CreateFollowedChannelItem(channelProperties.name, channelProperties.link, channelProperties.title, channelProperties.logo, channelProperties.game, states.online)
                }
                //add the channel name to local storage
                followedChannels.AddChannel(channelProperties.name);
                ui.ShowAlert('Channel added to follow list','alert-success');
            }
        });
    }
});

//handle unfollow button
ui.el_followedChannels.addEventListener('click',(e)=>{
    
    if(e.target.classList.contains('unfollow-btn')){
        const channelName = ChannelProperties.GetChannelName(e.target.parentElement.previousElementSibling);
        followedChannels.RemoveChannel(channelName);
        e.target.parentElement.parentElement.parentElement.remove();
        ui.ShowAlert('Channel removed from follow list','alert-success');
    }
});

//FILTERS


//all followed channels from followedChannels element
const channels = ui.el_followedChannels.children;

ui.el_allBtn.addEventListener('click',(e, callback)=>{
    e.preventDefault();
    state=states.all;
    console.log(state);
    for(let i=0; i<channels.length; i++){
        channels[i].style.display = "block";
    }
    TextFilter();
})

ui.el_offlineBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    state=states.offline;
    console.log(state);
    for(let i=0; i<channels.length; i++){
        const channelState = ChannelProperties.GetChannelState(channels[i].querySelector('.channel-properties'));
        if(channelState === state){
            channels[i].style.display = 'block';
        } else{
            channels[i].style.display = 'none';
        }
    }
    TextFilter();
});

ui.el_onlineBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    state = states.online;
    console.log(state);
    for(let i=0; i<channels.length; i++){
        const channelState = ChannelProperties.GetChannelState(channels[i].querySelector('.channel-properties'));
        if(channelState === state){
            channels[i].style.display = 'block';
        } else{
            channels[i].style.display = 'none';
        }
    }
    TextFilter();
});

//filter text box event handler
ui.el_filterInput.addEventListener('keyup', TextFilter)

function TextFilter(){
    const inputText = ui.el_filterInput.value;
    
    if(inputText != ''){
        for(let i=0; i<channels.length; i++){
            const channelName = ChannelProperties.GetChannelName(channels[i].querySelector('.channel-properties'));
            const channelState = ChannelProperties.GetChannelState(channels[i].querySelector('.channel-properties'));
            if(channelName.toLowerCase().indexOf(inputText.toLowerCase()) != -1 
            && (channelState.toLowerCase() === state.toLowerCase() || state===states.all)){
                channels[i].style.display = 'block'
            } else{
                channels[i].style.display = 'none'
            }
        }
    } else {
        for(let i=0; i<channels.length; i++){
            const channelState = ChannelProperties.GetChannelState(channels[i].querySelector('.channel-properties'));
            if(channelState.toLowerCase() === state.toLowerCase() || state===states.all){
                channels[i].style.display = 'block';
            } else{
                channels[i].style.display = 'none';
            }
        }
    }
}
