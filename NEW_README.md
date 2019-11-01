# NC News API  

A project for a news site for posting articles about particular topics. Each user is able to post articles as well as comment on articles.

Hosted at: **https://nc-news-hkeyes.herokuapp.com**

## Getting Started  

Follow these steps to get the app up and running:  

## Prerequisites  


##### Dependencies:
* express
* pg
* knex
* jsonwebtokens

Installation: **npm i express pg knex jsonwebtoken**

##### Dev Dependencies:
* mocha
* chai
* supertest
* chai-sorted

Installation: **npm i -D mocha chai chai-sorted supertest**

## Installing

You will need to install psql:  

### PSQL Install instructions
**Mac**
- Install Postrgres App https://postgresapp.com/
 - Open the app (little blue elephant) and select initialize/start
- type psql into your terminal. You should then see something similar to:
psql
psql (9.6.5, server 9.6.6)
Type "help" for help.

        username=#
- if the above does not show/you get an error, run the following commands in your terminal:
 - brew update
 - brew doctor
 - brew install postgresql  

**Ubuntu**
- Run this command in your terminal:
 sudo apt-get update
 sudo apt-get install postgresql postgresql-contrib
- Next run the following commands to create a database user for Postgres.
 sudo -u postgres createuser --superuser $USER
 sudo -u postgres createdb $USER
- Then run this command to enter the terminal application for PostgreSQL:
 psql
- Now type:
 ALTER USER username WITH PASSWORD 'mysecretword123';
 BUT Instead of username type your Ubuntu username and instead of 'mysecretword123' choose your own password and be sure to wrap it in quotation marks. Use a simple password like ‘password’. DONT USE YOUR LOGIN PASSWORD !
- You can then exit out of psql by typing \q  

### Database Setup

Run the following commands to setup and seed the database: 
- **npm run setup-dbs**
- **npm run seed**  

## Testing ##

**Utils Testing**
The utility functions for seeding the database can be tested with the following command:  
- **npm run test-utils**

**App Testing**
The app's endpoints can be tested with the following command:  
- **npm test**

## Deployment

Read this project's **hosting** file for instructions on how to deploy the app to Heroku.