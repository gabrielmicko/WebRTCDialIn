import React from 'react';
import Store from 'store';

export default React.createClass({

	getInitialState() {
		let currentStore = Store.getState();
		return {
			'display': (currentStore.callReducer.number === false) ? true : false,
			'tempvalue': ((currentStore.callReducer.number !== false) ? currentStore.callReducer.number : ''),
			'number': ((currentStore.callReducer.number !== false) ? currentStore.callReducer.number : ''),
			'incomingMessages': []
		}
	},

	toggle() {
		let status = ((this.state.display === true) ? false : true);
		this.setState({
			'open': status
		});
	},

	saveNumber() {
		Store.dispatch({
			'type': 'SOCKET_OUT_MSG',
			'message': {
				'type': 'number',
				'number': this.state.tempvalue
			}
		});
	},

	saveTempNumber(event) {
		this.setState({
			'tempvalue': event.target.value
		});
	},

	componentDidMount() {
		Store.subscribe(function() {
			let currentStore = Store.getState();
			if(currentStore.socketReducer.incomingMessages.length > this.state.incomingMessages.length) {
				let messages = currentStore.socketReducer.incomingMessages.slice(0);
				let message = messages.pop();
				this.setState({
					'incomingMessages': currentStore.socketReducer.incomingMessages.slice(0)
				});
				if('type' in message && message.type === 'number') {
						if(message.valid === false) {
							this.setState({
								'tempvalue': this.state.number
							});
						}
						else {
							Store.dispatch({
								'type': 'CALLNUMBER_CLEAR',
								'number': this.state.number
							});
						}
						alert(message.message);
				}
			}
		}.bind(this));
	},

	render() {

			return(
				<div>
				{(() => {
					if(this.state.display === true) {
						return (
							<a><input type="tel" placeholder="my tel number" onChange={this.saveTempNumber} value={this.state.tempvalue} /><button className="save" onClick={this.saveNumber}><i className="fa fa-save"></i></button></a>
						)
					}
				})()}
					<button className="cog" onClick={this.toggle}><i className="fa fa-cog"></i></button>
				</div>
			)

	}
});
