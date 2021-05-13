const Discord = require("discord.js");
const fs = require('fs');
const cp = require("child_process");
const config = require('./config.json');
var wavConverter = require('wav-converter');

const client = new Discord.Client();
let fileName;

client.on('message', (msg, user) => {
  if (msg.content.startsWith(config.prefix+'join')) {
    let [command, ...channelName] = msg.content.split(" ");
    msg.member.voice.channel.join()
      .then(conn => {
        msg.reply('ready!');
        fileName = `${Date.now()}.pcm`;
        const receiver = conn.receiver.createStream("205828948905426945", { mode: "pcm", end: "manual"});
        const outputStream = fs.createWriteStream(`./raw_recordings/${fileName}`);
        receiver.pipe(outputStream);
        setTimeout(function(){
          var pcmData = fs.readFileSync(`./raw_recordings/${fileName}`);
          let wavData = wavConverter.encodeWav(pcmData, {
            numChannels: 2,
            sampleRate: 48000,
            byteRate: 16
          })
        },500)
        conn.on('speaking', async (user, speaking) => {
          console.log("speaking!");
          fs.writeFileSync("./wav_data/test.wav", wavData)
        });
      }).catch(console.log);
  }
  if(msg.content.startsWith(config.prefix+'leave')) {
    let [command, ...channelName] = msg.content.split(" ");
    let voiceChannel = msg.member.voice.channel;
    voiceChannel.leave();
  }
});

client.login(config.token);

client.on('ready', () => {
  console.log('ready!');
});
