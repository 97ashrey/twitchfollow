class ChannelProperties{
    static GetChannelLogo(el_channelProperties){
        return el_channelProperties.querySelector('.channel-logo').getAttribute('href');
    }

    static GetChannelLink(el_channelProperties){
        return el_channelProperties.querySelector('.channel-logo img').getAttribute('src');
    }

    static GetChannelName(el_channelProperties){
        return el_channelProperties.querySelector('.channel-info .channel-name').textContent;
    }   
    static GetChanneTitle(el_channelProperties){
        return el_channelProperties.querySelector('.channel-info .channel-title').textContent;
    }
    static GetChannelGame(el_channelProperties){
        return el_channelProperties.querySelector('.channel-info .game-name').textContent;
    }

    static GetChannelProperties(el_channelProperties){
        const link = el_channelProperties.querySelector('.channel-logo').getAttribute('href');
        const logo = el_channelProperties.querySelector('.channel-logo img').getAttribute('src');
        const name = el_channelProperties.querySelector('.channel-info .channel-name').textContent;
        const title = el_channelProperties.querySelector('.channel-info .channel-title').textContent;
        const game = el_channelProperties.querySelector('.channel-info .game-name').textContent;
        return{
            name,
            title,
            link,
            logo,
            game
        }
    }

    static GetChannelState(el_channelProperties){
        return el_channelProperties.getAttribute('state');
    }
}