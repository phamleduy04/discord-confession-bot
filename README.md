# discord-confession-bot

## Cách cài đặt

### Docker
- Cần tải Docker và docker-compose
- Clone repo về
- Đổi tên `example.env` thành `.env`
- Thay đổi `TOKEN` bằng Token của bot
- Xoá dòng `MONGODB`
- `docker-compose up -d` để chạy container

### Chạy trực tiếp
- Cần tải nodejs
- Clone repo về
- `npm i`
- Đổi tên `example.env` thành `.env`
- Thay đổi `TOKEN` bằng token của bot
- Thay đổi `MONGODB` bằng link tới mongodb
- `npm start`

### Replit, Heroku
- Giống với chạy trực tiếp nhưng add thêm dòng dưới vào `src/Bot.ts`
```js
require('http').createServer((req:any, res:any) => res.end('Bot is alive!')).listen(3000)
```
