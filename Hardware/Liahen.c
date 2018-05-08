#include <SimpleDHT.h>
#include <DallasTemperature.h>
#include <LiquidCrystal_I2C.h>
#include <DS3231.h>
#include <EEPROM.h>
#include <MsTimer2.h>

//LCD
LiquidCrystal_I2C lcd(0x3F, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);

//Stepper motor
int smDirectionPin = 2; 	//Direction pin
int smStepPin = 3;      	//Stepper pin
int smEnablePin = 7;    	//Motor enable pin

//DHT vlhkostny senzor
int pinDHT22 = 5;
SimpleDHT22 dht22;
float DHTtemp = 0;
float DHThumidity = 0;

//DS18b20 teplotny senzor
#define DS_PIN 6
OneWire oneWire(DS_PIN);
DallasTemperature sensors(&oneWire);
float DStemp = 0;

//RTC - Real Time Clock
DS3231 Clock;

//piny
#define RELAY1 A2
#define RELAY2 A3
#define BUZZER 13
#define B_PREHEAT 10
#define B_START 11
#define B_STOP 12
#define VENT 9
#define VENT_PWM A0

//EEPROM adresy
#define EEPROM_ROTATION 0
#define EEPROM_TURNS 10
#define EEPROM_STATE 50

//Globalne premenne
float temperature[10];
float humidity[10];
float avgTemp; //priemer teploty
float avgHumidity; 		// priemer vlhkosti
byte curPos = 0; 		//zaznam pre priemerovanie (nevyuzivane)
bool first = true; 		//prvy zaznam = zapis do celeho priemerovacieho pola
byte lastBuzz = 0;
byte ventingFor = 0;

bool ventState = false;
bool force = false;
unsigned int secondsFromLastVent = 0;
unsigned int secondsToNextVent = 0;

byte LastEEPROMcheck = 0;
byte eeprom_state;

bool h12 = false, pm = true;



///////////////////////

void setup()
{

    //DEF
    pinMode(smDirectionPin, OUTPUT);
    pinMode(smStepPin, OUTPUT);
    pinMode(smEnablePin, OUTPUT);

    pinMode(RELAY1, OUTPUT);
    pinMode(RELAY2, OUTPUT);
    pinMode(DS_PIN, INPUT);
    pinMode(B_PREHEAT, INPUT_PULLUP);
    pinMode(B_START, INPUT_PULLUP);
    pinMode(B_STOP, INPUT_PULLUP);
    pinMode(VENT, OUTPUT);
    pinMode(VENT_PWM, OUTPUT);
    pinMode(BUZZER, OUTPUT);

    digitalWrite(smEnablePin, HIGH);
    digitalWrite(VENT, HIGH);

    MsTimer2::set(1000, VentInterrupt);
    if (EEPROM.read(EEPROM_STATE) > 1) MsTimer2::start();

    lcd.setBacklight(1);
    lcd.begin(16, 2);
    sensors.begin();
}

void loop()
{

    eeprom_state = EEPROM.read(EEPROM_STATE);

    ReadValues();
    StandardWrite();

    Regulate();

    if ((Clock.getDate() >= 18) && (eeprom_state == 2)) EEPROM.write(EEPROM_STATE, 3);

    CheckButtons();
    delay(1000);

    //Skoky v case (kazdy loop prida 1h) - na testovanie
    //
    byte curH = Clock.getHour(h12, pm);
    if (curH == 23) { Clock.setDate(Clock.getDate() + 1); Clock.setHour(1); }
    else Clock.setHour(curH + 1);
    //
}

///////////////////////////////////

void Rotate()
{       //Otoc vajcia

    short side;         //kontroluj stranu otocenia
    if (EEPROM.read(EEPROM_ROTATION) == 1)
    {
        side = 1;
        EEPROM.write(EEPROM_ROTATION, 0);
    }
    else
    {
        side = -1;
        EEPROM.write(EEPROM_ROTATION, 1);
    }

    int direction;
    int steps = 385 * side;
    float speed = 0.003;

    digitalWrite(smEnablePin, LOW);
    if (steps > 0) direction = HIGH;
    else direction = LOW;

    speed = 1 / speed * 70;
    steps = abs(steps);
    digitalWrite(smDirectionPin, direction);

    for (int i = 0; i < steps; i++)
    {
        digitalWrite(smStepPin, HIGH);
        delayMicroseconds(speed);
        digitalWrite(smStepPin, LOW);
        delayMicroseconds(speed);
    }
    digitalWrite(smEnablePin, HIGH);
}

///////////////////////////////////////
void ReadValues()//Citaj hodnoty senzorov
{
    //DHT
    int err = SimpleDHTErrSuccess;
    if ((err = dht22.read2(pinDHT22, &DHTtemp, &DHThumidity, NULL)) != SimpleDHTErrSuccess)
    {
        return;
    }

    //DS
    sensors.requestTemperatures();
    DStemp = sensors.getTempCByIndex(0);

    temperature[curPos] = DStemp;
    humidity[curPos] = DHThumidity;
    curPos++;
    if (curPos = 10) curPos = 0;

    if (first)
    {
        for (int i = 0; i <= 9; i++)
        {
            temperature[i] = DStemp;
            humidity[i] = DHThumidity;
        }
        first = false;
    }

    //Priemerovanie
    avgTemp = 0;
    avgHumidity = 0;
    for (int i = 0; i <= 9; i++)
    {
        avgTemp += temperature[i];
        avgHumidity += humidity[i];
    }
    avgTemp /= 10;
    avgHumidity /= 10;

    //Zrusenie priemerovania - ked chcem mat rychlejsie hodnoty
    avgTemp = temperature[curPos];
    avgHumidity = humidity[curPos];
}

