import speech_recognition as sr
import sys
import time
from datetime import datetime
import random
import os

now = datetime.now()
now = str(now)
loc = now.split(" ")
loc = loc[0]
random_num = str(random.randint(0,99999999))
loc = loc+"-"+random_num
r = sr.Recognizer()
for arg in sys.argv[1:]:
    with sr.AudioFile(f"{arg}.wav") as source:
        audio = r.listen(source)
        text = r.recognize_google(audio)
        print(text)
        f = open(f"./speech_logs/{loc}.txt", "w+")
        f.write(text)
        print("Added to TEXT File")

os.remove(f"{arg}.wav")

