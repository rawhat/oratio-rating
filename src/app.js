import React, { Component } from 'react';
import { render } from 'react-dom';

import _ from 'lodash';

//import Navbar from './components/navbar.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currRating: -1,
			completed: false
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

	rateSpeech = (e) => {
		e.preventDefault();
		console.log('you rated this speech ' + this.state.currRating);
		this.setState({
			completed: false
		}, () => {
			this.getNextSpeech();
		});
	}

	getNextSpeech = () => {
		// make API call
		console.log('generating next speech');
		this.refs.audio.play();
	}

	render = () => {
		var completed = this.state.completed ?
			<form ref='ratingForm' onSubmit={this.state.currRating !== -1 ? this.rateSpeech : (e) => { e.preventDefault(); }}>
				{_.map(_.range(1, 6), index => {
					return <div><input key={index} style={{display: 'inline-block'}} type='radio' name='rating' value={index} onChange={this.changeRating} />{index} <br /></div>;
				})}
				<button className='btn btn-primary' type='submit'>Rate</button>
			</form>
			:
			null;
		return(
			<div>
				{/*<Navbar />*/}
				<div style={{width: '75%', margin: '0 auto', textAlign: 'center'}}>
					<audio ref='audio' src="http://ia800805.us.archive.org/27/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3" controls />
				</div>
				{completed}
			</div>
		);
	}
}

render(<App />, document.getElementById('main-panel'));