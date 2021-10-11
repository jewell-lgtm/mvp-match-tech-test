Vending Machine
===============


Pre-requisites
--------------

1. Node `^16.8.0`
2. yarn
3. docker

Installation
------------

`yarn install`


First Run
---------

1. `yarn dev:db` will start a docker container running postgres in the background
2. run `yarn start:dev` and kill the server when it starts (this runs the migrations)
3. `yarn test:e2e` will run the application's e2e test suite
4. `yarn start:dev` will run a development server
5. head to http://localhost:3000/api to view the OpenAPI (Swagger) documentation
6. create a user using the `POST /users` route
7. use the created access token to try other routes in the app 