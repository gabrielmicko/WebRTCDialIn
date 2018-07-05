import Store from "store";
import WebRTC from "./webrtc";
import WebRTCAdapter from "webrtc-adapter";

class Caller {
  constructor() {
    this.incomingMessages = [];
    this.master = false;
    this.webrtcInstance = null;
  }

  init(master = false) {
    this.master = master;
    let currentStore = Store.getState();
    this.getUserMedia({
      audio: currentStore.webrtcReducer.mic,
      video: currentStore.webrtcReducer.cam
    }).then(
      function(mediaStream) {
        Store.dispatch({
          type: "SET_MY_VID",
          video: mediaStream
        });
        Store.dispatch({
          type: "SHOW_ON_CALL",
          showOnCall: true
        });

        this.createPC(mediaStream);
      }.bind(this)
    );
  }

  getUserMedia(params) {
    return navigator.mediaDevices.getUserMedia(params);
  }

  createPC(mediaStream) {
    this.webrtcInstance = new WebRTC({
      type: "view",
      rtcConfig: {
        iceServer: this.getIce()
      }
    });

    this.webrtcInstance.on("stream", mediaStream => {
      console.log("Incoming stream.");
      Store.dispatch({
        type: "SET_YOUR_VID",
        video: mediaStream
      });
    });

    /* myPc.onaddstream = function(event) {
      console.log("Incoming stream.");
      if (!event.stream) {
        return;
      }
      let streamObj = window.URL.createObjectURL(event.stream);

      Store.dispatch({
        type: "SET_YOUR_VID",
        video: streamObj
      });
    }; */

    this.webrtcInstance.addStream(mediaStream);

    //myPc.addStream(mediaStream);

    this.webrtcInstance.on("candidate", candidate => {
      let currentStore = Store.getState();
      Store.dispatch({
        type: "SOCKET_OUT_MSG",
        message: {
          type: "candidate",
          number: currentStore.callReducer.acceptedFrom,
          message: candidate
        }
      });
    });

    /* myPc.onicecandidate = function(event) {
      if (!event || !event.candidate) return;
      let currentStore = Store.getState();
      Store.dispatch({
        type: "SOCKET_OUT_MSG",
        message: {
          type: "candidate",
          number: currentStore.callReducer.acceptedFrom,
          message: event.candidate
        }
      });
    }; */
    this.setCommunicationRelay();
    if (this.master === true) {
      this.createOffer();
    }
  }

  createOffer() {
    try {
      let currentStore = Store.getState();

      this.webrtcInstance.createOffer().then(
        offer => {
          console.log("Create offer.");
          console.log("Set local description succeed.");
          let currentStore = Store.getState();
          Store.dispatch({
            type: "SOCKET_OUT_MSG",
            message: {
              type: "offer",
              number: currentStore.callReducer.acceptedFrom,
              message: offer
            }
          });
        },
        () => {
          console.log("Set local description failed.");
          console.log("Creating offer failed.");
        }
      );

      /* myPc.createOffer(
        function(offer) {
          console.log("Create offer.");
          myPc.setLocalDescription(
            offer,
            function() {
              console.log("Set local description succeed.");
              let currentStore = Store.getState();
              Store.dispatch({
                type: "SOCKET_OUT_MSG",
                message: {
                  type: "offer",
                  number: currentStore.callReducer.acceptedFrom,
                  message: offer
                }
              });
            },
            function() {
              console.log("Set local description failed.");
            }
          );
        }.bind(this),
        function() {
          console.log("Creating offer failed.");
        },
        {
          mandatory: this.getConstrains()
        }
      ); */
    } catch (e) {
      console.log(e);
    }
  }

