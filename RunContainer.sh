#!/bin/bash
podman run -it --rm --name zoe-info -p8080:8080 \
        -e CORS_ORIGIN='{"origin": ["https://www.cms-carsharing.de", "http://localhost:8081", "http://localhost"], "preflightContinue": false}' \
        -e RENAULT_USER=<vorname.nachmane@E-mail.com> \
        -e RENAULT_PW=<Dein Passwort> \
        -e REGISTRATION_COUNTRY=DE \
        -e SAVE_CSV=0 \
        -e MAIL_BATTERY_LEVEL=0 \
        -e MAIL_BATTERY_CHARGED=0 \
        -e MAP_PROVIDER=osm \
        -e WEATHER_API_KEY=<Dein Weather-API Key> \
        cms-zoe-info:latest 

podman run -d --name zoe-info -p8080:8080 \
        -e CORS_ORIGIN='{"origin": ["https://www.cms-carsharing.de", "http://localhost:8081", "http://localhost"], "preflightContinue": false}' \
        -e RENAULT_USER=<vorname.nachmane@E-mail.com> \
        -e RENAULT_PW=<Dein Passwort> \
        -e REGISTRATION_COUNTRY=DE \
        -e SAVE_CSV=0 \
        -e MAIL_BATTERY_LEVEL=0 \
        -e MAIL_BATTERY_CHARGED=0 \
        -e MAP_PROVIDER=osm \
        -e WEATHER_API_KEY=<Dein Weather-API Key> \
        cms-zoe-info:latest 