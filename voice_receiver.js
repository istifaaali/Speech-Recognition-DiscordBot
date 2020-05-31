const Discord = require("discord.js");
const fs = require('fs');
const cp = require("child_process");
const client = new Discord.Client();
const config = require('./config.json');
const YouTube = require("discord-youtube-api");
const youtube = new YouTube("AIzaSyAZFggAoNGSEG1DFTXmm2A9uSeE1qYKAW8");
let fileName;
let content;

// make a new stream for each time someone starts to talk
function generateOutputFileName(){
  const fileName = `${Date.now()}.pcm`;
  return fileName;
}

function generateOutputFile(channel, member, fileName) {
  // use IDs instead of username cause some people have stupid emojis in their name
  return fs.createWriteStream(`./raw_recordings/${fileName}`);
}


function convertRawData(fileName){
  // cp.spawnSync("python",["DataConverter.py",`./raw_recordings/${fileName}`]);
  cp.spawn("py",["DataConverter.py",`./raw_recordings/${fileName}`])
}

function ScanVoice(fileName){
  const voiceScan = cp.spawn("py",["voice_process.py",`./wav_files/${fileName}`])
  return voiceScan;
}



client.on('message', (msg, user) => {
  if (msg.content.startsWith(config.prefix+'join')) {
    let [command, ...channelName] = msg.content.split(" ");
    // if (!msg.guild) {
    //   return msg.reply('no private service is available in your area at the moment. Please contact a service representative for more details.');
    // }
    //const voiceChannel = msg.guild.channels.find("name", channelName.join(" "));
    //console.log(voiceChannel.id);
    // if (!voiceChannel || voiceChannel.type !== 'voice') {
    //   return msg.reply(`I couldn't find the channel ${channelName}. Can you spell?`);
    // }
    msg.member.voice.channel.join()
      .then(conn => {
        msg.reply('ready!');
        let time = Date.now();
        fileName = generateOutputFileName();
        const receiver = conn.receiver.createStream("205828948905426945", { mode: "pcm", end: "manual"});
        const outputStream = generateOutputFile(msg.member.voice.channel, "205828948905426945", fileName);
        receiver.pipe(outputStream);

        setInterval(function(){
          const voiceScan = ScanVoice(fileName);
          const textFiles = fs.readdirSync('./speech_logs').filter(file => file.endsWith('.txt'));
          for (const file of textFiles) {
            fs.readFile(`${file}`, 'utf8', function(err, contents) {
              console.log(contents);
              contents = contents;
            });
          }
          console.log("TIMER RESET");
        }, 10000)


        conn.on('speaking', async (user, speaking) => {
          //console.log(`${user.tag} is Speaking!`);
          //fileName = updateFile();
          convertRawData(fileName);
          // const voiceScan = ScanVoice(fileName);
          // voiceScan.stderr.on('data', (data) => {
          //   console.log(`stdout: ${data}`);
          // });
        });
      })
      .catch(console.log);
  }
  if(msg.content.startsWith(config.prefix+'leave')) {
    let [command, ...channelName] = msg.content.split(" ");
    let voiceChannel = msg.member.voice.channel;
    voiceChannel.leave();
  }
});

client.login("NjA4NTEwNjExMDM0NDcyNDQ4.XsmXaA.osBHtylif_yvJEUHBmm5axhmCek");

client.on('ready', () => {
  console.log('ready!');
});