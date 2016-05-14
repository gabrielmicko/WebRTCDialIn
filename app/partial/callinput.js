import React from 'react';
import Store from 'store';
import WebRTC from 'functional/webrtc';

export default React.createClass({

	getInitialState() {
		let currentStore = Store.getState();
		return {
			'display': true,
			'callNumber': '',
			'callStatus': false,
			'incomingMessages': []
		}
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
				if('type' in message && message.type === 'incoming_call_accepted_fw') {
						this.setState({
							'callStatus': false
						});
				}
			}
		}.bind(this));
		//Itt kell OFFER, ANSWER, STB
	},


	callNumber() {
		Store.dispatch({
			'type': 'ACCEPTED_FROM',
			'acceptedFrom': this.state.callNumber
		});
		console.log('call number dipatched');
		console.log(this.state.callNumber);
		Store.dispatch({
			'type': 'SOCKET_OUT_MSG',
			'message': {
				'type': 'call',
				'number': this.state.callNumber
			}
		});

		this.setState({
			'callStatus': true
		})
	},

	getButtonClass() {
		if(this.state.callStatus === true) {
			return 'fa fa-phone call';
		}
		return 'fa fa-phone';
	},
	setCallNumber(event) {
			this.setState({
				'callNumber': event.target.value
			})
	},
	render() {
		return (
			<div>
			{(() => {
				if(this.state.display === true) {
					return (
						<div className="grid-container grid-parent callInput box">
							<div className="grid-100">
								<label htmlFor="callNumber">Call your Buddy</label>
									<input id="callNumber" type="tel" placeholder="+36 30 935 71 07" onChange={this.setCallNumber} value={this.state.callNumber} />&nbsp;
									<button onClick={this.callNumber}><i className={this.getButtonClass()}></i>&nbsp;&nbsp;&nbsp;Call</button>
							</div>
						</div>
					)
				}
			})()}
			</div>
		)
	}
});
