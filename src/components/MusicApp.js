import React, { Component } from 'react';

import _ from 'lodash';

// (method, url, data)
import { request } from './xhr.js';

import RatingInput from './rating.js';
import ControlSpeech from './control.js';

// current username
// global.username

export default class MusicApp extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		currentSpeech: 'http://ia800805.us.archive.org/27/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3',
		sample: {
			id: 0,
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
		},
		ratings: [ {}, {}, {}, {}, {} ]
	}

	componentDidMount = () => {
		/*if(!global.username)
			this.props.router.replace('/');*/

		this.endedListener = this.refs.audio.addEventListener('ended', () => {
			console.log('the song has ended');
			this.audioCompleted();
		});
	}

	componentWillUnmount = () => {
		if(this.refs.audio)
			this.refs.audio.removeEventListener(this.endedListener);
	}

	audioCompleted = () => {
		this.setState({
			completed: true
		});
	}

	rateSample = async () => {
		if(_.every(this.state.ratings, rating => {
			return rating.monotony && rating.clarity;
		})) {
			try {
				/*let samples = _.map(this.state.ratings, (rating, index) => {
					return Object.assign({}, this.state.sample.samples[index], { 
						monotonies: this.state.sample.samples[index].monotonies.concat(rating.monotony),
						clarities: this.state.sample.samples[index].clarities.concat(rating.clarity)
					});
				});

				let sample = Object.assign({}, this.state.sample, { samples });

				this.sendRating = request('PUT', '/speech', sample);
				let response = await this.sendRating;
				console.log(response);
				if(response) {
					this.getNextSample();
				}*/

				let ratingObj = {
					sampleId: this.state.sample._id,
					ratings: this.state.ratings
				};

				this.sendRating = request('PUT', '/speech', ratingObj);
				let response = await this.sendRating;
				if(!response) {
					this.getNextSample();
				}
			}
			catch(e) {
				console.error(e);
			}
		}
	}

	getNextSample = async () => {
		// make API call
		try {
			this.refs.audio.pause();
			this.refs.audio.src = '';

			this.setState({
				sample: {}
			}, async () => {
				this.next = request('GET', '/speech');
				let results = await this.next;
				let json = await JSON.parse(results);
				this.setState({
					sample: json
				});
			});
		}
		catch (e) {
			console.error(e);
		}
	}

	skipSpeech = async () => {
		this.skipSpeechReq = request('POST', '/speech', { song: this.state.currentSong });
		let response = await this.skipSpeechReq;
		if(response === 202) {
			this.getNextSpeech();
		}
		else {
			console.error('ruh roh');
		}
	}

	playSpeech = (url) => {
		console.log(url);
	}

	updateMonotony = (index, event) => {
		this.setState({
			ratings: [
				...this.state.ratings.slice(0, index),
				Object.assign({}, this.state.ratings[index], { monotony: event.target.value }),
				...this.state.ratings.slice(index+1)
			]
		});
		//console.log(`monotony for ${index} is ${event.target.value}`);
	}

	updateClarity = (index, event) => {
		this.setState({
			ratings: [
				...this.state.ratings.slice(0, index),
				Object.assign({}, this.state.ratings[index], { clarity: event.target.value }),
				...this.state.ratings.slice(index+1)
			]
		});
		//console.log(`clarity for ${index} is ${event.target.value}`);
	}

	render = () => {
		return(
			<div className='container-fluid'>
				{/*<Navbar />*/}
				<div className="row" style={{marginTop: 15}}>
					<div className="col-md-4">
						<div className="row">
							<div className="panel panel-default">
								<div className="panel-body"><h4>Sample #{this.state.currentSample}</h4></div>
							</div>
						</div>
						<div className="row">
							{this.state.sample.control ? <ControlSpeech
								control={this.state.sample.control}
								playSpeech={this.playSpeech}
							/> : null}
						</div>
					</div>
					<div className="col-md-8">
						<div className="row" style={{textAlign: 'center'}}>
							<audio src={this.state.currentSpeech} ref='audio' controls />
						</div>
						<div className="row" style={{textAlign: 'center'}}>
							<h4>Sample Speeches</h4>
						</div>
						<div className="row">
							<table style={{width: '100%'}}>
								<thead>
									<tr>
										<th>Samples</th>
										<th>Monotony</th>
										<th>Clarity</th>
									</tr>
								</thead>
								<tbody>
									{_.map(this.state.sample.samples, (sample, index) => {
										return <RatingInput
											key={sample._id ? sample._id : sample.url}
											index={index}
											speechUrl={sample.url}
											playSample={this.playSpeech}
											updateMonotony={this.updateMonotony}
											updateClarity={this.updateClarity}
										/>;
									})}
								</tbody>
							</table>
						</div>
						<div className="row" style={{marginTop: 10, textAlign: 'center'}}>
							<button className="btn btn-default" onClick={this.state.sample._id ? this.rateSample : this.getNextSample}>Rate Set</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}