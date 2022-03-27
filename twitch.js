const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767});
require("dotenv").config();

client.on('ready', () => {
    console.log(`Twitch : Logged in as ` + client.user.tag);
});

client.login(process.env.token);