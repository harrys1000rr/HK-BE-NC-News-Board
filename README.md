# News and Comment Server

This app is a backend server which hosts news articles.

The data is persisted in an PSQL database and the app uses node-postgres to access and update data.


-----------------------------------------------------------

## Installing

First clone project and install dependencies

`$ git clone https://github.com/harrys1000rr/HK-BE-NC-News-Board`

`$ cd be-nc-news`

`$ npm install`

## Dependencies

### Production
[pg-format](https://www.npmjs.com/package/pg-format)

[express](https://expressjs.com/)

[pg](https://node-postgres.com/)

### Development
[supertest](https://www.npmjs.com/package/supertest)

[nodemon](https://www.npmjs.com/package/nodemon)

[jest](https://jestjs.io/docs/getting-started)



-----------------------------------------------------------
## Deployment

You will need to create two .env files for your project: .env.test and .env.development. In each file, add `PGDATABASE=<database_name_here>`, with the database name for that environment. The default names are nc_news_test and nc_news for the test and dev environments. The .env files should be gitignored.

You should run the script `psql -f setup.sql` to create the databases. To seed the database in the current ENV, run `npm run seed`. This will wipe all the data and resets the tables with the original data that is in the `db` folder in both dev and test environments.

----------------------------------------------------------
## Testing =

Several test suites are provided in the `__tests__` folder;

|  file | script  | useage  |
|---|---|---|
|  utils.test.js |  npm t utils |  tests standard util functions |

-----------------------------------------------------



