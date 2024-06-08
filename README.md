---
:author: Mischa Soujon
:email: mischa@soujon-net.de
:date: 2023-01-20 12:49:09
---
# Zoe node.js Client
Unofficial JavaScript REST-API for information about the Renault ZOEs of the 
CMS carsharing association.

## Requirements
Renault ZOE with active data subscription.

## Idea
To check and provide the available data on Renaults ZOEs you normally use the 
Renault app and your account. If you want to provide the information to other
like in a carsharing association you don't want to share your account data with
all other members. Here this applications steps in.
By setting up a REST-API and handling all the requests to Renault and some other
providers, e.g. openweathermap.org, it gives you the ability to present the
information of the cars where and to whom you want.

## Runtime Environments
The nodejs scripts builds an express WebServer which can run as standalone
system, which might be sufficient for development purposes.
The express server can also be run in a docker container, which can be easily 
build with the given Dockerfile and the served from a proxy http server, like
apache or nginx.

## Installation
There are at least two ways to build the application and operate it, JavaScript 
native on your computer or as container in an container environment like docker 
or podman.

In both cases you have to clone this repository. 

`git clone git@github.com:CoolMischa/zoe-info-server.git` 

on a command line should do the trick.
The you have to setup an `.env` file with the following environment variables:
```
CORS_ORIGIN='{"origin": ["https://<your.zoeinof.domain>", "http://localhost:8081", "http://localhost"], "preflightContinue": false}'
RENAULT_USER=<vorname.nachname@E-mail.com>
RENAULT_PW=<Dein Passwort>
REGISTRATION_COUNTRY=DE
WEATHER_API_KEY=<Dein Weather-API Key>
KAMEREON_API_KEY=<der aktuelle KAMEREON-API Key>
```
Please fill in the correct data for your account.

### JavaScript native
_To be done_

### Container environment
_To be done_

## Usage instructions
_To be done_

## Contributors and Thank
Give a big hand also to 
[Muscat's OxBlog](https://muscatoxblog.blogspot.com/2019/07/delving-into-renaults-new-api.html)
for decrypting the Renault API.

Thanks to @ToKen for the openweathermap.org integration for Ph2-Zoes! If you 
want to use this feature you need an API key from openweathermap.org.

