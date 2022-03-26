const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767});

const tiktok = require("tiktok-scraper")

require('dotenv').config();

client.login(process.env.token);

const resolveID = async () => (await tiktok.getUserProfileInfo(process.env.tiktokAccount, { proxyFile: ['./proxy'] })).user.id

const sync = async (userID) => {
    try {
        const { collector : newPosts } = await tiktok.user(userID)
        if (newPosts.length === 0) return
        const newPostsSorted = newPosts.sort();
        const post = newPostsSorted.filter((post) => !cache.includes(post.id))[0]
        const author = post.authorMeta.nickName
        const link = post.webVideoUrl
        const embed = new Discord.MessageEmbed()
                    .setAuthor(author, client.user.displayAvatarURL())
                    .setTitle(post.text)
                    .setThumbnail(process.env.embed_icon_url)
                    .setImage(post.covers.default)
                    .setColor('#00FF00')
                    .setTimestamp()
                    .setFooter(author, client.user.displayAvatarURL())
                client.channels.cache.get(process.env.notifChannel).send(`[@everyone]\n\n**${author} vient de poster un nouveau Tiktok !\n\nVa vite le voir ici : ${link} !**`, embed) 
    }catch (error) {
        console.error(error)
    }
}

client.on('ready', async (userID) => {
    try{
        const { collector : newPosts } = await tiktok.user(userID)
        //if (newPosts.length === 0) return(console.error('lenght = 0'))
        const newPostsSorted = newPosts.sort();
        const post = newPostsSorted.filter((post) => !cache.includes(post.id))[0]
        //const author = post.authorMeta.nickName
        const link = post.webVideoUrl
        const embed = new Discord.MessageEmbed()
                    //.setAuthor(author, client.user.displayAvatarURL())
                    .setTitle(post.text)
                    .setThumbnail(process.env.embed_icon_url)
                    .setImage(post.covers.default)
                    .setColor('#00FF00')
                    .setTimestamp()
                    //.setFooter(author, client.user.displayAvatarURL())
                client.channels.cache.get(process.env.notifChannel).send(`[@everyone]\n\n**${author} vient de poster un nouveau Tiktok !\n\nVa vite le voir ici : ${link} !**`, embed)
        console.log('TikTok : Logged in as ' + client.user.tag + '!')
    }catch (error){
        console.error('2TIKTOK : ' + error)
    }
})