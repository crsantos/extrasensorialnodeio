/* 
  extrasensorialnode arduino
*/

// pin numbers:
const int ledPin =  13;       // the number of the LED pin
const int lightPin = 0;       //define a pin for Photo resistor
const int threshold = 250;

// Variables
int ledState = LOW;             // ledState used to set the LED
long previousMillis = 0;        // will store last time LED was updated
long interval = 2000;           // interval at which to blink (milliseconds)

void setup() {
  pinMode(ledPin,   OUTPUT);      // set the digital pin as output:
  Serial.begin(9600);
}

void loop()
{
  // For now it's just blinking the LED and sending an Hello World through serial connection
  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis > interval) {
    previousMillis = currentMillis;



    if (ledState == LOW){
      ledState = HIGH;
      Serial.print("{\"thermistor\" : ");  // prints hello with ending line break
      Serial.print(analogRead(lightPin), DEC);
      Serial.println("}");
    }else
      ledState = LOW;
    digitalWrite(ledPin, ledState);
  }
}