  createAnswer(offer) {
    console.log("Creating answer.");
    this.webrtcInstance.processOffer(offer).then(
      () => {
        console.log("Remote SDP attached.");
        console.log("Create answer");
        this.webrtcInstance.createAnswer().then(
          answer => {
            this.applyCandidates();
            let currentStore = Store.getState();

            console.log("Sending answer");
            Store.dispatch({
              type: "SOCKET_OUT_MSG",
              message: {
                type: "answer",
                number: currentStore.callReducer.acceptedFrom,
                message: answer
              }
            });
          },
          () => {
            console.log("Failed to create answer.");
          }
        );
      },
      () => {
        console.log("Falied to attach remote SDP.");
      }
    );
    /* myPc.setRemoteDescription(
      new (this.getSessionDescription())(offer),
      function() {
        console.log("Remote SDP attached.");
      },
      function() {
        console.log("Falied to attach remote SDP.");
      }
    ); 

    myPc.createAnswer(
      function(answer) {
        myPc.setLocalDescription(
          answer,
          function() {
            console.log("Answer as my SDP.");
            this.applyCandidates();
          }.bind(this),
          function() {
            console.log("Failed to attach remote sdp.");
          }
        );
        console.log("Answer created.");

        let currentStore = Store.getState();

        console.log("Sending answer");
        Store.dispatch({
          type: "SOCKET_OUT_MSG",
          message: {
            type: "answer",
            number: currentStore.callReducer.acceptedFrom,
            message: answer
          }
        });
      }.bind(this),
      function() {
        console.log("Creating answer failed.");
      },
      {
        mandatory: this.getConstrains()
      }
    );
    */
  }
  storeCandidate(candidate) {
    Store.dispatch({
      type: "ADD_CANDIDATE",
      candidate: candidate
    });
  }

  applyCandidates() {
    console.log("Applying candidates");
    let currentStore = Store.getState();
    console.log("LEN", currentStore.webrtcReducer.candidates.length);
    if (currentStore.webrtcReducer.candidates.length < 2) {
      setTimeout(this.applyCandidates.bind(this), 1000);
      return false;
    }
    currentStore.webrtcReducer.candidates.forEach(candidate => {
      //let iceCandidate = new (this.getCandidate())(candidate);
      //console.log("CC");
      console.log(candidate);
      this.webrtcInstance.addIceCandidate(candidate).then(
        () => {
          console.log("Candidate added.");
        },
        () => {
          console.log("Failed to add candidate");
        }
      );
      /* myPc.addIceCandidate(
          iceCandidate,
          function() {
            console.log("Candidate added.");
          },
          function(e) {
            console.log(iceCandidate);
            console.log(e);
            console.log("Failed to add candidate");
          }
        ); */
    });
  }

  applyAnswer(answer) {
    this.webrtcInstance.processAnswer(answer).then(
      () => {
        console.log("Remote SDP Answer attached.");
        this.applyCandidates();
      },
      () => {
        console.log("FAILED: Remote SDP Answer attached.");
      }
    );
    /* console.log("Answer receiver", answer);
    let sdpObj = this.getSessionDescription();
    let sdpAnsw = new sdpObj(answer);
    console.log(sdpAnsw);
    myPc.setRemoteDescription(
      sdpAnsw,
      function(answer) {
        console.log("Remote SDP Answer attached.");
        this.applyCandidates();
      }.bind(this),
      function(e) {
        console.log(e);
        console.log("FAILED: Remote SDP Answer attached.");
      }
    ); */
  }

  setCommunicationRelay() {
    Store.subscribe(
      function() {
        let currentStore = Store.getState();
        if (
          currentStore.socketReducer.incomingMessages.length >
          this.incomingMessages.length
        ) {
          let messages = currentStore.socketReducer.incomingMessages.slice(0);
          let message = messages.pop();
          this.incomingMessages = currentStore.socketReducer.incomingMessages.slice(
            0
          );

          switch (message.type) {
            case "offer":
              this.createAnswer(message.message);
              break;

            case "answer":
              this.applyAnswer(message.message);
              break;

            case "candidate":
              console.log("INCOMING cand");
              this.storeCandidate(message.message);
              break;
          }
        }
      }.bind(this)
    );
  }

  getIce() {
    return [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ];
  }
}

export default Caller;
