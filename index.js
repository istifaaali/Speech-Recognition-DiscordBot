// Speech Recognition Discord Bot
// Author: Istifaa Ali

const Discord = require("discord.js");
const fs = require('fs');
const config = require('./config.json');
const speech = require('@google-cloud/speech');
var wavConverter = require('wav-converter');

const client = new Discord.Client();
const voiceclient = new speech.SpeechClient({
  keyFilename: config.keyfile // Google API needs to authenticate the API, the SpeechClient takes in multiple forms of authentication, see the documentation to see what can be passed through
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
        receiver = conn.receiver.createStream("USER ID HERE", { mode: "pcm", end: "manual"}); // Creates a receiver stream for only one user, this outputs raw audio data 

        conn.on('speaking', async (user, speaking) => {// Called if a user starts speaking in the channel
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
            try{
              ignorevoice = true;
              const filepath = `./raw_recordings/${fileName}.pcm`;
              const request = {
                config: {
                  encoding: 'LINEAR16',// Discord.js outputs LINEAR16 PCM data which we convert into digital audio using the Google API
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
                    `Transcription: ${data.results[0].alternatives[0].transcript}` // Output final speech to text data
                  );
                  ignorevoice = false;
              });
              fs.createReadStream(filepath).pipe(recognizeStream);
            }catch(error){
              console.error(error);
            }
          }
        });
      }).catch(console.log);
  }
  if(msg.content.startsWith(config.prefix+'leave')) {
    let [command, ...channelName] = msg.content.split(" ");
    let voiceChannel = msg.member.voice.channel;
    joined = false;
    voiceChannel.leave();
  }
});

client.login(config.token);

client.on('ready', () => {
  console.log('ready!');
});