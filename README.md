# Tally-Ticketsystem

This is the ticketing/feedback system that is to be accompagnied with tally expense bot.

## Description

Tally-Ticketing is an extension of the Tally-bot expensing system. It mainly serves as a ticketing system where users can submit the issues that they experience within Tally-bot. Administrators can reply to tickets and resolves the issues. It can also be considered as a web version of tally-bot where users can easily submit their expenses by uploading pictures of their receipts or invoices. Tally will automatically attempt to fill in as much information about the expense as possible. By leveraging OCR (Object Character Recognition) and computer vision, Tally will be able to determine the price, category, and country from a given expense picture. Tally ticketing also includes other unique features such as email support, ticket exporting, metrics tracking and a notification center.

## Architecture

![Dense of Overall Arch (1)](https://user-images.githubusercontent.com/16395051/56480000-3ccd6600-6486-11e9-970c-3139d31c21ae.jpg)

Tally Ticketing uses an Adonis web application. Like Rails, Adonis is an MVC web framework. The entire application is containerized. Furthermore, several other components of the application, such as the database and the anaylitics services are also containerized. Container orchestration, in the development environment, is handled using docker compose.

## API

The ticketing system exposes 4 different endpoints that allows the creation and deletion of tickets. 3 GET endpoints are used to get existing tickets and a single POST endpoint is defined to create tickets. All the endpoints are authenticated using an API token. Tokens are randomly generated strings and are unique to each organization. Admins are able to generate API tokens on the admin ‘API Token’ page. Therefore, each request must originate from a user of the same organization as that of the token. A new token can be generated whenever necessary.

### (GET) User tickets

URL: `/organization/{organization}/api/tickets/user/{user_id}`

Description: Retrieve all tickets belonging to a user

### (GET) Single Ticket

URL: `/organization/{organization}/api/tickets/{ticket_id}`

Description: Retrieve a ticket with all the messages and details belonging to it

### (GET) Organization tickets

URL: `/organization/{organization}/api/tickets`

Description: Retrieve all tickets belonging to an organization

### (POST) A new user ticket

URL: `/organization/{organization}/api/tickets`

Description: Creates a new ticket related to a user and if the user does not exist yet, it will create the user’s account on the app.

## Setup with Docker

### Install Docker and Docker-Compose

- Use a package manager or install directly from [Docker](https://www.docker.com/get-started).
- Make sure Docker is running.

- May also be useful to have the docker plugin for vs-code

Make sure HOST=0.0.0.0:3333 (localhost) in your `.env` file

#### Start

`docker-compose up`

- Use `docker-compose up -d` to run it in detached mode.

#### Stop

`Ctrl + C`

- Use `docker-compose down` if running in detached mode.

#### Misc.

- To delete all your docker images and networks on file to free up space use: `docker system prune`
- To see a list of containers running with their respective container IDs and port mappings use: `docker ps`(useful for checking if you have a detached container running that's holding up a port)
- To run the container without compose use: `docker run`

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

See [`.env.example`](/.env.example) file

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

Run the following command to restart the database from scratch in case of database issues.

```
adonis migration:refresh && adonis seed
```
