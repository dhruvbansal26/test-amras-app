#!/bin/bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.5.0/bin

cd test-amras-app
 git pull origin master
 cd server
 pm2 kill
 pm2 start dist/index.js
