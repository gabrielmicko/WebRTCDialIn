import React from "react";
import { Link } from "react-router";
import Store from "store";

import CallInput from "partial/callinput";
import IncomingCall from "partial/caller";
import OnCall from "partial/oncall";

import SocketConnection from "functional/socket";

export default React.createClass({
  componentDidMount() {
    this.socketConnection = new SocketConnection();
  },
  render: function() {
    return (
      <main className="grid-container grid-parent mainPage">
        <div className="grid-100">
          <OnCall />
          <IncomingCall />
          <CallInput />
        </div>
      </main>
    );
  }
});
