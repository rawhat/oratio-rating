# oratio-rating
Oratio Speech Rating Interface

# Oratio Web Rating Readme

### Contents
1. Technologies
2. Dependencies
3. Build settings
4. Usage information

### 1. Technologies
  * koa2
  * bluebird
  * lodash
  * mongoose
  * passport
  * react
  * pug
   
### 2. Dependencies
  * NodeJS v6+
  * MongoDB
  * babel -- `npm install -g babel-cli`

### 3. Build settings
  * `./transpile_server.sh`
  * `./transpile_app.sh`
  * `nodemon server.comp.js`

### 4. Usage information
  * Point your browser to `http://localhost:8080/` to access the app.
  * Enter a username to be directed to the rating page.  Click the
	`Start Rating` button to begin rating speeches.  At the end of the
	speech, `radio` buttons will be presented and can be selected.
  * Once a rating has been recorded, a new speech will be pulled from
	the database.
