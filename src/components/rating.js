import React from 'react';

const RatingInput = ({ index, speechUrl, playSample, updateMonotony, updateClarity }) => {
	return(
		<tr>
			<td>
				<button className="btn btn-default" onClick={playSample.bind(null, speechUrl)}>Sample {index}</button>
			</td>
			<td>
				<input type="text" onChange={updateMonotony.bind(null, index)} />
			</td>
			<td>
				<input type="text" onChange={updateClarity.bind(null, index)}/>
			</td>
		</tr>
	);
};
RatingInput.propTypes = {
	index: React.PropTypes.number,
	speechUrl: React.PropTypes.string,
	playSample: React.PropTypes.func,
	updateMonotony: React.PropTypes.func,
	updateClarity: React.PropTypes.func
};

export default RatingInput;