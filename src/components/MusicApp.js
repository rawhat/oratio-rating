import React, { Component } from 'react';

import _ from 'lodash';

import {
	request // (method, url, data)
} from './xhr.js';

// current username
// global.username

export default class MusicApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currRating: -1,
			started: false,
			completed: false,
			currentSong: {}
		};
	}

	static defaultProps = {

	}

	componentDidMount = () => {
		this.endedListener = this.refs.audio.addEventListener('ended', () => {
			console.log('the song has ended');
			this.audioCompleted();
		});
	}

	componentWillUnmount = () => {
		this.refs.audio.removeEventListener(this.endedListener);
	}

	audioCompleted = () => {
		this.setState({
			completed: true
		});
	}

	changeRating = (e) => {
		console.log(e.target.value);
		this.setState({
			currRating: e.target.value
		});
	}

	rateSpeech = async (e) => {
		e.preventDefault();
		console.log('you rated this speech ' + this.state.currRating);

		let rate = request('PUT', '/song', { song: this.state.currentSong, rating: this.state.currRating });
		let response = await rate;

		console.log(response);

		this.setState({
			completed: false
		}, () => {
			this.getNextSpeech();
		});
	}

	startRating = () => {
		this.setState({
			started: true
		}, () => {
			this.getNextSpeech();
		});
	}

	getNextSpeech = async () => {
		// make API call
		try {
			this.getSpeech = request('GET', '/song');
			let response = await this.getSpeech;
			let json = await JSON.parse(response);
			if(json){
				this.setState({
					currentSong: json
				}, () => {
					this.refs.audio.play();
				});
			}
		}
		catch (e) {
			this.setState({
				currentSong: {}
			}, () => {
				this.refs.audio.src = '';
			});
		}
	}

	skipSpeech = async () => {
		this.skipSpeechReq = request('POST', '/song', { song: this.state.currentSong });
		let response = await this.skipSpeechReq;
		if(response === 200) {
			this.getNextSpeech();
		}
	}

	render = () => {
		let completed = this.state.completed ?
			<form style={{ textAlign: 'center' }} ref='ratingForm' onSubmit={this.state.currRating !== -1 ? this.rateSpeech : (e) => { e.preventDefault(); }}>
				{_.map(_.range(1, 6), index => {
					return <label key={index}><input style={{display: 'inline-block'}} type='radio' name='rating' value={index} onChange={this.changeRating} />{index}</label>;
				})}
				<br /><br /><br />
				<button className='btn btn-primary' type='submit'>Rate</button>
			</form>
			:
			null;

		let started = this.state.started ? null :
		<button onClick={this.startRating} className='btn btn-primary'>Start Rating</button>;
		return(
			<div>
				{/*<Navbar />*/}
				{started}
				<div style={{width: '75%', margin: '0 auto', textAlign: 'center'}}>
					{ this.state.currentSong.url ? 
						<audio ref='audio' src={this.state.currentSong.url} controls /> : 
						<audio ref='audio' controls /> 
					}
				</div>
				{completed}
			</div>
		);
	}
}