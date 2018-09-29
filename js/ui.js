class UI {
    constructor(){
        this.el_displayChannel = document.getElementById('display-channel');
        this.el_displayAlert = document.getElementById('display-alert');
        this.el_followedChannels = document.getElementById('followed-channels');
        this.el_followInput = document.getElementById('follow-input');
        this.el_filterInput = document.getElementById('filter-input');
        this.el_allBtn = document.getElementById('btn-all');
        this.el_onlineBtn = document.getElementById('btn-online');
        this.el_offlineBtn = document.getElementById('btn-offline');
        this.alertTimer = undefined;
    }

    ShowAlert(msg, className){
        this.ClearAlert();
        let alert = document.createElement('div');
        alert.className = "alert " + className + " mb-2 mt-2";
        alert.appendChild(document.createTextNode(msg));
        this.el_displayAlert.appendChild(alert);
        this.alertTimer = setTimeout(() => {
            this.ClearAlert();
        }, 2500);
    }

    ClearAlert(){
        clearTimeout(this.alertTimer);
        const alert = document.querySelector('.alert');
        if(alert){
            alert.remove();
        }
    }

    CreateDisplayChannelItem(name, link, title, logo, game){
        const output = 
        `<div class="channel-item">
            <div class="grid-wrapper">
                <div class="channel-properties">
                    <a href="${link}" target="_blank" class="channel-logo">
                        <img src="${logo}">
                    </a>
                    <div class="channel-info">
                        <a href="${link}" target="_blank" class="channel-name">${name}</a>
                        <span class="game-name">${game}</span>
                        <span class="channel-title">${title}</span>
                    </div>
                </div>
                <div class="btn-container">
                    <button type="button" class="follow-btn btn btn-primary">Follow</button>
                </div>
            </div>
        </div>`;
        this.el_displayChannel.innerHTML = output;
    }

    CreateFollowedChannelItem(name, link, title, logo, game, state){
        const output =
        `<li class="channel-item list-group-item">
            <div class="grid-wrapper">
                <div class="channel-properties" state="${state}">
                    <a href="${link}" target="_blank" class="channel-logo">
                        <img src="${logo}">
                    </a>
                    <div class="channel-info">
                        <a href="${link}" target="_blank" class="channel-name">${name}</a>
                        <span class="game-name">${game}</span>
                        <span class="channel-title">${title}</span>
                    </div>
                </div>
                <div class="btn-container">
                    <button type="button" class="unfollow-btn btn btn-primary">Unfollow</button>
                </div>
            </div>
        </li>
        `;
        this.el_followedChannels.innerHTML +=output;
    }

    ClearDisplayChannel(){
        this.el_displayChannel.innerHTML = "";
    }

}