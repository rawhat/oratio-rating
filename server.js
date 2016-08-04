/* eslint-disable no-unused-vars no-console */

var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
mongoose.connect('mongodb://localhost/oratio');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	ratedSpeeches: Array,
	skippedSpeeches: Array
});

var songSchema = new Schema({
	url: String,
	ratings: Array
});

var User = mongoose.model('User', userSchema);
var Song = mongoose.model('Song', songSchema);

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

var router = require('koa-router')();
var serve = require('koa-static');

//var history = convert(require('koa-connect-history-api-fallback'));
//app.use(history());

router
	.post('/login', async (ctx, ) => {
		// get username from request and set cookie
		try {
			let username = JSON.parse(ctx.body).username;
			ctx.cookies.set('username', username);
			ctx.response.status = 200;
		}
		catch (e) {
			ctx.body = e;
		}
	})
	.get('/song', async (ctx, ) => {
		// mongoose call -- get random song not voted on
		// let currUser = ctx.cookies.get('username');
		// 
		ctx.body = {
			id: 0,
			url: 'http://ia800805.us.archive.org/27/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3',
			ratings: [],
			skipCount: 0
		};
	})
	// rate song
	.put('/song', async (ctx, ) => {
		let payload = JSON.parse(ctx.body);
		console.log(payload);
		// mongoose call -- rate song
		ctx.response.status = 202;
	})
	// skip song
	.post('/song', async (ctx, ) => {
		let payload = JSON.parse(ctx.body);
		console.log(payload);
		// mongoose call -- skip song
		ctx.response.status = 202;
	});

app.use(convert(serve('./static')));

router.get('/(.*)/', async (ctx, ) => {
		await ctx.render('index.pug', {
			username: ctx.cookies.get('username')
		});
	});

app.use(router.routes());
app.use(router.allowedMethods());



app.listen(8080);