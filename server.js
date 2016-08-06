/* eslint-disable no-unused-vars no-console */

const Promise = require('bluebird');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: String,
	ratedSpeeches: Array,
	skippedSpeeches: Array
});

const speechSchema = new Schema({
	url: String,
	ratings: Array
});

const User = mongoose.model('User', userSchema);
const Speech = mongoose.model('Speech', speechSchema);

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/oratio');
const db = mongoose.connection;

db.on('error', err => {
	console.error(err);
});

db.once('open', async () => {
	console.log('Connected to mongodb.');

	// remove this
	await Speech.remove({});
	let allSpeeches = await Speech.find({});
	console.log(allSpeeches);

	let newSpeech = new Speech({
		url: 'http://ia800805.us.archive.org/27/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3',
		ratings: [],
		skipCount: 0
	});

	await newSpeech.save();

	await User.remove({});

	// Speech.findOneAndUpdate({
	// 	url: 'http://ia800805.us.archive.org/27/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3'
	// }, {
	// 	id: 0,
	// 	url: 'http://ia800805.us.archive.org/27/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3',
	// 	ratings: [],
	// 	skipCount: 0
	// }, { upsert: true });

	const Koa = require('koa'); 
	const app = new Koa();
	const convert = require('koa-convert');

	const views = require('koa-views');
	app.use(views(__dirname + '/views', {
		map: {
			pug: 'pug'
		}
	}));

	const body = require('koa-better-body');
	app.use(convert(body()));

	const router = require('koa-router')();
	const serve = require('koa-static');

	router
		.post('/login', async (ctx) => {
			// get username from request and set cookie
			try {
				let username = JSON.parse(ctx.body).username;
				ctx.cookies.set('username', username);

				let userExists = await User.findOne({
					username
				});

				if(!userExists) {
					console.log('creating new user');
					let newUser = new User({
						username
					});

					await newUser.save();
				}
				else {
					console.log('clearing user ratings');
					await User.findOneAndUpdate({
						username
					}, { ratedSpeeches: [], skippedSpeeches: [] });
				}

				ctx.response.status = 200;
			}
			catch (e) {
				ctx.body = e;
			}
		})
		.post('/logout', async (ctx) => {
			ctx.cookies.set('username', '');
			ctx.response.status = 200;
		})
		.get('/song', async (ctx) => {
			// mongoose call -- get random song not voted on
			try {
				let username = ctx.cookies.get('username');
				//let allUsers = await User.find({});
				//console.log(allUsers);

				let currUser = await User.findOne({
					username
				});

				console.log(currUser);

				let ratedSpeeches = currUser.ratedSpeeches || [];

				let nextSpeech = await Speech.findOne({
					_id: { $nin: ratedSpeeches }
				});

				if(!nextSpeech){
					ctx.body = '';
				}
				else {
					ctx.body = nextSpeech;
				}
			}
			catch(e) {
				console.error(e);
				ctx.body = e;
			}

			/*ctx.body = {
				id: 0,
				url: 'http://ia800805.us.archive.org/27/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3',
				ratings: [],
				skipCount: 0
			};*/
		})
		// rate song
		.put('/song', async (ctx) => {
			try {
				/*
				** {
				**		song: {}
				**		rating: -1
				** }
				*/
				let payload = JSON.parse(ctx.body);
				// console.log(payload);
				// mongoose call -- rate song
				await Promise.all([
					Speech.findOneAndUpdate({
						_id: payload.song.id
					}, {
						$push: { ratings: payload.rating }
					}),
					User.findOneAndUpdate({
						username: ctx.cookies.get('username')
					}, {
						$push: { ratedSpeeches: payload.song._id }
					})
				]);

				let allSpeeches = await Speech.find({});
				let allUsers = await User.find({});

				console.log('speeches', allSpeeches);
				console.log('users', allUsers);

				ctx.response.status = 202;
				ctx.body = '';
			}
			catch (e) {
				ctx.body = e;
			}
		})
		// skip song
		.post('/song', async (ctx) => {
			try {
				let payload = JSON.parse(ctx.body);
				// console.log(payload);
				// mongoose call -- skip song
				await Promise.all([
					Speech.findOneAndUpdate({
						_id: payload.song.id
					}, { $inc: { 'skipCount': 1 }	}),
					User.findOneAndUpdate({
						username: ctx.cookies.get('username')
					}, {
						$addToSet: { skippedSpeeches: payload.song._id }
					}, { upsert: true })
				]);
				ctx.response.status = 202;
			}
			catch (e) {
				ctx.body = e;
			}
		});

	app.use(convert(serve('./static')));

	router.get('/(.*)/', async (ctx) => {
			await ctx.render('index.pug', {
				username: ctx.cookies.get('username')
			});
		});

	app.use(router.routes());
	app.use(router.allowedMethods());



	app.listen(8080);
});