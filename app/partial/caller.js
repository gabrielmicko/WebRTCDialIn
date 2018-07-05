import React from "react";
import Store from "store";
import Caller from "functional/caller";

export default React.createClass({
  getInitialState() {
    return {
      display: false,
      incomingMessages: [],
      number: "" //who is calling
    };
  },

  componentDidMount() {
    Store.subscribe(
      function() {
        let currentStore = Store.getState();

        if (
          currentStore.socketReducer.incomingMessages.length >
          this.state.incomingMessages.length
        ) {
          let messages = currentStore.socketReducer.incomingMessages.slice(0);
          let message = messages.pop();
          this.setState({
            incomingMessages: currentStore.socketReducer.incomingMessages.slice(
              0
            )
          });
          if ("type" in message && message.type === "incoming_call") {
            this.setState({
              display: true,
              number: message.number
            });
          }
        }
      }.bind(this)
    );
  },

  acceptCall() {
    if (this.state.number.length > 0) {
      Store.dispatch({
        type: "SOCKET_OUT_MSG",
        message: {
          type: "incoming_call_accepted",
          number: this.state.number
        }
      });

      Store.dispatch({
        type: "ACCEPTED_FROM",
        acceptedFrom: this.state.number
      });

      this.setState({
        display: false
      });

      let webRTC = new Caller();
      webRTC.init();
    }
  },

  refuseCall() {
    this.setState({
      display: false,
      number: ""
    });
  },
  render() {
    return (
      <div>
        {(() => {
          if (this.state.display === true) {
            return (
              <div className="grid-container grid-parent incomingCall box-b">
                <div className="grid-100">
                  <h2>Incoming call!</h2>
                  <p>
                    <strong>{this.state.number}</strong> is calling you.
                  </p>
                  <button
                    className="acceptCallButton"
                    onClick={this.acceptCall}
                  >
                    <i className="fa fa-phone" />&nbsp;&nbsp;&nbsp;Accept
                  </button>
                  <button
                    className="refuseCallButton"
                    onClick={this.refuseCall}
                  >
                    <i className="fa fa-remove" />&nbsp;&nbsp;&nbsp;Refuse
                  </button>
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
});
