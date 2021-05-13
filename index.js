const Discord = require("discord.js");
const fs = require('fs');
const cp = require("child_process");
const config = require('./config.json');
const speech = require('@google-cloud/speech');
var wavConverter = require('wav-converter');

const client = new Discord.Client();
const voiceclient = new speech.SpeechClient({
  keyFilename:'./mc-server-280321-d908a7ad96dd.json'
});
let fileName;
let receiver;
let ignorevoice = false;
let joined = false;

client.on('message', (msg, user) => {
  if (msg.content.startsWith(config.prefix+'join')) {
    let [command, ...channelName] = msg.content.split(" ");
    if(joined) {
      msg.reply("Bot already in a channel"); 
      return
    }
    joined = true;
    msg.member.voice.channel.join()
      .then(conn => {
        msg.reply('ready!');
        receiver = conn.receiver.createStream("205828948905426945", { mode: "pcm", end: "manual"});

        conn.on('speaking', async (user, speaking) => {
          if(speaking.bitfield){
            console.log("started speaking");
            if(ignorevoice){
              return
            }
            fileName = `${Date.now()}`;
            const outputStream = fs.createWriteStream(`./raw_recordings/${fileName}.pcm`);
            receiver.pipe(outputStream);
          }else if(!speaking.bitfield){
            console.log("stopped speaking");
            ignorevoice = true;
            const filepath = `./raw_recordings/1620925123320.pcm`;
            const request = {
              config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 48000,
                languageCode: 'en-US',
                audioChannelCount: 2
              },
              interimResults: false, 
            };

            const recognizeStream = voiceclient
              .streamingRecognize(request)
              .on('error', console.error)
              .on('data', data => {
                console.log(
                  `Transcription: ${data.results[0].alternatives[0].transcript}`
                );
                ignorevoice = false;
            });

            fs.createReadStream(filepath).pipe(recognizeStream);
            fileName = null;
          }
        });

      }).catch(console.log);
  }
  if(msg.content.startsWith(config.prefix+'leave')) {
    let [command, ...channelName] = msg.content.split(" ");
    let voiceChannel = msg.member.voice.channel;
    // receiver.destroy();
    joined = false;
    voiceChannel.leave();
  }
});

client.login(config.token);

client.on('ready', () => {
  console.log('ready!');
});
