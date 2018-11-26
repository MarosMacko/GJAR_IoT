#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SimpleDHT.h> //library to DHT sensor

// WiFi Parameters
const char* ssid = "Trpak";  //wifi ssid
const char* password = "naseauto"; //wifi password

#define redLED 12 //pins to bicolorled
#define greenLED 16 //pins to bicolorled
#define GND 14 //pins to bicolorled

int pinDHT22 = 2;   //DHT pin  D4
SimpleDHT22 dht22; // type DHT22

#define INTERVAL    3 //amount of temporary values
#define dispAVG_INTERVAL  3 // amount of measurements
#define sensors_INTERVAL 10000 //time to new measurement

float DHTtemperature = 0;  //temperature
float DHThumidity = 0;     //humidity
int err = SimpleDHTErrSuccess;  // message when something goes wrong with DHT

int sensorValue;  //value from LDR 

float tmpT[INTERVAL];  // array of temporary values 
float avgT;            // average temp
int iTmp = 0;         //index of temporary values
int dispAVG = -2;      //average values will be printed to serial monitor

float tmpH[INTERVAL];  // array of temporary values
float avgH;           // temporary humidity

int brightness = 0;  //brightness
int avgB;            //average brightness
int tmpB[INTERVAL];  //array of temporary brightness

os_timer_t timJSONalive; //timer for JSONalive message

void setup() {
  Serial.begin(115200);         // Start the Serial communication to send messages to the computer
  
  os_timer_setfn(&timJSONalive, JSONalive, NULL);     // starting of timer
  os_timer_arm(&timJSONalive,1800000, true); 
  
  delay(10);
  pinMode(redLED, OUTPUT); //declaring things
  pinMode(greenLED, OUTPUT);
  pinMode(pinDHT22 ,INPUT_PULLUP); //pullup pin
  pinMode(GND, OUTPUT);
  digitalWrite(GND, LOW);
  Serial.println('\n'); 
  WiFi.begin(ssid, password);             // Connect to the network
  Serial.print("Connecting to ");
  Serial.print(ssid);
  Serial.println(" ... ");
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
 
JSONroom();
}
void loop(){          //main function
 
if (WiFi.status() != WL_CONNECTED) { //Check WiFi connection status
    Serial.println("Error in WiFi connection");
  } 
  GetSensorsData();// calling the sensors function 
}

void GetSensorsData() {
  if ((err = dht22.read2(pinDHT22, &DHTtemperature, &DHThumidity, NULL)) != SimpleDHTErrSuccess) {
    Serial.print("Read DHT22 failed, err="); 
    Serial.println(err); delay(2000); //just error things
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
  JSONerror(); // send error message to server
    return;
  }

  sensorValue = analogRead(A0);   // read the value from LDR
  brightness = sensorValue;  
  brightness = map(brightness, 0, 1023, 0, 100);// maps the values on 0 - 100 scale


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
  
  

  if (dispAVG == 0) // displaying the values on serial monitor
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
    
  }
  else // if disAVG is different,values will not display on serial monitor
  {
    dispAVG++;
    if (dispAVG > (dispAVG_INTERVAL - 1)){
      dispAVG = 0; // if dispAVG is bigger then interval for averiging then it displays values on serial monitor and reset
    }
  }


  delay(sensors_INTERVAL); //time interval for sensors
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
 
   
    DynamicJsonBuffer jsonToken;
    JsonObject& root = jsonToken.parseObject(payloadConnect);
     int id = root["id"]; 
     String token = root["token"];
     http.end();  

    String ap = "approve";
    String idStr = String(id);
    String roomStr  = "16"; //room id
    String approvePar = ap+" "+idStr+" "+roomStr;
    
    DynamicJsonBuffer JSONapprove;
    JsonObject& approve = JSONapprove.createObject();
    approve["token"] = "71d22f00c6b3f756114c2dfc7606c2446270f73715235aefa7e4adc8768466f8";
    approve["command"] = (approvePar);
    char approveMessage[300];
    approve.prettyPrintTo(approveMessage, sizeof(approveMessage));
    Serial.println(approveMessage);      

    http.begin("http://iot.gjar-po.sk/api/v1/command");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json   

    int httpApprove = http.POST(approveMessage);   //posle request
    String payloadApprove = http.getString();                                        //Get the response payload
    Serial.println(httpApprove);   //Print HTTP return code
    Serial.println(payloadApprove);    //Print request response payload
 
    http.end();  //Close connection
    DynamicJsonBuffer JSONdata;
    JsonObject& data = JSONdata.createObject();
    data["token"] = (token);
    JsonObject& dataObject = data.createNestedObject("data");     
    dataObject["humidity"] = (avgH);
    dataObject["temperature"] = (avgT);
    dataObject["brightness"] = (avgB);
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
    
void JSONroom(){

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
     int id = root["id"]; 
     http.end();
  
    DynamicJsonBuffer JSONroom;
    JsonObject& room= JSONroom.createObject();
    room["token"] = "71d22f00c6b3f756114c2dfc7606c2446270f73715235aefa7e4adc8768466f8";
    room["command"] = "candidates";
    char roomMessage[300];
    room.prettyPrintTo(roomMessage, sizeof(roomMessage));
    Serial.println(roomMessage);
 
    http.begin("http://iot.gjar-po.sk/api/v1/command");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json   

    int httpRoom = http.POST(roomMessage);   //posle request
    String payloadRoom = http.getString();                                        //Get the response payload
    Serial.println(httpRoom);   //Print HTTP return code
    Serial.println(payloadRoom);    //Print request response payload
 
    http.end();  //Close connection

    String ap = "approve";
    String idStr = String(id);
    String roomStr  = "16"; //room id
    String approvePar = ap+" "+idStr+" "+roomStr;
    
    DynamicJsonBuffer JSONapprove;
    JsonObject& approve = JSONapprove.createObject();
    approve["token"] = "71d22f00c6b3f756114c2dfc7606c2446270f73715235aefa7e4adc8768466f8";
    approve["command"] = (approvePar);
    char approveMessage[300];
    approve.prettyPrintTo(approveMessage, sizeof(approveMessage));
    Serial.println(approveMessage);      

    http.begin("http://iot.gjar-po.sk/api/v1/command");      //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");  //specifikuje ze ide o json   

    int httpApprove = http.POST(approveMessage);   //posle request
    String payloadApprove = http.getString();                                        //Get the response payload
    Serial.println(httpApprove);   //Print HTTP return code
    Serial.println(payloadApprove);    //Print request response payload
 
    http.end();  //Close connection
  }
