# discord-confession-bot

## Cách cài đặt

### Docker
- Cần tải Docker và docker-compose
- Clone repo về
- Đổi tên `example.env` thành `.env`
- Thay đổi `TOKEN` bằng Token của bot
- Thay đổi `GUILD_ID`, `REVIEW_CONFESSION_CHANNEL`, `CONFESSION_CHANNEL`.
- Xoá dòng `DATABASE_URL`
- `docker-compose up -d` để chạy container

### Chạy trực tiếp
- Cần tải nodejs
- Clone repo về
- `npm i`
- Đổi tên `example.env` thành `.env`
- Thay đổi `TOKEN` bằng token của bot
- Thay đổi `GUILD_ID`, `REVIEW_CONFESSION_CHANNEL`, `CONFESSION_CHANNEL`.
- Thay đổi `DATABASE_URL` bằng link tới database (hỗ trợ redis, mongo, postgres, mysql, sqlite. Default SQLite) 
- `npm start`

### Replit
- Upgrade lên Nodejs 16 bằng cách bỏ lệnh sau vào phần console
```sh
npm init -y && npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
```
- Giống với chạy trực tiếp nhưng add thêm dòng dưới vào `src/Bot.ts`
```js
require('http').createServer((req:any, res:any) => res.end('Bot is alive!')).listen(3000)
```

### Heroku
- Giống với chạy trực tiếp nhưng add thêm dòng dưới vào `src/Bot.ts`
```js
require('http').createServer((req:any, res:any) => res.end('Bot is alive!')).listen(process.env.PORT)
```
