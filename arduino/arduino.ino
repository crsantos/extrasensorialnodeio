/* 
  extrasensorialnode arduino
*/

// pin numbers:
const int ledPin =  13;      // the number of the LED pin

// Variables
int ledState = LOW;             // ledState used to set the LED
long previousMillis = 0;        // will store last time LED was updated
long interval = 1000;           // interval at which to blink (milliseconds)

void setup() {
  pinMode(ledPin, OUTPUT);      // set the digital pin as output:
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
      Serial.println("Hello world from arduino!");  // prints hello with ending line break
    }else
      ledState = LOW;
    digitalWrite(ledPin, ledState);
  }
}
