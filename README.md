Serverless graphql endpoint for PostgresSQL database using [AWS](https://aws.amazon.com/de/),
[serverless](https://github.com/serverless/serverless) and [postgraphql](https://github.com/calebmer/postgraphql)

# How to use:

## Setup
```
git clone https://github.com/rentrop/serverless-postgraphql
cd serverless-postgraphql
npm install
sls deploy -v
```
☕ Coffeetime:  AWS takes ~10min to setup the Postgres DB

## Populate DB and set endpoints:

* From the result of `sls deploy` take the `pgEndpoint` and insert it in:
  * `package.json`-file in the config of `PGCON` (line 7)
  * `serverless.yml`-file in the environment-variable named `PGCON` (line 21)
* Populate the DB with the data from postgraphql's excelent [forum example](https://github.com/rentrop/postgraphql/tree/master/examples/forum). You need the `psql` cli. On Mac just follow the instructions [here](http://postgresapp.com/) to install it.
  * `npm run populate-schema`
  * `npm run populate-data`
* Get the schema from the database and write it as a json file:
  * `npm run build-schema`

The last command runs a SQL query to get schema-information about the Postgres DB.
The information is written to a JSON-file which is then loaded by the lambda function (handler.js)
to build the graphql-schema.

## Deploy and test

* You can now test your endpint locally using:
  * `sls invoke local -f graphql -p event-auth.json`
  * `sls invoke local -f graphql -p event-query.json` In case this fails:
  Take the returned token from the first invoke and put it into `event-query.json`
* Deploy to Server:
  * `sls deploy function -f graphql` or for a 'full' deployment `sls deploy`

You are all set now. You can now query the resulting endpoint as you wish via __POST__ and __GET__

One example to authenticate a user would be:
```
mutation {
  authenticate(input: {email: "spowell0@noaa.gov", password: "iFbWWlc"}) {
    jwtToken
  }
}
```

You can try this by entering the following in your browser:
 > your-url/dev/graphql?query=mutation%20%7B%0Aauthenticate%28input%3A%20%7Bemail%3A%20%22spowell0%40noaa.gov%22%2C%20password%3A%20%22iFbWWlc%22%7D%29%20%7B%0AjwtToken%0A%7D%0A%7D



# TODO:
* Responde with error-codes.  
At the moment always statusCode:200 is returned.
Not sure how to give back error-codes and preserve the graphql `{"errors": [...]}`-style.
Using `cb(some error)` and a custom `template` could be a solution... Not sure how exactly. [Serverless Doku on status codes](
https://serverless.com/framework/docs/providers/aws/events/apigateway#custom-status-codes)
