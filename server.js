/* eslint-disable no-unused-vars no-console */


var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
mongoose.connect('mongodb://localhost/oratio');

var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	ratedSpeeches: Array
});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);

var db = mongoose.connection;

var Koa = require('koa');
var app = new Koa();
var convert = require('koa-convert');

var views = require('koa-views');
app.use(views(__dirname + '/views', {
	map: {
		pug: 'pug'
	}
}));

var body = require('koa-better-body');
app.use(convert(body()));

var session = require('koa-session');
app.keys = ['bzAPm06LclTiZAhGjLKHH8QsC86nfcCraaISyCs+SbDJ5x33H6U7diS8NIQrCulWTXw='];
app.use(convert(session(app)));

var passport = require('koa-passport');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

var router = require('koa-router')();
var serve = require('koa-static');

router
	.get('/', async (ctx, next) => {
		await ctx.render('index.pug');
	})
	.get('/user', async (ctx, next) => {
		await ctx.render('login.pug');
	})
	.put('/user', async (ctx, next) => {
		await console.log(ctx.body);
	})
	.post('/login', async (ctx, next) => {
		await console.log(ctx.body);
	})
	.get('/home', async (ctx, next) => {
		await ctx.render('home.pug');
	});
	//

app.use(router.routes());
app.use(router.allowedMethods());

app.use(convert(serve('./static')));

app.listen(8080);