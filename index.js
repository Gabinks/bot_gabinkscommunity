var Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
var client = new Discord.Client({intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
]});
const {TOKEN, activity} = require("./config.json")
const tiktokjs = require("./tiktok")
const twitterjs = require("./twitter")
const youtubejs = require("./youtube")

//const users = TikTokScraper.userEvent('gabinksfx', { proxy: 'socks5://109.248.175.223', number: 30 });
const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("renvoie pong");

client.login(TOKEN);

client.on('ready', () => {
    client.user.setActivity(activity, {
        type: "STREAMING",
        url: "https://www.twitch.tv/gabinbinks"
      });
    console.log("Started")
    //client.application.commands;.create(data);
    client.guilds.cache.get('955951432031416350').commands.create(data);
    tiktokjs;
    twitterjs;
    youtubejs;
});

client.on("interactionCreate", interaction => {
    if(interaction.isCommand()){
        if(interaction.commandName === "ping"){
            interaction.reply("pong");
        }
    }
})