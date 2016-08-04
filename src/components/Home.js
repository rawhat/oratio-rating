import React, { Component } from 'react';
import { withRouter } from 'react-router';

import {
	request // (method, url, data)
} from './xhr.js';

const home = class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ''
		};
	}

	login = async (e) => {
		e.preventDefault();
		this.login = request('POST', '/login', { username: this.refs.username.value });
		let status = await this.login;
		if(status === 200){
			this.props.router.replace('/home/');
		}
		else {
			this.setState({
				error: status
			});
		}
	}

	render = () => {
		return(
			<div className="container-fluid">
				<div className="col-md-6 col-md-offset-3">
					<form onSubmit={this.login}>
						<input ref='username' type="text" className="form-control" id="username" placeholder="Enter username"/>
						<button className="btn btn-primary" type="submit">Login</button>
					</form>
				</div>
			</div>
		);
	}
};

export default withRouter(home);