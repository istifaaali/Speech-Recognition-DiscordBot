
<p align="center">
  <h3 align="center">Speech Recognition Discord Bot</h3>
  <p align="center">
    A bot that uses Google's Speech to Text API to detect commands
  </p>
</p>

<!-- ABOUT THE PROJECT -->
## About The Project

This code only only listens to one user and creates an output stream of raw audio data for the Google API to convert into digital audio and give a text result, 
which could be used to make commands to play music.

This code dosn't contain any commands for the discord bot to do, it's only purpose is to convert speech to text.

In order for the google api to work you need to provide authentication, in the form of a keyfile (JSON) or a key, I used a keyfile and passed the directory of the json file into
the speech client. You can refer to the documenation below to learn how to authenticate.

You can configure your google api key,command prefix and your Discord API token inside the config.json file.

API References:

https://googleapis.dev/nodejs/speech/latest/

https://discord.js.org/#/docs/main/stable/general/welcome

https://cloud.google.com/speech-to-text/docs/encoding

<!-- LICENSE -->
## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## Contact

Discord - istifaaAli#1985

Project Link: https://github.com/istifaaali/Speech-Recognition-DiscordBot
