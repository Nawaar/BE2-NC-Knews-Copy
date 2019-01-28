# BE2-NC-Knews-Copy

This is an API which I built so it could be used in the Northcoders News Sprint during the Front End block of my course at Northcoders.

It is now live hosted on [https://nawaar-nc-knews.herokuapp.com](https://nawaar-nc-knews.herokuapp.com)

The database is PSQL, and I interactes with it using [Knex](https://knexjs.org).

## Getting Started

Clone this repository to your local machine and `cd` into it:

  ```
  $ git clone https://github.com/Nawaar/BE2-NC-Knews-Copy.git
  $ cd BE2-NC-Knews-Copy
  ```

### Prerequisites

To install all the dependencies, run the following in the `BE2-NC-Knews-Copy` folder:

```
npm i
```

### Installing

To get a development env running, run the following commands in the terminal (in order):

```
npx knex init
mkdir config
cd config
touch auth.js
```

You should then update the `knexfile.js` file with the following:

```
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'northcoders_news',
      user: <USERNAME>, // If not on iOS
      password: <PASSWORD>, // If not on iOS
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
}
```

You should then update the `auth.js` file with the following:

```
module.exports = {
  development: {
    JWT_SECRET: <YOUR OWN SECRET MESSAGE>,
  },
}
```

Then run the following command to rollback, create and seed you data into your database:

```
npm run seed:do
```

To run your API in development mode, run the following commend in `BE2-NC-Knews-Copy` folder:

```
npm run dev
```

This will run on your browser on `localhost:9090`

To access the API, you will need to login with a POST request on `localhost:9090` with the follwing body as a JSON object:

```
{
    "username": <USERNAME>, 
    "password": <PASSWORD>
    }
```

where the USERNAME and PASSWORD can be taken from `db/data/development-data/users.js`

You can then view the list of all endpoints on `localhost:9090/api`

## Running the tests

In order to run the automated tests for this system, first run the following commands in the terminal (in order) if you have not done so already:

```
npx knex init
mkdir config
cd config
touch auth.js
```

You should then update the `knexfile.js` file with the following for the test environment:

```
module.exports = {
 test: {
    client: 'pg',
    connection: {
      database: 'test_northcoders_news',
      user: <USERNAME>, // If not on iOS
      password: <PASSWORD>, // If not on iOS
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
}
```

You should then update the `auth.js` file with the following for the test environment:

```
module.exports = {
  test: {
    JWT_SECRET: <YOUR OWN SECRET MESSAGE>,
  },
}
```
To then run the tests, run the following commend in `BE2-NC-Knews-Copy` folder:

```
npm t
```
