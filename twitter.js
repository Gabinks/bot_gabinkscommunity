const Discord = require('discord.js');
const Twitter = require('twit');
require("dotenv").config();
const twitterConf = {
    consumer_key: process.env.twitterConsumerKey,
    consumer_secret: process.env.twitterConsumerSecret,
    access_token: process.env.twitterAccessTokenKey,
    access_token_secret: process.env.twitterAccessTokenSecret,
  }
const client = new Discord.Client({intents: 32767});
const twitterClient = new Twitter(twitterConf);
// Specify destination channel ID below
const dest = '956534288998879292'; 

// Create a stream to follow tweets
const stream = twitterClient.stream('statuses/filter', {
  follow: '1082004520866074629', // @Every3Minutes, specify whichever Twitter ID you want to follow
});

stream.on('tweet', tweet => {
  const twitterMessage = `${tweet.user.name} (@${tweet.user.screen_name}) tweeted this: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
  client.channels.get(dest).send(twitterMessage);
  return false;
});

client.on('ready', () => {
    console.log(`Twitter : Logged in as ` + client.user.tag);
});

client.login(process.env.token);