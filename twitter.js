const {Discord, Client, Collection, Message, MessageEmbed} = require("discord.js");
const Twit = require("node-tweet-stream");
const fs = require("fs");
require("dotenv").config();

const config = JSON.parse(fs.readFileSync("./configtwitter.json", "utf8"));

const t = new Twit({
    consumer_key: process.env.twitterConsumerKey,
    consumer_secret: process.env.twitterConsumerSecret,
    //app_only_auth:true,
    //access_token_key:config.twitterAccessTokenKey,
    //access_token_secret:config.twitterAccessTokenSecret
    token: process.env.twitterAccessTokenKey,
    token_secret: process.env.twitterAccessTokenSecret
});
const dClient = new Client({intents: 32767});
dClient.login(process.env.token);

dClient.on('ready', () => {
    console.log(`TWITTER : Connected to Discord as ${dClient.user.tag}`);
    dClient.guilds.cache.get('955951432031416350').commands.create(tweet);
});

t.on('tweet', function (tweet) {
    let media = tweet.entities.media;
    chatPost(tweet.text, tweet.user.screen_name, `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`, tweet.created_at, tweet.user.profile_image_url, media);
})
t.on('error', function (err) {
    console.error(err)
    console.log('TWITTER : Oh no')    
})
let track = process.env.following;
for (var i = 0; i < track.length; i++) {
    t.follow(track[i]);
    console.log(`Following Twitter User [ID]${track[i]}`)
}

function chatPost(content, author, url, time, authorPfp, media) {
    const message = new MessageEmbed().setTitle(process.env.title).setColor(process.env.colour).setDescription(content).setAuthor(`@${author}`, authorPfp, `https://twitter.com/${author}`).setFooter(`Twitter - ${time} - Made by otherwise#5109`, "https://abs.twimg.com/favicons/twitter.ico").setURL(url);

    if (!!media) for (var j = 0; j < media.length; j++) message.setImage(media[j].media_url);

    for (const __channel of process.env.channelsToPost.map(x => dClient.channels.cache.get(x))) __channel.send({embeds: [message]});
}

const { SlashCommandBuilder } = require("@discordjs/builders");

const tweet = new SlashCommandBuilder()
    .setName("tweet")
    .setDescription("envoie le dernier tweet");

dClient.on("interactionCreate", interaction => {
    if(interaction.isCommand()){
        if(interaction.commandName === "tweet"){
            chatPost(tweet.text, tweet.user.screen_name, `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`, tweet.created_at, tweet.user.profile_image_url, media);
        }
    }
})