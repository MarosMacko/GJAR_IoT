#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SimpleDHT.h> //kniznica k DHT

// WiFi Parameters
const char* ssid = "...";
const char* password = "...";

#define redLED 12
#define greenLED 16
#define GND 14

int pinDHT22 = 2;   //DHT pin je D4
SimpleDHT22 dht22; // typ DHT je DHT22

#define INTERVAL    3 // pocet docastnych hodnot na priemerovanie
#define dispAVG_INTERVAL  3 // po kolkych meraniach sa posiela priemer teploty
#define sensors_INTERVAL 10000 //cas pokial senzory nameraju nove hodnoty
#define EEPROM_size 512 //velkost EEPROMu
#define EEPROM_INTERVAL 3 //pocet zalohovanych merani

float DHTtemperature = 0;  //vynulovanie zaciatocnej meranej teploty
float DHThumidity = 0;     //vynulovanie zaciatocnej meranej vlhkosti
int err = SimpleDHTErrSuccess;  // sprava ak meranie bude chybne

int sensorValue;  //citana hodnota z LDR

float tmpT[INTERVAL];  // docastna hodnota, z kt. sa bude pocitat priemer
float avgT;            // priemerna teplota;
int iTmp = 0;         //index docasnej hodnoty
int dispAVG = -2;      //zobrazi priemerne hodnoty ked disAVG bude rovne nule

float tmpH[INTERVAL];  // docastna hodnota, z kt. sa bude pocitat priemer
float avgH;           // priemerna vlhkost;

int brightness = 0;  //vynulovanie pociatocneho napatia
int avgB;            //priemerne napatie
int tmpB[INTERVAL];  //docastna hodnota, z kt. sa bude pocitat priemer

os_timer_t timJSONalive;

void setup() {
  Serial.begin(115200);         // Start the Serial communication to send messages to the computer
  
  os_timer_setfn(&timJSONalive, JSONalive, NULL);     // spustenie a nastavernie Timera pre snimanie teploty a spol.
  os_timer_arm(&timJSONalive,1800000, true); 
  
  delay(10);
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(pinDHT22 ,INPUT_PULLUP);
  pinMode(GND, OUTPUT);
  digitalWrite(GND, LOW);
  Serial.println('\n'); 
  WiFi.begin(ssid, password);             // Connect to the network
  Serial.print("Connecting to ");
  Serial.print(ssid);
  Serial.println(" ... ");

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
  Serial.println("----START----");
 

}
void loop(){
 
if (WiFi.status() != WL_CONNECTED) { //Check WiFi connection status
    Serial.println("Error in WiFi connection");
  } 
  GetSensorsData();// volanie funkcie na meranie hodnot zo senzorov
}

void GetSensorsData() {
  //nacitanie dat z DHT a vyhodnotenie cimeranie bolo uspesne
  if ((err = dht22.read2(pinDHT22, &DHTtemperature, &DHThumidity, NULL)) != SimpleDHTErrSuccess) {
    Serial.print("Read DHT22 failed, err="); 
    Serial.println(err); delay(2000);
  digitalWrite(greenLED, LOW);
  digitalWrite(redLED, HIGH);
  delay(100);
  digitalWrite(redLED, LOW);
  delay(100);
  digitalWrite(redLED, HIGH);
  delay(100);
  digitalWrite(redLED, LOW);
  digitalWrite(redLED, HIGH);
  delay(100);
  digitalWrite(redLED, LOW);
  digitalWrite(greenLED, HIGH);
  JSONerror();
    return;
  }

  sensorValue = analogRead(A0);   // nacita hodnotu z LDR
  brightness = sensorValue;  
  brightness = map(brightness, 0, 1023, 0, 100);


  tmpT[iTmp] = DHTtemperature; //ulozi teplotu do pola teplot
  tmpH[iTmp] = DHThumidity;   //ulozi vlhkost do pola vlhkosti
  tmpB[iTmp] = brightness;       //ulozi napatie do pola napatia
  iTmp++;                     //zvysenie indexu pola nameranych hodnot
  if (iTmp > (INTERVAL - 1)) iTmp = 0; // ak je index pola hodnot vacsi ako 2 vynuluje ho


  avgT = 0; //vynuluje sa priemerna teplota
  avgH = 0; //vynuluje sa priemerna vlhkost
  avgB = 0; //vynuluje sa priemerne napatie
  for (int i = 0; i < INTERVAL; i++) // spocitame vsetky ulozene teploty
  {
    avgT = avgT + tmpT[i]; //scitanie hodnot teploty
    avgH = avgH + tmpH[i]; //scitanie hodnot vlhkosti
    avgB = avgB + tmpB[i]; //scitanie hodnot napatia
  }
  avgT = avgT / INTERVAL; //priemerna teplota je podiel spocitanych teplot s ich poctom
  avgH = avgH / INTERVAL; //priemerna vlhkost je podiel spocitanych vlhkosti s ich poctom
  avgB = avgB / INTERVAL; //priemerne napatie je podiel spocitanych napati s ich poctom
  
  float avgTT = avgT * 100;
  int TmpavgT = (int) avgTT;
  avgT = (float) TmpavgT / 100; //zaokruhli na 2 desatinne miesta
  float avgHT = avgH * 100;
  int TmpavgH = (int) avgHT;
  avgH = (float) TmpavgH / 100; //zaokruhli na 2 desatinne miesta
 // float avgBT = avgB * 10;
  // int avgB = (int) avgB;
 // avgB = (float) TmpavgB / 10; //zaokruhli na 1 desatinne miesto
  
  

  if (dispAVG == 0) // ak dispAVG je nula zobrazi priemerne hodnoty
  {
      Serial.println("--------------------------");
      Serial.print("AVG Temp: ");
      Serial.print(avgT);
      Serial.println(" °C ");
      Serial.print("AVG Hum: ");
      Serial.print(avgH);
      Serial.println(" %  ");
      Serial.print("AVG Light: ");
      Serial.print(avgB);
      Serial.println(" %  ");
      Serial.println("--------------------------");
      JSONdata();
    dispAVG++;
    
   /* if (avgT > 0 && avgH > 0 && avgV > 0){
      JSONdata();
      }else{
        Serial.println("Namerane hodnoty su chybne!");
        digitalWrite(greenLED, LOW);
        digitalWrite(redLED, HIGH);
        delay(15000);
        digitalWrite(greenLED, HIGH);
        digitalWrite(redLED, LOW);
        JSONerror();
        }
  */
  }
  else //ak je dispAVG iny ako 0 neprebehne zobrazenie priemernych hodnot
  {
    dispAVG++;
    if (dispAVG > (dispAVG_INTERVAL - 1)){
      dispAVG = 0; // ak dispAVG dosiahne hodnotu pri ktorej sa ma zobrazit priemerna hodnota dispAVG vynuluje
    }
  }


  delay(sensors_INTERVAL); //cas pokial senzory nameraju nove hodnoty
}

