const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767});

const TikTokScraper = require("tiktok-scraper")

require('dotenv').config();

client.login(process.env.token);

(async () => {
    try {
        const posts = await TikTokScraper.user('gabinksfx', {
            number: 100,
            proxyFile: ['./proxy']
        });
        console.log('TikTok : ' + posts);
        client.channels.cache.get('956534288998879292').send(posts);
    } catch (error) {
        console.log('TikTok : ' + error);
    }
})();