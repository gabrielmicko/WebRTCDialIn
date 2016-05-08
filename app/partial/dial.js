import React from 'react';
import Store from 'store';
export default React.createClass({

  getInitialState() {
    return {
      'micStatus': true,
      'webcamStatus': true,
      'dialStatus': false
    }
  },

  buttonClick: function(event) {
    Store.dispatch({
      'type': 'CALLNUMBER_UPDATE',
      'number': event.target.innerText
    });
  },

  render: function() {
    return (
        <div className="dialPart grid-container grid-parent">
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>1</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>2</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>3</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>4</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>5</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>6</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>7</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>8</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>9</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>+</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>0</button></div>
          <div className="grid-33 tablet-grid-33 mobile-grid-33 grid-parent"><button onClick={this.buttonClick}>#</button></div>
          <div className="grid-25 tablet-grid-25 mobile-grid-25 grid-parent cam">
            <button className="red">
              <i className="fa fa-video-camera" aria-hidden="true"></i>
            </button>
          </div>

          {(() => {
            if(this.state.dialStatus === false) {
              return (
                <div className="grid-50 tablet-grid-50 mobile-grid-50 grid-parent dial">
                  <button className="green">
                    <i className="fa fa-phone" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Dial
                  </button>
                </div>
              )
            }
            else {
              return (
                <div className="grid-50 tablet-grid-50 mobile-grid-50 grid-parent hang-up">
                  <button className="red">
                    <i className="fa fa-stop" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Hang up
                  </button>
                </div>
              )
            }
          })()}


          <div className="grid-25 tablet-grid-25 mobile-grid-25 grid-parent mic">
            <button className="red">
              {(() => {
                if(this.state.micStatus === true) {
                  return (
                    <i className="fa fa-microphone" aria-hidden="true"></i>
                  )
                }
                else {
                  <i className="fa fa-microphone-slash" aria-hidden="true"></i>
                }
              })()}
            </button>
          </div>
        </div>
    );
  }

});