void JSONdata() {
   StaticJsonBuffer<100> JSONconnect;   //Declaring static JSON buffer
    JsonObject& connecT = JSONconnect.createObject(); 
    connecT["id"] = 0;
    char connectMessage [100];
    connecT.prettyPrintTo(connectMessage, sizeof(connectMessage));

    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://iot.gjar-po.sk/api/v1/connect");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json

    
    int httpConnect = http.POST(connectMessage);   //posle request
    String payloadConnect = http.getString();                                        //Get the response payload
    Serial.println(httpConnect);   //Print HTTP return code
    Serial.println(payloadConnect);    //Print request response payload
 
    http.end();  //Close connection
    DynamicJsonBuffer jsonToken;
    JsonObject& root = jsonToken.parseObject(payloadConnect);
      // Parameters
     String token = root["token"]; 
      Serial.print("New token: ");
      Serial.println(token);
  
    DynamicJsonBuffer JSONdata;
    JsonObject& data = JSONdata.createObject();
    data["token"] = (token);
    JsonArray& dataObject = data.createNestedArray("data");  
    JsonObject& objectD = dataObject.createNestedObject();    
    objectD["humidity"] = (avgH);
    objectD["temperature"] = (avgT);
    objectD["brightness"] = (avgB);
    char dataMessage[300];
    data.prettyPrintTo(dataMessage, sizeof(dataMessage));
    Serial.println(dataMessage);
   
 
 
    http.begin("http://iot.gjar-po.sk/api/v1/data");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json   

    int httpData = http.POST(dataMessage);   //posle request
    String payloadData = http.getString();                                        //Get the response payload
    Serial.println(httpData);   //Print HTTP return code
    Serial.println(payloadData);    //Print request response payload
 
    http.end();  //Close connection
   }

void JSONerror(){
  
    StaticJsonBuffer<100> JSONerror;
    JsonObject& error = JSONerror.createObject();
    error["id"] = 0;
    error["level"] = "ERROR";
    char errorMessage[100];
    error.prettyPrintTo(errorMessage, sizeof(errorMessage));

    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://iot.gjar-po.sk/api/v1/error");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json   

    int httpData = http.POST(errorMessage);   //posle request
    String payloadData = http.getString();                                        //Get the response payload
    Serial.println(httpData);   //Print HTTP return code
    Serial.println(payloadData);    //Print request response payload
 
    http.end();  //Close connection
  }

  void JSONalive(void *pArg) {
    StaticJsonBuffer<100> JSONconnect;   //Declaring static JSON buffer
    JsonObject& connecT = JSONconnect.createObject(); 
    connecT["id"] = 0;
    char connectMessage [100];
    connecT.prettyPrintTo(connectMessage, sizeof(connectMessage));

    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://iot.gjar-po.sk/api/v1/connect");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json

    
    int httpConnect = http.POST(connectMessage);   //posle request
    String payloadConnect = http.getString();                                        //Get the response payload
    Serial.println(httpConnect);   //Print HTTP return code
    Serial.println(payloadConnect);    //Print request response payload
 
   
    DynamicJsonBuffer jsonToken;
    JsonObject& root = jsonToken.parseObject(payloadConnect);
      // Parameters
     String token = root["token"]; 
      Serial.print("New token: ");
      Serial.println(token);
     http.end();
     StaticJsonBuffer<100> JSONalive;
    JsonObject& alive = JSONalive.createObject();
    alive["token"]  = (token);
    char aliveMessage[100];
    alive.prettyPrintTo(aliveMessage, sizeof(aliveMessage));

    
 
    http.begin("http://iot.gjar-po.sk/api/v1/error");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json   

    int httpData = http.POST(aliveMessage);   //posle request
    String payloadData = http.getString();                                        //Get the response payload
    Serial.println(httpData);   //Print HTTP return code
    Serial.println(payloadData);    //Print request response payload
 
    http.end();  //Close connection
    
    }
