const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767});
var CronJob = require('cron').CronJob;
const fs = require('fs')

const Stream = require("./modules/getStreams.js")
const Auth = require("./modules/auth.js")
const Channel = require("./modules/channelData.js")
require("dotenv").config();

//ready
client.on('ready', () => {
    console.log(`TWITCH : Logged in as ${client.user.tag}!`);
});

//function that will run the checks
var Check = new CronJob(process.env.cron,async function () {
    //const tempData = require("dotenv").config();

    process.env.channels.map(async function (chan, i) {
        if (!chan.ChannelName) return;
        
        let StreamData = await Stream.getData(chan.ChannelName, process.env.twitch_clientID, process.env.authToken);
        if (StreamData.data.length == 0) return

        StreamData = StreamData.data[0]

        //get the channel data for the thumbnail image
        const ChannelData = await Channel.getData(chan.ChannelName, process.env.twitch_clientID, process.env.authToken)
        if (!ChannelData) return;

        //structure for the embed
        var SendEmbed = {
            "title": `🔴 ${StreamData.user_name} is now live`,
            "description": StreamData.title,
            "url": `https://www.twitch.tv/${StreamData.user_login}`,
            "color": 6570404,
            "fields": [
                {
                    "name": "Playing:",
                    "value": StreamData.game_name,
                    "inline": true
                },
                {
                    "name": "Viewers:",
                    "value": StreamData.viewer_count,
                    "inline": true
                },
                {
                    "name": "Twitch:",
                    "value": `[Watch stream](https://www.twitch.tv/${StreamData.user_login})`
                },
                (chan.DiscordServer ? {
                    "name": "Discord Server:",
                    "value": `[Join here](${chan.DiscordServer})`
                } : {
                    "name": "** **",
                    "value": "** **"
                })
            ],
            "footer": {
                "text": StreamData.started_at
            },
            "image": {
                "url": `https://static-cdn.jtvnw.net/previews-ttv/live_user_${StreamData.user_login}-640x360.jpg?cacheBypass=${(Math.random()).toString()}`
            },
            "thumbnail": {
                "url": `${ChannelData.thumbnail_url}`
            }
        }

        //get the assigned channel
        const sendChannel = client.guilds.cache.get(config.DiscordServerId).channels.cache.get(config.channelID)

        if (chan.twitch_stream_id == StreamData.id) {
            sendChannel.messages.fetch(chan.discord_message_id).then(msg => {
                //update the title, game, viewer_count and the thumbnail
                msg.edit({ embed: SendEmbed })
            });
        } else {
            //this is the message when a streamer goes live. It will tag the assigned role
            await sendChannel.send({ embed: SendEmbed }).then(msg => {
                const channelObj = process.env.channels[i]
                
                channelObj.discord_message_id = msg.id
                channelObj.twitch_stream_id = StreamData.id
                
                if(config.roleID){
                    sendChannel.send(`<@&${config.roleID}>`)
                }
            })
        }
    })
});

//login
client.login(process.env.token);