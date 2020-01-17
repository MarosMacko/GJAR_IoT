#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SimpleDHT.h>

// WiFi Parameters
const char* ssid = "...";  //wifi ssid 
const char* password ="..."; //wifi password 

//Node parameters
int nodeId = 0;
const char* nodeToken = "...";

//Bi-color LED pins
#define redLED 12
#define greenLED 16
#define GND 14

#define AVERAGES                3           //amount of temporary values
#define send_INTERVAL           10*1000     //time to new measurement (in miliseconds)
#define delay_INTERVAL          10*1000     //time between measurement values to average

//DHT humidity/temperature sensor
int pinDHT22 = 2;
SimpleDHT22 dht22;

float DHTtemperature = 0;
float DHThumidity = 0;
int err = SimpleDHTErrSuccess;        //DHT error return
float tmpT[AVERAGES];       // array of temporary values 
float avgT;                 // average temp

int tmpH[AVERAGES];         // array of temporary values
int avgH;                   // temporary humidity

int brightness;             //brightness
int avgB;                   //average brightness
int tmpB[AVERAGES];         //array of temporary brightness

os_timer_t timJSONalive;    //timer for JSONalive message

struct JSONvalues
{
  String id;
  String token;
};

void blinkLed(int led, int delay)
{
    digitalWrite(led, HIGH);
    delay(delay);
    digitalWrite(led, LOW);    
}
  
//--------------------------------------------setup------------------------------------------------------------
void setup() 
{
    Serial.begin(115200);
  
    os_timer_setfn(&timJSONalive, JSONalive, NULL);     // starting of timer
    os_timer_arm(&timJSONalive, 1800000, true); 
  
    delay(10);
    
    pinMode(redLED, OUTPUT);
    pinMode(greenLED, OUTPUT);
    pinMode(pinDHT22 ,INPUT_PULLUP);
    pinMode(GND, OUTPUT);
    
    digitalWrite(GND, LOW);
    
    Serial.println('\n');
    
    WiFi.begin(ssid, password);
    
    Serial.print("Connecting to ");
    Serial.print(ssid);
    Serial.println(" ... ");
    
    // Wait for the Wi-Fi to connect
    delay(1000);
    while (WiFi.status() != WL_CONNECTED) 
    {
        blinkLed(redLED, 500);
    }
    
    digitalWrite(greenLED, HIGH);
    digitalWrite(redLED, LOW);
  
    Serial.println('\n');
    Serial.println("Connection established!");  
    Serial.print("IP address:\t");
    Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer
    Serial.println("----START----");
 
}

//------------------------------------loop------------------------------------------------------------------------------
void loop()
{
 
    if (WiFi.status() != WL_CONNECTED) //Check WiFi connection status
    { 
        Serial.println("Error in WiFi connection");
      
        WiFi.begin(ssid, password);             // Connect to the network
        Serial.print("Reconnecting...");
        while (WiFi.status() != WL_CONNECTED)   // Wait for the Wi-Fi to connect
        {   
            blinkLed(redLED, 500);
        }
    } 
    
    GetSensorsData();
    SendData();
    
    delay(send_INTERVAL - (delay_INTERVAL * AVERAGES)); //time interval for sending data
}


//------------------------------------GetSensorsData------------------------------------------------------------------------------
void GetSensorsData() 
{
    avgT = 0;
    avgH = 0;
    avgB = 0;
    
    for(int iTmp=0; iTmp<AVERAGES; iTmp++)
    {
        //DHT22 temb & humidity reading
        if ((err = dht22.read2(pinDHT22, &DHTtemperature, &DHThumidity, NULL)) != SimpleDHTErrSuccess) 
        {
            Serial.print("Read DHT22 failed, err="); 
            Serial.println(err); 
            delay(2000); //just error things
            
            digitalWrite(greenLED, LOW);
            blinkLed(redLED, 200);
            blinkLed(redLED, 200);
            blinkLed(redLED, 200);
            digitalWrite(greenLED, HIGH);
            
            JSONerror(); // send error message to server
            return;
        }
        
        //LDR brightness reading
        brightness = analogRead(A0);       // read the value from LDR 
        brightness = map(brightness, 0, 1023, 0, 100); // maps the values on 0 - 100 scale

        tmpT[iTmp] = DHTtemperature;
        tmpH[iTmp] = DHThumidity;
        tmpB[iTmp] = brightness;
        
        delay(delay_INTERVAL);
    }
    
    
    for (int i = 0; i < INTERVAL; i++) //Calc average
    {
        avgT = avgT + tmpT[i];
        avgH = avgH + tmpH[i];
        avgB = avgB + tmpB[i];
    }
    
    avgT = avgT / AVERAGES;
    avgH = avgH / AVERAGES;
    avgB = avgB / AVERAGES;
  
    avgT = ((int)(avgT*10)) / 10; //zaokruhli na 1 desatinne miesto
}

void SendData()
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

    // Send data
    JSONdata();    
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

//-----------------------------------------------JSONdata----------------------------------------------
void JSONdata() 
{  
    DynamicJsonBuffer JSONdata;
    JsonObject& data = JSONdata.createObject();
    data["token"] = nodeToken;
    JsonObject& dataObject = data.createNestedObject("data");     
    dataObject["humidity"] = (avgH);
    dataObject["temperature"] = (avgT);
    dataObject["brightness"] = (avgB);
    char dataMessage[300];
    data.prettyPrintTo(dataMessage, sizeof(dataMessage));
    Serial.println(dataMessage);
   
    HTTPClient http; 
 
    http.begin("http://iot.gjar-po.sk/api/v1/data");        //prikaz zmenit na daco ine napr. connect
    http.addHeader("Content-Type", "application/json");     //specifikuje ze ide o json   

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

    StaticJsonBuffer<100> JSONalive;
    JsonObject& alive = JSONalive.createObject();
    alive["token"]  = nodeToken;
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
