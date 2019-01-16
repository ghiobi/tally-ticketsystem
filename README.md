# Tally-Ticketsystem

This is the ticketing/feedback system that is to be accompagnied with tally expense bot.   

## Setup

1. Manually `git clone` and install node modules.

```
npm install
```

2. Install Adonis CLI Globally (Optional, good for development)

```
npm i -g @adonisjs/cli
```

3. Create `.env` file and configure it.

```
cp .env.example .env && adonis key:generate
```

Example `.env file`

```
HOST=127.0.0.1
PORT=3333
NODE_ENV=development
APP_URL=http://${HOST}:${PORT}
CACHE_VIEWS=false
APP_KEY=T0ixKEW6Cad2fHtDxxEITup4kClsYQub

DB_CONNECTION=sqlite
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=adonis

SESSION_DRIVER=cookie
HASH_DRIVER=bcrypt
```

4. Start the app

```
npm start or adonis serve
```

### Migrations

Run the following command to run startup migrations.

```
adonis migration:run
```
