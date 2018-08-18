#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <SimpleDHT.h> //kniznica k DHT

// WiFi Parameters
const char* ssid = "***REMOVED***";
const char* password = "***REMOVED***";
#define redLED 5
#define greenLED 4

int pinDHT22 = 2;   //DHT pin je D4
SimpleDHT22 dht22; // typ DHT je DHT22

#define INTERVAL    3 // pocet docastnych hodnot na priemerovanie
#define dispAVG_INTERVAL  3 // po kolkych meraniach sa posiela priemer teploty
#define sensors_INTERVAL 2500 //cas pokial senzory nameraju nove hodnoty
#define EEPROM_size 512 //velkost EEPROMu
#define EEPROM_INTERVAL 3 //pocet zalohovanych merani

float DHTtemperature = 0;  //vynulovanie zaciatocnej meranej teploty
float DHThumidity = 0;     //vynulovanie zaciatocnej meranej vlhkosti
int err = SimpleDHTErrSuccess;  // sprava ak meranie bude chybne

int sensorValue;  //citana hodnota z LDR

float tmpT[INTERVAL];  // docastna hodnota, z kt. sa bude pocitat priemer
float avgT;            // priemerna teplota;
int iTmp = 0;         //index docasnej hodnoty
int dispAVG = 0;      //zobrazi priemerne hodnoty ked disAVG bude rovne nule

float tmpH[INTERVAL];  // docastna hodnota, z kt. sa bude pocitat priemer
float avgH;           // priemerna vlhkost;

float voltage = 0;  //vynulovanie pociatocneho napatia
float avgV;            //priemerne napatie
float tmpV[INTERVAL];  //docastna hodnota, z kt. sa bude pocitat priemer

void setup() {
  Serial.begin(115200);         // Start the Serial communication to send messages to the computer
  delay(10);
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  Serial.println('\n'); 
  WiFi.begin(ssid, password);             // Connect to the network
  Serial.print("Connecting to ");
  Serial.print(ssid); Serial.println(" ...");

  int i = 0;
  while (WiFi.status() != WL_CONNECTED) { // Wait for the Wi-Fi to connect
    
    digitalWrite(redLED, HIGH);
  delay(250);
  digitalWrite(redLED, LOW);
  delay(250);
  }
  digitalWrite(greenLED, HIGH);
    digitalWrite(redLED, LOW);

  
  Serial.println('\n');
  Serial.println("Connection established!");  
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer

}
void loop(){
if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
    StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
    JsonObject& JSONencoder = JSONbuffer.createObject(); 
 
    JSONencoder["id"] = 0;
    JSONencoder["token"] = "dd431e8fd96bf3dfabba88184810f9ba521f5f9b6b2d6288572a7599f4143c09";
    
 
    char JSONmessageBuffer[300];
    JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    Serial.println(JSONmessageBuffer);
 
    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://87.197.127.131:8828/api/v1/prikaz");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json
 
    int httpCode = http.POST(JSONmessageBuffer);   //posle request
    String payload = http.getString();                                        //Get the response payload
 
    Serial.println(httpCode);   //Print HTTP return code
    Serial.println(payload);    //Print request response payload
 
    http.end();  //Close connection
 
  } else {
 
    Serial.println("Error in WiFi connection");
 
  }
 
  delay(30000);  //Send a request every 30 seconds
  GetSensorsData();// volanie funkcie na meranie hodnot zo senzorov

}

void GetSensorsData() {
  //nacitanie dat z DHT a vyhodnotenie cimeranie bolo uspesne
  if ((err = dht22.read2(pinDHT22, &DHTtemperature, &DHThumidity, NULL)) != SimpleDHTErrSuccess) {
    Serial.print("Read DHT22 failed, err="); Serial.println(err); delay(2000);
    return;
  }

  sensorValue = analogRead(A0);   // nacita hodnotu z LDR
  voltage = sensorValue * (3.0 / 1023.0);   // prepocita hodnotu na V


  tmpT[iTmp] = DHTtemperature; //ulozi teplotu do pola teplot
  tmpH[iTmp] = DHThumidity;   //ulozi vlhkost do pola vlhkosti
  tmpV[iTmp] = voltage;       //ulozi napatie do pola napatia
  iTmp++;                     //zvysenie indexu pola nameranych hodnot
  if (iTmp > (INTERVAL - 1)) iTmp = 0; // ak je index pola hodnot vacsi ako 2 vynuluje ho


  avgT = 0; //vynuluje sa priemerna teplota
  avgH = 0; //vynuluje sa priemerna vlhkost
  avgV = 0; //vynuluje sa priemerne napatie
  for (i = 0; i < INTERVAL; i++) // spocitame vsetky ulozene teploty
  {
    avgT = avgT + tmpT[i]; //scitanie hodnot teploty
    avgH = avgH + tmpH[i]; //scitanie hodnot vlhkosti
    avgV = avgV + tmpV[i]; //scitanie hodnot napatia
  }
  avgT = avgT / INTERVAL; //priemerna teplota je podiel spocitanych teplot s ich poctom
  avgH = avgH / INTERVAL; //priemerna vlhkost je podiel spocitanych vlhkosti s ich poctom
  avgV = avgV / INTERVAL; //priemerne napatie je podiel spocitanych napati s ich poctom

  if (dispAVG == 0) // ak dispAVG je nula zobrazi priemerne hodnoty
  {
      Serial.println("--------------------------");
      Serial.print("AVG Temp: ");
      Serial.print(avgT);
      Serial.println(" °C ");
      Serial.print("AVG Hum: ");
      Serial.print(avgH);
      Serial.println(" %  ");
      Serial.print("AVG Voltage: ");
      Serial.print(avgV);
      Serial.println(" V");
      Serial.println("--------------------------");

      
 
  /*for (iE = 0; iE < EEPROM_INTERVAL; iE++){
    
    EEPROM.put(addressT[IET], avgT);// zapisem do EEPROMu priemernu teplotu
    EEPROM.get(addressT[IET],T);
    IET++;
    
    EEPROM.put(addressH[IEH], avgH);// zapisem do EEPROMu priemernu vlhkost
    EEPROM.get(addressH[IEH],H);
    IEH++;
    
    EEPROM.put(addressV[IEV], avgV);// zapisem do EEPROMu priemerne napatie
    EEPROM.get(addressV[IEV],V);
    IEV++;

    if(iE == EEPROM_INTERVAL-1){
    iE = 0;
    IET = 0;
    IEH = 3;
    IEV = 6;
    }
  }
  Serial.println(T);
  Serial.println(H);
  Serial.println(V);*/
  
    dispAVG++;
  }
  else //ak je dispAVG iny ako 0 neprebehne zobrazenie priemernych hodnot
  {
    dispAVG++;
    if (dispAVG > (dispAVG_INTERVAL - 1)) dispAVG = 0; // ak dispAVG dosiahne hodnotu pri ktorej sa ma zobrazit priemerna hodnota dispAVG vynuluje
  }


  delay(sensors_INTERVAL); //cas pokial senzory nameraju nove hodnoty
}
