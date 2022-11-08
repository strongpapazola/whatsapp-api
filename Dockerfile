FROM node:latest
WORKDIR /app
COPY . .
RUN apt update;
RUN apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2 -y;
RUN npm install express whatsapp-web.js qrcode-terminal express-validator;
CMD ["node","app.js"]
