# Tally-Ticketsystem

This is the ticketing/feedback system that is to be accompagnied with tally expense bot.

## Setup with Docker

### Install Docker and Docker-Compose

* Use a package manager or install directly from [Docker](https://www.docker.com/get-started). 
* Make sure Docker is running.

* May also be useful to have the docker plugin for vs-code


Make sure HOST=0.0.0.0:3333 (localhost) in your `.env` file

#### Start

```docker-compose up```

* Use `docker-compose up -d` to run it in detached mode.

#### Stop


```Ctrl + C```

* Use `docker-compose down` if running in detached mode.

#### Misc.

* To delete all your docker images and networks on file to free up space use: `docker system prune`
* To see a list of containers running with their respective container IDs and port mappings use: `docker ps`(useful for checking if you have a detached container running that's holding up a port)
* To run the container without compose use: `docker run`

---

## Setup (Without Docker)

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
HOST=0.0.0.1
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

4. Setup database

```
adonis migration:run && adonis seed
```

5. Start the frontend and backend in another terminal

```
npm run front:dev
```
```
npm start
```

### Migrations

Run the following command to run startup migrations.

```
adonis migration:run
```
