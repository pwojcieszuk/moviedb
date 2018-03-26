# moviedb
Simple api for exploring public movie database. Build to play with node, mongo, docker, and several other things.

## How to install it?

There are 2 options.

1. If you can use docker (https://www.docker.com/), try:

```bash
./scripts/docker-run.sh
```

2. If you want to run it without docker:

```bash
yarn init #assumes you have node and yarn installed on your system.
./scripts/run.sh
```

## How to run tests?

1. Docker:

```bash
./scripts/docker-run-tests.sh
```

2. No docker:

```bash
./scripts/run-tests.sh
```
**Notice:** According to the golden 'never mock it if you do not control it' rule, the tests provided are **integration tests**. As such, they rely on external services such as database and external api - just like the app does. If an external service is missing or takes too long to respond, the tests can fail. This, actually, can give us a clue to fix these areas where we see them failing too often someday...

Oh, it has been checked with ESLint - if you check it with another linter and it fails, well, blame ESLint.

## How can I configure it?

You can't. Unless you really wish to. Because I took some time to play with different development/deployment environments here, there is bit of a mess. Docker containers store config values in their Docker* and *-compose files; Heroku stores config online and in local .env files; local environment variables are configured in a very ugly way as part of bash scripts used to run them - mainly because the conventional .env file is already taken by Heroku. In real life, one convention would be chosen, and it definitely would not be an .sh file.

## How do I authenticate?
You don't. At least for now, the api is open to everyone (*read: I did not have time to implement proper auth so far*).

## Where can I try it out?
Here: https://pwojcieszuk-moviedb.herokuapp.com/

## What are the routes and parameters?

As a base rule, all requests return JSON. That is, **if** they return anything. POST requests require 'application/json' as their content type; some GET requests have optional query parameters.

1. GET all the movies persisted in our database
```bash
GET /movies/
```

2. POST a new movie (*Indeed, I am myself a bit puzzled why it is not a PUT*)

```bash
POST /movies/ 

body: {"Title": "Title you want to find, case does not matter, but otherwise it has to be a full title not some fuzzy guess"}
```

3. POST a comment to the movie (*PUT puzzle is valid also for this one*)
```bash
POST /comments/ 

body: {"MovieId": "Movie's _id parameter as provided by our db engine and displayed"}

#However, this whole _id thing is quite annoying, soit can also be:

body: {"Title": "Again, cannot be fuzzy, and fuzzy it cannot be"}

#Sending both MovieId and Title is not an error, but logically, what sense does it make?
```

4. GET (all) comments:

```bash
GET /comments/ #all comments

GET /comments/?MovieId=<precise, non-fuzzy movie _id> #comment for this particular movie

GET /comments/?Title=<title or its part - fuzzy allowed, at last> #comment for whatsisname...

GET/comments/?MovieId=<_id>&Title=<title> #possible, but again does not make much sense - the logical operator is AND, so the movie id always wins with the title
```

## What is missing?
There is always something missing. Some of the ideas of the things I would like to implement for the api like this that came to my mind while working on it were: 
  - pagination of the results to avoid database overload once we have a lot of entries
  - user authentication (JWT, probably)
  - creating a comment for a non-persisted movie (aka silently persisting movies that are not yet in our db when comments to them are added using title)
  - proper environment file and secret files with all the important credentials (aka proper production environment) - you can steal my omdb api key from this repository if you really wish to
  - api json naming follows the format of omdb, while I personally prefer snake_case to camelCase in JSON. For a while, I used the 2 formats, but then realized it does not look good. I hope I managed to cover all the traces.
  