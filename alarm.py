import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
from time import sleep
import threading
import requests
import json

url = "https://sea-lion-app-ta55w.ondigitalocean.app/key"
log_url = "https://sea-lion-app-ta55w.ondigitalocean.app/log"
headers = {
    'Content-Type': 'application/json'
}

nfc_reader = SimpleMFRC522()  # Setup NFC reader

GPIO.setmode(GPIO.BOARD)  # Set GPIO pin numbering
MOTION_SENSOR = 15  # Associate pin 15 with motion sensor
RED = 37  # Associate pin 37 with red LED
GREEN = 36  # Associate pin 36 with green LED
SPEAKER = 29  # Associate pin 29 with speaker

GPIO.setup(MOTION_SENSOR, GPIO.IN)

GPIO.setup(RED, GPIO.OUT)
GPIO.output(RED, GPIO.LOW)

GPIO.setup(GREEN, GPIO.OUT)
GPIO.output(GREEN, GPIO.HIGH)

GPIO.setup(SPEAKER, GPIO.OUT)
GPIO.output(SPEAKER, GPIO.LOW)

# Global variables for blink function
id = 0


def verify_tag(tag_id):
    if (not tag_id):
        return False
    payload = json.dumps({
        "key": tag_id
    })
    response = requests.request("POST", url, headers=headers, data=payload)
    isVerified = json.loads(response.text)["isVerified"]
    return isVerified


def blink():
    global id, data
    # 10s = 50*[2*sleep(0.1)]
    for _ in range(50):
        GPIO.output(RED, GPIO.HIGH)
        GPIO.output(SPEAKER, GPIO.HIGH)
        sleep(0.1)
        GPIO.output(RED, GPIO.LOW)
        GPIO.output(SPEAKER, GPIO.LOW)
        sleep(0.1)
        # Read NFC without blocking the function
        id, data = nfc_reader.read_no_block()
        if id is not None:
            isVerified = verify_tag(id)
            if not isVerified:
                print("Unverified tag detected. You can verify it in the admin panel.")
                return False
            print("Tag verified.")

            # If NFC tag was read exit the blink function
            return True
    return False


# MAIN()
try:
    while True:
        print("Alarm OFF. Scan NFC tag to activate")
        # If admin card was read exit the program
        if id == 909014932207:
            GPIO.output(GREEN, GPIO.LOW)
            GPIO.output(RED, GPIO.LOW)
            GPIO.output(SPEAKER, GPIO.LOW)
            break
        # Set GREEN to ON
        GPIO.output(36, GPIO.HIGH)
        # Wait for alarm activation
        id, data = nfc_reader.read()
        isVerified = verify_tag(id)
        if not isVerified:
            sleep(2)
            continue  # Scan again. The tag used is waiting to be authorized via the web app

        GPIO.output(GREEN, GPIO.LOW)
        sleep(1)
        GPIO.output(GREEN, GPIO.HIGH)
        sleep(1)
        GPIO.output(GREEN, GPIO.LOW)
        armed = True
        # Blink GREEN for 10s
        for i in range(20):
            id, data = nfc_reader.read_no_block()
            if id is not None:
                isVerified = verify_tag(id)
                if isVerified:
                    print("Activation canceled")
                    armed = False
                    GPIO.output(GREEN, GPIO.LOW)
                    break

            GPIO.output(GREEN, GPIO.HIGH)
            sleep(0.25)
            GPIO.output(GREEN, GPIO.LOW)
            sleep(0.25)
        if not armed:
            sleep(2)
            continue
        GPIO.output(RED, GPIO.HIGH)
        print("Alarm armed")
        while True:
            # Check if motion sensor detects a motion
            if GPIO.input(MOTION_SENSOR):
                print("Motion detected! Scan your NFC tag!")
                # Start blinking red light
                if blink():
                    # If the function returned True it read a correct key
                    print("Alarm disarmed")
                    GPIO.output(GREEN, GPIO.HIGH)
                    sleep(2)
                    break
                else:
                    GPIO.output(GREEN, GPIO.LOW)
                    GPIO.output(RED, GPIO.HIGH)
                    GPIO.output(SPEAKER, GPIO.HIGH)
                    print("ALARM")
                    requests.request("POST", log_url, headers=headers)

                    tries = 0
                    while True:
                        # Exit after 3 tries (avoid infinite siren)
                        if tries >= 3:
                            break
                        id, data = nfc_reader.read()
                        tries += 1
                        isVerified = verify_tag(id)
                        if isVerified:
                            GPIO.output(RED, GPIO.LOW)
                            GPIO.output(SPEAKER, GPIO.LOW)
                            print("Alarm deactivated.")
                            sleep(2)
                            break
                    break
finally:
    GPIO.cleanup()
