# DiscordBot-Voice-Commands

a discordbot that uses speech recognition for commands.
I never cared to finish it 

The code uses the Discord API to record a specific userID for a few seconds and then it will generate a new output stream of raw data in a .PCM file. In order to process the audio recording for actually speech recognition the code converts the raw data into a readable format(.WAV).I used python to convert the data and process the voice to make it simple. The code will convert the data and then send it to the voice_process.py file to process the audio, the python file will generate a .txt file with speech logs so that the discordbot can read it and see if the user said a command.

This project is unfinished and very buggy, it only listens for a few seconds and loops around again generating new raw data and audio recordings each time.
