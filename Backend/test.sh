#!/bin/bash

source <(cat ./test_config | egrep '^[a-z]+=(("[a-zA-Z0-9\.-]+")|([0-9]+))$')

echo -e "\033[0;36m .. ===== \033[1;32mGJAR Internet of Things \033[0;36m===== .. \033[0m"
echo -e "Starting GJAR-IOT \033[0;31mTEST\033[0m server at $host:$port"

export FLASK_APP=main.py
python3 -m flask run --host=$host --port=$port

echo -e "\n\033[0;31mQuit\033[0m GJAR-IOT."
echo -e "\033[0;36m ˙˙ ===== \033[1;32mGJAR Internet of Things \033[0;36m===== ˙˙ \033[0m"
