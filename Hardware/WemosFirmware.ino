#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SimpleDHT.h>

// WiFi Parameters
const char* ssid = "...";  //wifi ssid 
const char* password ="..."; //wifi password 

//Bi-color LED pins
#define redLED 12
#define greenLED 16
#define GND 14

#define INTERVAL            3         //amount of temporary values
#define dispAVG_INTERVAL      3         // amount of measurements
#define sensors_INTERVAL     10000     //time to new measurement

//DHT humidity/temperature sensor
int pinDHT22 = 2;
SimpleDHT22 dht22;

float DHTtemperature = 0;
float DHThumidity = 0;
int err = SimpleDHTErrSuccess;        //DHT error return
float tmpT[INTERVAL];      // array of temporary values 
float avgT;                // average temp
int iTmp = 0;             //index of temporary values
int dispAVG = -2;          //average values will be printed to serial monitor


int sensorValue;          //LDR (Light dependant resistor) value

int tmpH[INTERVAL];      // array of temporary values
int avgH;               // temporary humidity

int brightness;          //brightness
int avgB;                //average brightness
int tmpB[INTERVAL];      //array of temporary brightness

os_timer_t timJSONalive; //timer for JSONalive message

struct JSONvalues
{
  String id;
  String token;
};
  
//--------------------------------------------setup------------------------------------------------------------
void setup() 
{
    Serial.begin(115200);         // Start the Serial communication to send messages to the computer
  
    os_timer_setfn(&timJSONalive, JSONalive, NULL);     // starting of timer
    os_timer_arm(&timJSONalive, 1800000, true); 
  
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
    
    // Wait for the Wi-Fi to connect
    while (WiFi.status() != WL_CONNECTED) 
    {
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


//------------------------------------loop------------------------------------------------------------------------------
void loop()
{
 
    if (WiFi.status() != WL_CONNECTED) //Check WiFi connection status
    { 
        Serial.println("Error in WiFi connection");
      
        WiFi.begin(ssid, password);             // Connect to the network
        Serial.print("Reconnecting...");
        while (WiFi.status() != WL_CONNECTED)  // Wait for the Wi-Fi to connect
        {   
            digitalWrite(redLED, HIGH);
            delay(250);
            digitalWrite(redLED, LOW);
            delay(250);
        }
    } 
    
    GetSensorsData();
}


//------------------------------------GetSensorsData------------------------------------------------------------------------------
void GetSensorsData() 
{
    if ((err = dht22.read2(pinDHT22, &DHTtemperature, &DHThumidity, NULL)) != SimpleDHTErrSuccess) 
    {
        Serial.print("Read DHT22 failed, err="); 
        Serial.println(err); 
        delay(2000); //just error things
        
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

    sensorValue = analogRead(A0);       // read the value from LDR
    brightness = sensorValue;  
    brightness = map(brightness, 0, 1023, 0, 100); // maps the values on 0 - 100 scale


    tmpT[iTmp] = DHTtemperature;
    tmpH[iTmp] = DHThumidity;
    tmpB[iTmp] = brightness;
    iTmp++;
    if (iTmp > (INTERVAL - 1)) iTmp = 0;     // ak je index pola hodnot vacsi ako 2 vynuluje ho

    avgT = 0;
    avgH = 0;
    avgB = 0;
    
    for (int i = 0; i < INTERVAL; i++) // spocitame vsetky ulozene teploty
    {
        avgT = avgT + tmpT[i];
        avgH = avgH + tmpH[i];
        avgB = avgB + tmpB[i];
    }
    avgT = avgT / INTERVAL;
    avgH = avgH / INTERVAL;
    avgB = avgB / INTERVAL;
  
    float avgTT = avgT * 10;
    int TmpavgT = (int) avgTT;
    avgT = (float) TmpavgT / 10; //zaokruhli na 1 desatinne miesta
  
  
  
    // displaying the values on serial monitor
    if (dispAVG == 0)
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
        if (dispAVG > (dispAVG_INTERVAL - 1))
        {
            dispAVG = 0; // if dispAVG is bigger then interval for averiging then it displays values on serial monitor and reset
        }
    }

    delay(sensors_INTERVAL); //time interval for sensors
    
}

//-----------------------------------------------parseToken--------------------------------------------
const String parseToken(String parsedMessage)
{
    DynamicJsonBuffer jsonToken;
    JsonObject& root = jsonToken.parseObject(parsedMessage);
    String token = root["token"];  
     
    return token;
}

//-----------------------------------------------parseId-----------------------------------------------
const String parseId(String parsedMessage)
{
    DynamicJsonBuffer jsonToken;
    JsonObject& root = jsonToken.parseObject(parsedMessage);
    String id = root["id"];  
     
    return id;
} 

//-----------------------------------------------JSONconnect-------------------------------------------
struct JSONvalues JSONconnect()
{
    struct JSONvalues values;
      
    StaticJsonBuffer<100> JSONconnect;     //Declaring static JSON buffer
    JsonObject& connecT = JSONconnect.createObject(); 
    connecT["id"] = 0;
    char connectMessage [100];
    connecT.prettyPrintTo(connectMessage, sizeof(connectMessage));

    HTTPClient http;
        
    http.begin("http://iot.gjar-po.sk/api/v1/connect");     //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");      //specifikuje ze ide o json
       
    int httpConnect = http.POST(connectMessage);       //posle request
    String payloadConnect = http.getString(); 
    Serial.println(httpConnect);                       //Print HTTP return code
    Serial.println(payloadConnect);                    //Print request response payload 
    http.end();

    values.token = parseToken(payloadConnect);
    values.id = parseId(payloadConnect);
            
    return  values;
}
 
//-----------------------------------------------JSONapprove------------------------------------------------------------  
void JSONapprove(struct JSONvalues values)
{   
    String ap = "approve";
    String idStr = values.id;
    String roomStr  = "16"; //room id
    String approvePar = ap+" "+idStr+" "+roomStr;
    
    DynamicJsonBuffer JSONapprove;
    JsonObject& approve = JSONapprove.createObject();
    approve["token"] = "...";
    approve["command"] = (approvePar);
    char approveMessage[300];
    approve.prettyPrintTo(approveMessage, sizeof(approveMessage));
    Serial.println(approveMessage);      

    HTTPClient http; 
     
    http.begin("http://iot.gjar-po.sk/api/v1/command");         //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");         //specifikuje ze ide o json   

    int httpApprove = http.POST(approveMessage);            //posle request
    String payloadApprove = http.getString();               //Get the response payload
    Serial.println(httpApprove);            //Print HTTP return code
    Serial.println(payloadApprove);         //Print request response payload
 
    http.end();  //Close connection
}

//-----------------------------------------------JSONdata------------------------------------------------------------  
void JSONdata() 
{  
    struct JSONvalues values = JSONconnect();
    JSONapprove(values);
    
    DynamicJsonBuffer JSONdata;
    JsonObject& data = JSONdata.createObject();
    data["token"] = values.token;
    JsonObject& dataObject = data.createNestedObject("data");     
    dataObject["humidity"] = (avgH);
    dataObject["temperature"] = (avgT);
    dataObject["brightness"] = (avgB);
    char dataMessage[300];
    data.prettyPrintTo(dataMessage, sizeof(dataMessage));
    Serial.println(dataMessage);
   
    HTTPClient http; 
 
    http.begin("http://iot.gjar-po.sk/api/v1/data");          //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");      //specifikuje ze ide o json   

    int httpData = http.POST(dataMessage);       //posle request
    String payloadData = http.getString();       //Get the response payload
    Serial.println(httpData);                   //Print HTTP return code
    Serial.println(payloadData);                //Print request response payload
 
    http.end();
}

//-----------------------------------------------JSONerror------------------------------------------------------------
void JSONerror()
{  
    StaticJsonBuffer<100> JSONerror;
    JsonObject& error = JSONerror.createObject();
    error["id"] = 0;
    error["level"] = "ERROR";
    char errorMessage[100];
    error.prettyPrintTo(errorMessage, sizeof(errorMessage));

    HTTPClient http;
 
    http.begin("http://iot.gjar-po.sk/api/v1/error");           //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");         //specifikuje ze ide o json   

    int httpData = http.POST(errorMessage);             //posle request
    String payloadData = http.getString();              //Get the response payload
    Serial.println(httpData);                           //Print HTTP return code
    Serial.println(payloadData);                        //Print request response payload
 
    http.end();
}

//-----------------------------------------------JSONalive------------------------------------------------------------
void JSONalive(void *pArg) 
{ 
    struct JSONvalues values = JSONconnect();
    JSONapprove(values);
    
    StaticJsonBuffer<100> JSONalive;
    JsonObject& alive = JSONalive.createObject();
    alive["token"]  = values.token;
    char aliveMessage[100];
    alive.prettyPrintTo(aliveMessage, sizeof(aliveMessage));

    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://iot.gjar-po.sk/api/v1/error");           //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");         //specifikuje ze ide o json   

    int httpData = http.POST(aliveMessage);                     //posle request
    String payloadData = http.getString();                      //Get the response payload
    Serial.println(httpData);                                   //Print HTTP return code
    Serial.println(payloadData);                                //Print request response payload
 
    http.end();
    
}

//-----------------------------------------------JSONroom------------------------------------------------------------    
void JSONroom()
{
    struct JSONvalues values = JSONconnect();
  
    DynamicJsonBuffer JSONroom;
    JsonObject& room= JSONroom.createObject();
    room["token"] = "...";
    room["command"] = "candidates";
    char roomMessage[300];
    room.prettyPrintTo(roomMessage, sizeof(roomMessage));
    Serial.println(roomMessage);

    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://iot.gjar-po.sk/api/v1/command");          //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");          //specifikuje ze ide o json   

    int httpRoom = http.POST(roomMessage);           //posle request
    String payloadRoom = http.getString();           //Get the response payload
    Serial.println(httpRoom);                       //Print HTTP return code
    Serial.println(payloadRoom);                    //Print request response payload
 
    http.end();
    
    JSONapprove(values);
}
