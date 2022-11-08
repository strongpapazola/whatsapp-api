# whatsapp-api

```
npm install
node app.js
```

# how to send to number
```
curl --location --request POST 'http://localhost:8000/send-message' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'message=ALERT' \
--data-urlencode 'number=+6281234567890'
```

# how to send to grup
```
curl --location --request POST 'http://localhost:8000/send-group-message' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Binance Smart Chain' \
--data-urlencode 'message=API'
```

# How To Run Inside Docker
- Dev
```
docker build -t strongpapazola/whatsapp-api:v2 . && docker run -it --rm --name wacube1 -p 8000:8000 strongpapazola/whatsapp-api:v2
```

- Prod```
docker build -t strongpapazola/whatsapp-api:v2 . && docker run -d --restart always --name wacube1 -p 8000:8000 strongpapazola/whatsapp-api:v2
```
