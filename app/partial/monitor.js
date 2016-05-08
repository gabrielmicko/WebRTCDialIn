import React from 'react';
import Store from 'store';

export default React.createClass({

  getInitialState: function() {
    return {
      'runtime': 6666,
      'callerName': '-',
      'callNumber': ''
    }
  },

  componentDidMount: function() {
    Store.subscribe(function() {
      let currentStore = Store.getState();
      let callNumber = currentStore.dialReducer.callNumber;
      this.setState({
        'callNumber': callNumber.join('')
      })
    }.bind(this))
  },


  formatSeconds: function(sec) {
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

  emptyNumber: function() {
    Store.dispatch({
      'type': 'CALLNUMBER_CLEAR'
    })
  },

  render: function() {
    return (
      <div className="monitorPart grid-container grid-parent">
        <div className="running grid-100 grid-parent">
          {this.formatSeconds(this.state.runtime)}
        </div>
        <div className="caller grid-100 grid-parent">
          {this.state.callerName}
        </div>
        <div className="dialfield grid-100 grid-parent">
          <div className="grid-25 grid-parent">
            number:
          </div>
          <div className="grid-65 grid-parent">
            <input type="tel" value={this.state.callNumber} />
          </div>
          {function(){
            if(this.state.callNumber.length > 0) {
              return (
                  <div className="grid-10 grid-parent">&nbsp;&nbsp;<i onClick={this.emptyNumber} className="fa fa-remove" aria-hidden="true"></i></div>
              )
            }
          }.bind(this)()}
        </div>
      </div>
    );
  }
});
