import React from "react";
import Store from "store";
import Caller from "functional/caller";

export default React.createClass({
  getInitialState() {
    return {
      display: false,
      incomingMessages: [],
      number: "",
      myVideoBlob: "",
      yourVideoBlob: ""
    };
  },

  formatSeconds(sec) {
    function getHours(sec) {
      let hours = Math.floor(sec / 60 / 60);
      return {
        hours: hours,
        remaining: sec - hours * 60 * 60
      };
    }

    function getMinutes(sec) {
      let minutes = Math.floor(sec / 60);
      return {
        minutes: minutes,
        remaining: sec - minutes * 60
      };
    }

    function doubleChar(sec) {
      if (sec < 9) {
        return "0" + sec;
      }
      return sec;
    }
    let hoursData = getHours(sec);
    let hours = doubleChar(hoursData.hours);

    let minutesData = getMinutes(hoursData.remaining);
    let minutes = doubleChar(minutesData.minutes);

    let seconds = doubleChar(minutesData.remaining);

    return hours + ":" + minutes + ":" + seconds;
  },

  updateVideo() {
    setTimeout(() => {
      if (this.state.myVideoBlob) {
        document.querySelector(".yours").srcObject = this.state.myVideoBlob;
      }
      if (this.state.yourVideoBlob) {
        document.querySelector(".mine").srcObject = this.state.yourVideoBlob;
      }
    }, 200);
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
          if (
            "type" in message &&
            message.type === "incoming_call_accepted_fw"
          ) {
            this.setState({
              number: message.number
            });

            let webRTC = new Caller();
            webRTC.init(true);
          }
        }

        if (currentStore.webrtcReducer.myVideoBlob !== false) {
          this.setState({
            myVideoBlob: currentStore.webrtcReducer.myVideoBlob
          });
        }

        if (currentStore.webrtcReducer.yourVideoBlob !== false) {
          this.setState({
            yourVideoBlob: currentStore.webrtcReducer.yourVideoBlob
          });
        }

        if (currentStore.webrtcReducer.showOnCall !== null) {
          this.setState({
            display: currentStore.webrtcReducer.showOnCall
          });
        }
      }.bind(this)
    );
    //Itt kell OFFER, ANSWER, STB
  },

  render() {
    this.updateVideo.call(this);
    return (
      <div>
        {(() => {
          if (this.state.display === true) {
            return (
              <div className="grid-container grid-parent onCall box-b">
                <div className="grid-100 grid-parent players">
                  <video
                    className="mine"
                    autoPlay
                    controls
                    muted={true}
                    playsInline={true}
                  />
                  <video
                    className="yours"
                    autoPlay
                    controls
                    playsInline={true}
                  />
                </div>
                <div className="grid-100 grid-parent information">
                  <div className="grid-50 ">
                    <div className="duration">00:00:00</div>
                    <strong className="talkingWith">
                      Talking with: {this.state.number}
                    </strong>
                  </div>
                  <div className="grid-50">
                    <button className="hangUp">Hang up</button>
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </div>
    );
  }
});
