/* eslint-disable no-unused-vars no-console */

const Promise = require('bluebird');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: String,
	ratedSamples: Array,
	skippedSamples: Array
});

const controlSchema = new Schema({
	url: String,
	monotony: Number,
	clarity: Number
});

const speechSchema = new Schema({
	url: String,
	monotonies: Array,
	clarities: Array
});

const sampleSchema = new Schema({
	control: controlSchema,
	samples: [speechSchema]
});

const User = mongoose.model('User', userSchema);
const Sample = mongoose.model('Sample', sampleSchema);

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/oratio');
const db = mongoose.connection;

db.on('error', err => {
	console.error(err);
});

db.once('open', async () => {
	console.log('Connected to mongodb.');

	/*** remove this ***/
	await Sample.remove({});
	let allSamples = await Sample.find({});
	console.log(allSamples);

	let newSample = new Sample({
		control: {
			url: 'ctrl',
			monotony: 2,
			clarity: 2
		},
		samples: [
			{
				id: 0,
				url: '1',
				monotonies: [],
				clarities: []
			},
			{
				id: 1,
				url: '2',
				monotonies: [],
				clarities: []
			},
			{
				id: 2,
				url: '3',
				monotonies: [],
				clarities: []
			},
			{
				id: 3,
				url: '4',
				monotonies: [],
				clarities: []
			},
			{
				id: 4,
				url: '5',
				monotonies: [],
				clarities: []
			}
		]
	});

	await newSample.save();

	await User.remove({});

	/******************/

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
		.get('/speech', async (ctx) => {
			// mongoose call -- get random song not voted on
			try {
				let username = ctx.cookies.get('username');
				//let allUsers = await User.find({});
				//console.log(allUsers);

				let currUser = await User.findOne({
					username
				});

				console.log(currUser);

				let ratedSamples = currUser.ratedSamples || [];

				let nextSpeech = await Sample.findOne({
					_id: { $nin: ratedSamples }
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
		// rate sample
		.put('/speech', async (ctx) => {
			try {
				/*
				** {
				**		song: {}
				**		rating: -1
				** }
				*/
				let payload = JSON.parse(ctx.body);
				console.log(payload);
			}
			catch (e) {
				ctx.body = e;
			}
		})
		// skip song
		.post('/speech', async (ctx) => {
			try {
				let payload = JSON.parse(ctx.body);
				// console.log(payload);
				// mongoose call -- skip song
				await Promise.all([
					Sample.findOneAndUpdate({
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