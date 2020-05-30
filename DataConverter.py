import wave
import sys
import time

for arg in sys.argv[1:]:
    final_loc = arg
    final_loc = final_loc.split("/")
    final_loc = final_loc[2]
    with open(arg, 'rb') as pcmfile:
        pcmdata = pcmfile.read()
    with wave.open(f"./wav_files/{final_loc}.wav", 'wb') as wavfile:
        wavfile.setparams((2, 2, 48000, 0, 'NONE', 'NONE'))
        wavfile.writeframes(pcmdata)