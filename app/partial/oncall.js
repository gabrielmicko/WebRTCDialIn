import React from 'react';
import Store from 'store';
import WebRTC from 'functional/webrtc';

export default React.createClass({

	getInitialState() {
		return {
			'display': false,
			'incomingMessages': [],
			'number': '',
			'myVideoBlob': '',
			'yourVideoBlob': ''
		}
	},

  formatSeconds(sec) {
    function getHours(sec) {
      let hours = Math.floor(sec / 60 / 60);
      return {
        'hours': hours,
        'remaining': sec - (hours * 60 * 60)
      }
    }

    function getMinutes(sec) {
      let minutes = Math.floor(sec / 60);
      return {
        'minutes': minutes,
        'remaining': sec - (minutes * 60)
      }
    }

    function doubleChar(sec) {
      if(sec < 9) {
        return '0' + sec;
      }
      return sec;
    }
    let hoursData = getHours(sec);
    let hours = doubleChar(hoursData.hours);

    let minutesData = getMinutes(hoursData.remaining);
    let minutes = doubleChar(minutesData.minutes);

    let seconds = doubleChar(minutesData.remaining);

    return hours + ':' + minutes + ':' + seconds;
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
							'number': message.number
						});

						let webRTC = new WebRTC();
						webRTC.init(true);
				}
			}

			if(currentStore.webrtcReducer.myVideoBlob !== false) {
					this.setState({
						'myVideoBlob': currentStore.webrtcReducer.myVideoBlob
					});
			}

			if(currentStore.webrtcReducer.yourVideoBlob !== false) {
					this.setState({
						'yourVideoBlob': currentStore.webrtcReducer.yourVideoBlob
					});
			}

			if(currentStore.webrtcReducer.showOnCall !== null) {
					this.setState({
						'display': currentStore.webrtcReducer.showOnCall
					});
			}

		}.bind(this));
		//Itt kell OFFER, ANSWER, STB
	},

	render() {
		return (
			<div>
			{(() => {
				if(this.state.display === true) {
					return (
						<div className="grid-container grid-parent onCall box">
							<div className="grid-100 grid-parent players">
                <video className="mine" src={this.state.myVideoBlob} autoPlay></video>
                <video className="yours" src={this.state.yourVideoBlob} autoPlay></video>
							</div>
              <div className="grid-100 grid-parent information">
                <div className="grid-50 ">
                  <div className="duration">00:00:00</div>
                  <strong className="talkingWith">{this.state.number}</strong>
                </div>
                <div className="grid-50">
                  <button className="hangUp">Hang up</button>
                </div>
              </div>
						</div>
					)
				}
			})()}
			</div>
		)
	}
});
