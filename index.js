var Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
var client = new Discord.Client({intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
]});
require("dotenv").config();
const tiktokjs = require("./tiktok")
const twitterjs = require("./twitter")
const youtubejs = require("./youtube")

const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("renvoie pong");

client.login(process.env.token);

client.on('ready', () => {
    client.user.setActivity(process.env.activity, {
        type: "STREAMING",
        url: "https://www.twitch.tv/gabinbinks"
      });
    
    console.log("CORE : Started")
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