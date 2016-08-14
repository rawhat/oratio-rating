import React from 'react';

const ControlSpeech = ({ control, playSpeech }) => {
	return (
		<div className="container-fluid" style={{textAlign: 'center'}}>
			<div className="row">
				<h4>Control Speech</h4>
			</div>
			<div className="row">
				<button className="btn btn-default" onClick={playSpeech.bind(null, control.url)}>Play Control</button>
			</div>
			<div className="row">
				<div className="col-md-6">Monotony:</div>
				<div className="col-md-6">{control.monotony}</div>
			</div>
			<div className="row">
				<div className="col-md-6">Clarity:</div>
				<div className="col-md-6">{control.clarity}</div>
			</div>
		</div>
	);
};
ControlSpeech.propTypes = {
	control: React.PropTypes.object,
	playSpeech: React.PropTypes.func
};

export default ControlSpeech;