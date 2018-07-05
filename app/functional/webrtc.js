import EventEmitter from "events";
const WebRTCEvents = {
  ONICECANDIDATE: "onicecandidate",
  ONTRACK: "ontrack",
  ONNEGOTIATIONNEEDED: "onnegotiationneeded",
  SIGNALINGSTATECHANGE: "signalingstatechange"
};

const WebRTCPublicEvents = {
  ONICECANDIDATE: "candidate",
  ONSTREAM: "stream",
  OFFER: "offer"
};

import WebRTCAnalyzer from "webrtc-analyzer";
import Debug from "./debug";

export default class WebRTC extends EventEmitter {
  //options.type view | publish
  //options.rtcConfig.iceServers
  //options.rtcConfig.iceTransportPolicy
  //options.rtcConfig.bundlePolicy
  //options.rtcConfig.rtcpMuxPolicy
  //options.rtcConfig.peerIdentity
  //options.rtcConfig.certificates
  //options.rtcConfig.iceCandidatePoolSize
  //options.offer.iceRestart

  constructor(options = {}) {
    super();
    this.options = options;
    this.options.type = this.options.type || "view";
    this.mediaStream = new MediaStream();
    this.pendingCandidatesQueue = [];
    this.debug = new Debug("WebRTC", this.options.debugTag);
    this._start();
  }

  _start() {
    let pcConfig = this._getPCConfiguration();
    this.pc = new RTCPeerConnection(pcConfig);
    this.debug.log("RTCPeerConnection created, configuration:", pcConfig);
    this._setListeners();
  }

  _createOffer(constraints) {
    return new Promise((resolve, reject) => {
      this.debug.log(
        "About the create an offer with the following constrains:",
        constraints
      );
      this.pc.createOffer(constraints).then(
        offer => {
          this.debug.log("Offer created:", offer);
          this.pc.setLocalDescription(offer).then(
            () => {
              this.debug.log("Offer set as local description.");
              resolve(this.pc.localDescription.sdp);
            },
            () => {
              this.debug.error("Failed to set offer as local description.");
              reject();
            }
          );
        },
        () => {
          this.debug.error("Failed to create offer.");
          reject();
        }
      );
    });
  }

  _createAnswer() {
    return new Promise((resolve, reject) => {
      this.pc.createAnswer().then(
        answer => {
          this.debug.log("Answer created:", answer);
          this.pc.setLocalDescription(answer).then(
            () => {
              this.debug.log("Answer set as local description.");
              resolve(this.pc.localDescription.sdp);
            },
            () => {
              this.debug.error("Failed to set answer as local description.");
              reject();
            }
          );
        },
        () => {
          this.debug.error("Failed to create answer.");
          reject();
        }
      );
    });
  }

  createOffer() {
    return this._createOffer(this._getOfferConfiguration());
  }

  createAnswer() {
    return this._createAnswer();
  }

  processOffer(offer) {
    return new Promise((resolve, reject) => {
      let rtcOffer = new RTCSessionDescription({
        type: "offer",
        sdp: offer
      });

      this.pc.setRemoteDescription(rtcOffer).then(
        () => {
          this.debug.log("Offer set as remote description.", rtcOffer);
          resolve();
        },
        () => {
          this.debug.error(
            "Failed to set offer as remote description.",
            rtcOffer
          );
          reject();
        }
      );
    });
  }

  processAnswer(answer) {
    return new Promise((resolve, reject) => {
      let rtcAnswer = new RTCSessionDescription({
        type: "answer",
        sdp: answer
      });

      this.pc.setRemoteDescription(rtcAnswer).then(
        () => {
          this.debug.log("Answer set as remote description.", rtcAnswer);
          resolve();
        },
        error => {
          this.debug.error(
            "Failed to set answer as remote description.",
            error
          );
          reject();
        }
      );
    });
  }

  addIceCandidate(candidate) {
    return new Promise((resolve, reject) => {
      let rtcCandidate = new RTCIceCandidate(candidate);
      this._addIceCandidate(rtcCandidate).then(resolve, reject);
    });
  }

  _addIceCandidate(rtcCandidate) {
    return new Promise((resolve, reject) => {
      this.pc.addIceCandidate(rtcCandidate).then(
        () => {
          this.debug.log("ICE candidate added.", rtcCandidate);
          resolve();
        },
        error => {
          this.debug.error("ICE candidate could not be added.", rtcCandidate);
          reject();
        }
      );
    });
    r;
  }

  addStream(stream) {
    stream.getTracks().forEach(track => {
      this.pc.addTrack(track, stream);
      this.debug.log("Track added to the peer connection.", track);
    });
  }

  _getPCConfiguration() {
    return this.options.rtcConfig || undefined;
  }

  _getOfferConfiguration() {
    let viewOfferOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    };

    let publishOfferOptions = {
      offerToReceiveAudio: false,
      offerToReceiveVideo: false
    };

    if (this.options.type === "view") {
      return viewOfferOptions;
    } else {
      return publishOfferOptions;
    }
  }

  destroy() {
    if (this.pc) {
      this.pc.close();
      this.debug.log("Destroying WebRTC, PeerConnection closed.");
    }
    if (this.debug.isDebug()) {
      this.webRTCAnalyzer.destroy();
    }
  }

  _isMediaStreamReady() {
    let isAudio = false;
    let isVideo = false;
    this.mediaStream.getTracks().forEach(track => {
      if (track.kind === "audio") {
        isAudio = true;
      }
      if (track.kind === "video") {
        isVideo = true;
      }
    });

    if (isAudio && isVideo) {
      return true;
    }
    return false;
  }

  _setListeners() {
    this.pc[WebRTCEvents.ONICECANDIDATE] = evt => {
      if (evt.candidate) {
        this.debug.log("ICE candidate generated.", evt.candidate);
        this.emit(WebRTCPublicEvents.ONICECANDIDATE, evt.candidate);
      } else {
        this.debug.log("Empty ICE candidate generated.", evt);
      }
    };

    this.pc[WebRTCEvents.ONTRACK] = evt => {
      this.mediaStream.addTrack(evt.track);
      this.debug.log("Track added to the media stream.");
      if (this._isMediaStreamReady()) {
        this.debug.log("Stream is ready.");
        this.emit(WebRTCPublicEvents.ONSTREAM, this.mediaStream);
      }
    };

    if (this.debug.isDebug()) {
      this.webRTCAnalyzer = new WebRTCAnalyzer({
        peerConnection: this.pc,
        interval: 3000
      });
    }
  }
}
