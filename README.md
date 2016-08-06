# oratio-rating
Oratio Speech Rating Interface

# Oratio Web Rating Readme

### Contents
1. Technologies
2. Dependencies
3. Build settings
4. Usage information

### 1. Technologies
  * [koa2](https://github.com/koajs/koa)
  * [bluebird](http://bluebirdjs.com/)
  * [lodash](https://lodash.com/)
  * [mongoose](http://mongoosejs.com/)
  * [passport](http://passportjs.org/)
  * [react](https://facebook.github.io/react/)
  * [pug](https://github.com/pugjs/pug)
   
### 2. Dependencies
  * NodeJS v6+
  * MongoDB
  * babel -- `npm install -g babel-cli`

### 3. Build settings
  * Development
    * `./transpile_server.sh`
    * `./transpile_app.sh`
    * `nodemon server.comp.js`
  * Production
    * In progress
  
### 4. Usage information
  * Point your browser to `http://localhost:8080/` to access the app.
  * Enter a username to be directed to the rating page.  Click the
	`Start Rating` button to begin rating speeches.  At the end of the
	speech, `radio` buttons will be presented and can be selected.
  * Once a rating has been recorded, a new speech will be pulled from
	the database.