//////////////////////////////////////
void StandardWrite()//Vypisovanie na display
{

    lcd.clear();
    lcd.setCursor(0, 0);

    String out = String(abs(avgTemp)) + (char)223 + "C " + String(avgHumidity) + "%H";  // výpis meranych velicin
    lcd.print(out);

    if (eeprom_state >= 2) out = "Den: " + String(Clock.getDate()) + ". ";    // vypis na display den zapnutia
else out = "";

    switch (eeprom_state)               // Nastavenie výpisu na display po stlačeni tlačidla
    {
        case 0: out+= "OFF";
            break;
        case 1: out+= "Predohrev";
            break;
        case 2: out+= "Normal";
            break;
        case 3: out+= "Liahnutie";
            break;
    }

    lcd.setCursor(0, 1);
    lcd.print(out);
}

/////////////////////////////////////
void StartMeasure()//Zacni ratat dni - reset casu
{
    Clock.setClockMode(false);
    Clock.setYear(2000);
    Clock.setMonth(1);
    Clock.setDate(1);
    Clock.setHour(1);
    Clock.setMinute(1);
    Clock.setSecond(0);
    EEPROM.write(EEPROM_TURNS, 0);
    MsTimer2::start();
}

///////////////////////////////////////
void CheckTurnEggs()//Kontrola, ci netreba otocit vajcia
{
    byte day = Clock.getDate();
    byte hour = Clock.getHour(h12, pm);

    if (LastEEPROMcheck == hour) return; // AK som kontroloval EEPROM tuto hodinu, tak necitam znova
    if (day < 3) return; //Prve 3 dni sa vajcia neotacaju

    byte eepromTurns = EEPROM.read(EEPROM_TURNS);
    byte wantedTurns = day * 2 - 1;
    if (hour < 13) wantedTurns--;

    if (wantedTurns > eepromTurns)
    {
        Rotate();
        EEPROM.write(EEPROM_TURNS, wantedTurns);
    }
}

////////////////////////////////////////
void Heating(bool state)//Prepnutie vyhrievania
{
    digitalWrite(RELAY1, !state);
    digitalWrite(RELAY2, !state);
}

///////////////////////////////////////
void Regulate()//Regulacia tepla a vlhkosti
{
    byte minHumidity, maxHumidity;

    if (eeprom_state != 0)
    {
        if (avgTemp > 39)
        {
            force = true;
            VentInterrupt();
            Heating(false);
        }
        if (avgTemp > 38.5) Heating(false);
        else if (avgTemp < 37) Heating(true);
    }
    else Heating(false);

    switch (eeprom_state)
    {
        case 0:
            minHumidity = 0;      // rezim "Off"
            maxHumidity = 100;
            break;
        case 1:
            minHumidity = 0;      // rezim "Predohrev"
            maxHumidity = 100;
            break;
        case 2:
            minHumidity = 45;     // rezim " Normal"
            maxHumidity = 65;
            break;
        case 3:
            minHumidity = 75;     // rezim " Liahnutie"
            maxHumidity = 90;
            break;
    }

    if ((avgHumidity < minHumidity) || (avgHumidity > maxHumidity))
    {
        if (lastBuzz != Clock.getMinute())
        {
            lastBuzz = Clock.getMinute();
            Buzzer();
        }
        if (avgHumidity > maxHumidity) force = true;
    }

    if (eeprom_state == 2) CheckTurnEggs();

}

///////////////////////////////////////
void Buzzer()//Buzzer :)
{
    digitalWrite(BUZZER, HIGH);
    delay(600);
    digitalWrite(BUZZER, LOW);
}

//////////////////////////////////////
void VentInterrupt()//Rutina na vetranie (sama sa vola, prerusi beh ineho podprogramu)
{
    if (eeprom_state <= 1) return;

    if (force) secondsToNextVent = 0;

    secondsFromLastVent++;
    if (secondsFromLastVent < secondsToNextVent) return;

    secondsFromLastVent = 0;
    if (!ventState)
    {
        byte pwm;                          // Ventilátor
        ventState = true;
        digitalWrite(VENT, LOW);
        if (force)
        {
            pwm = 255;                           // rychle otacky, ak nieje splnena podmienka vlhkosti
            force = false;
        }
        else pwm = 70;                     // pomale otacky, ak je splnena podmienka vlhkosti

        analogWrite(VENT_PWM, pwm);
        secondsToNextVent = 10;
    }
    else
    {
        ventState = false;
        digitalWrite(VENT, HIGH);
        analogWrite(VENT_PWM, 0);
        secondsToNextVent = 300;
    }
}

void CheckButtons()//Skontroluj, ci nie je stlacene tlacidlo
{
    if (!digitalRead(B_PREHEAT))
    {
        EEPROM.write(EEPROM_STATE, 1);
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Predohrev...");
        Buzzer();
    }
    if (!digitalRead(B_START))
    {
        EEPROM.write(EEPROM_STATE, 2);
        StartMeasure();
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Start...");
        Buzzer();
    }
    if (!digitalRead(B_STOP))
    {
        EEPROM.write(EEPROM_STATE, 0);
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("Stop...");
        Buzzer();
    }
}

