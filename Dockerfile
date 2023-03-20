FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get -y update
RUN apt upgrade -y
RUN apt-get install -y software-properties-common 
RUN sed -i "/^# deb.*multiverse/ s/^# //" /etc/apt/sources.list
RUN sed -i "/^# deb.*universe/ s/^# //" /etc/apt/sources.list
RUN apt-get -y update
RUN apt upgrade -y
RUN apt-get install -y xvfb
RUN apt-get install -y ffmpeg
RUN apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g typescript && npm install -g ts-node

# RUN npm run start
