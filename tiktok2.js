const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767});

const TikTokScraper = require("tiktok-scraper")

require('dotenv').config();

client.login(process.env.token);

(async () => {
    try {
        const posts = await TikTokScraper.user(process.env.token, {
            number: 100,
            proxyFile: ['./proxy']
        });
        console.log('TikTok : ' + posts);
    } catch (error) {
        console.log(error);
    }
})();