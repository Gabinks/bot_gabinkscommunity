const Discord = require("discord.js");
const client = new Discord.Client({intents: 32767});
client.db = require("quick.db");
client.request = new (require("rss-parser"))();
require("dotenv").config();

client.on("ready", () => {
    console.log("YOUTUBE : I'm ready!");
    handleUploads();
});

function handleUploads() {
    if (client.db.fetch(`postedVideos`) === null) client.db.set(`postedVideos`, []);
    setInterval(() => {
        client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${process.env.channel_id}`)
        .then(data => {
            if (client.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
                client.db.set(`videoData`, data.items[0]);
                client.db.push("postedVideos", data.items[0].link);
                let parsed = client.db.fetch(`videoData`);
                let channel = client.channels.cache.get(process.env.channel);
                if (!channel) return;
                let message = process.env.messageTemplate
                    .replace(/{author}/g, parsed.author)
                    .replace(/{title}/g, Discord.Util.escapeMarkdown(parsed.title))
                    .replace(/{url}/g, parsed.link);
                channel.send(message);
            }
        });
    }, process.env.watchInterval);
}

client.login(process.env.token);