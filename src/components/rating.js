import React, { Component } from 'react';

export default class RatingInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rating: -1
		};
	}

	static defaultProps = {
		label: ''
	}

	changeRating = (event) => {
		this.setState({
			rating: event.target.value
		});
	}

	render = () => {
		return(
			<div className="form-group">
				<label className='col-md-4' htmlFor={this.refs.rating}>{this.props.label}</label>
				<input className='col-md-4' ref='rating' onChange={this.changeRating} type="text" tabIndex={0} />
				<div className="col-md-4"></div>
			</div>
		);
	}
}
RatingInput.propTypes = {
	label: React.PropTypes.string
};