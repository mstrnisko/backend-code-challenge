# Brainsoft BE interview assesment

## Install packages

1. Run `npm install` in the root of the directory for development purposes

## How to start development server

```
cp .env.example .env
docker-compose up --build
```

- Docker supports hot reloading with `tsc` and `nodemon`
  After starting the server, the docker should output the URL of the app and swagger documentation, but they should be located at `http://localhost:3000` together with `http://localhost:3000/docs`

## How to run tests

```
cp .env.example .env.tests
docker-compose --env-file=.env.test -f docker-compose.test.yml up --build
```

- After the database is up, you can run the tests with following command:

```
npm run test
```

## Test environment

- Almost every command can be run against the test environment with the prefix `NODE_ENV=test`
