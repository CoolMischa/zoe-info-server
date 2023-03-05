FROM node:18.14-buster-slim

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . ./ 

# Install all dependencies, build distribution and clean up
RUN yarn install

# Make client script executable 
RUN chmod u+x /app/scripts/containerStart.sh

# Client port and server port. Expose ports in container to the outer world.
EXPOSE 8080

CMD /app/scripts/containerStart.sh
#CMD /bin/bash
