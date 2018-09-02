*Gymnázium Jána Adama Raymana, Prešov*

# GJAR IoT Project

This repository contains an extra-curricular project done at **GJAR** where students try to create their very own **Internet of Things** network in the school.

You can find the web interface [here](https://iot.gjar-po.sk).

The project has three parts, each with its own team: the [**Backend**](/Backend), the [**Frontend**](/Frontend) and the IoT devices, called simply [**Hardware**](/Hardware) internally, although the team deals also with the software. Each one of these is a self-contained sub-project with its own directory in the code, as well as its own dependencies.

There is also another directory which contains information about important changes: **Changelogs**.

## Dependencies

Since the three parts of the project use different technologies, all of them have their own separate dependencies. The ones you need depend on which part you want to run (you probably want to run all of them, but not all of them will be on the same device).

### Frontend

The Frontend runs HTML5, JavaScript and CSS3. Not much of a dependency list as of yet ;) For now, you just need to be able to create POST calls.

### Backend

The Backend runs on Python 3 and it uses Flask for API management. We run this on top of an Apache2 Server, but this is really up to you. Our project's specific dependencies are below:

- Python 3
- Flask
- PyYaml
- requests (if not already included in Python distribution)

Also, there are some tools written for Linux Bash, but they are not essential to run the project.

### Devices (the Hardware team)

The devices are implemented on Arduino, so you need that. The code is written in C++. Dependencies:

- ESP8266WiFi
- ESP8266HTTPClient
- ArduinoJson
- SimpleDHT
- DallasTemperature
- LiquidCrystal_I2C.h
- DS3231
- EEPROM
- MsTimer2

### Changelog generator

The generator collects all the changelogs and generates an overview. It's written in Python 3.

- Python 3
- PyYaml
- Yattag

---

## Workflow

Prerequisite:

0. Fork the repository.

Submit changes:

1. Make changes to your fork.
2. Create a changelog entry if the changes are significant enough.
    1. Copy the changelog template: `template.yml`.
    2. Rename the new file to `[author's name].yml` or `[author's name]-[project].yml` or something similar.
    3. Fill in the file. Put your name there, as well as a list of changes with their **respective types**. We currently have four change types:
        - add: Additions, new features.
        - remove: Removals, removed/deprecated features.
        - bugfix: Significant bug fix.
        - tweak: Modification, but not an *add* or *remove* and not a *bugfix*. Any other modifications come under this category.
    - You can use zero or as many of each change type as you want. An example might look like this:
        ```Yaml
        author: Animal Lover
        changes:
        - add: Added puppies.
        - add: Added kittens.
        - remove: Removed Herobrine.
        - bugfix: Fixed door handle.
        - tweak: Changed door color to blue.
        ```
    - Another (minimal) example:
        ```Yaml
        author: Animal Lover
        changes:
        - add: Built a new dog house.
        ```
3. Create a **pull request** (PR) to the main repository.

Also, remember that you can use and **reference** issues.
