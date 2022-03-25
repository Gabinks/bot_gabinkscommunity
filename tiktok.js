require('dotenv').config();
const Database = require('easy-json-database')
const db = new Database('./database.json')

const Discord = require('discord.js')
var client = new Discord.Client({intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES
]});

const tiktok = require('tiktok-scraper')

client.login(process.env.token);

//const resolveID = async () => (await tiktok.getUserProfileInfo(tiktokAccount, { proxy: 'socks5://192.169.244.80:11514' })).user.id
//const resolveID = async () => (await tiktok.getUserProfileInfo(tiktokAccount, { sessionList: ['sid_tt=d360f5623239ac9d97df4a8d0ea85b67;'] })).user.id
const resolveID = async () => (await tiktok.getUserProfileInfo(process.env.tiktokAccount, { proxyFile: ['./proxy'] })).user.id


const sync = async (userID) => {
    const cache = db.get('cache')
    try {
        const { collector : newPosts } = await tiktok.user(userID)
        if (newPosts.length === 0) return
        const newPostsSorted = newPosts.sort((a, b) => b.createTime - a.createTime).slice(0, 10)
        if (cache) {
            const post = newPostsSorted.filter((post) => !cache.includes(post.id))[0]
            if (post && (post.createTime > ((Date.now() - 24 * 60 * 60 * 1000) / 1000))) {
                const author = post.authorMeta.nickName
                const link = post.webVideoUrl
                const embed = new Discord.MessageEmbed()
                    .setAuthor(author, client.user.displayAvatarURL())
                    .setTitle(post.text)
                    .setThumbnail(config.embed_icon_url)
                    .setImage(post.covers.default)
                    .setColor('#00FF00')
                    .setTimestamp()
                    .setFooter(author, client.user.displayAvatarURL())
                client.channels.cache.get(config.notifChannel).send(`[@everyone]\n\n**${author} vient de poster un nouveau Tiktok !\n\nVa vite le voir ici : ${link} !**`, embed)
            }
        }
        db.set('cache', newPostsSorted.map((post) => post.id))
    }catch (error){
        console.error('1TIKTOK : ' + error)
    }
}

client.on('ready', async () => {
    try{
        //const userID = await resolveID()
        //sync(userID)
        //setInterval(() => sync(userID), 120 * 1000)
        console.log('TIKTOK : Ready!')
    }catch (error){
        console.error('2TIKTOK : ' + error)
    }
})