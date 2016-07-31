import Store from 'store';


class WebRTC {

    constructor() {
        this.incomingMessages = [];
        this.master = false;
    }

    init(master = false) {
        this.master = master;
        let currentStore = Store.getState();
        this.getUserMedia({
            'audio': currentStore.webrtcReducer.mic,
            'video': currentStore.webrtcReducer.cam,
        }).then(function(mediaStream) {
            let streamObj = window.URL.createObjectURL(mediaStream);

            Store.dispatch({
                'type': 'SET_MY_VID',
                'video': streamObj
            });
            Store.dispatch({
                'type': 'SHOW_ON_CALL',
                'showOnCall': true
            });

            this.createPC(mediaStream);
        }.bind(this));
    }

    getUserMedia(params) {
        if (navigator.mediaDevices.getUserMedia) {
            return navigator.mediaDevices.getUserMedia(params);
        } else {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            return new Promise(function(resolve, reject) {
                navigator.getUserMedia(params, resolve, reject);
            });
        }
    }

    createPC(mediaStream) {
        console.log('Create peerconn.');
        myPc = new(this.getPC())({
            'iceServers': this.getIce(),
            'mandatory': this.getConstrains()
        });

        myPc.onaddstream = function(event) {
            console.log('Incoming stream.');
            if (!event.stream) {
                return;
            }
            let streamObj = window.URL.createObjectURL(event.stream);

            Store.dispatch({
                'type': 'SET_YOUR_VID',
                'video': streamObj
            });
        };

        myPc.addStream(mediaStream);

        myPc.onicecandidate = function(event) {
            if (!event || !event.candidate) return;
            let currentStore = Store.getState();
            Store.dispatch({
                'type': 'SOCKET_OUT_MSG',
                'message': {
                    'type': 'candidate',
                    'number': currentStore.callReducer.acceptedFrom,
                    'message': event.candidate
                }
            });
        };
        this.setCommunicationRelay();
        if (this.master === true) {
            this.createOffer();
        }

    }

    createOffer() {
        try {

            let currentStore = Store.getState();
            console.log(this);
            myPc.createOffer(
                function(offer) {
                    console.log('Create offer.');
                    myPc.setLocalDescription(
                        offer,
                        function() {
                            console.log('Set local description succeed.');
                            let currentStore = Store.getState();
                            Store.dispatch({
                                'type': 'SOCKET_OUT_MSG',
                                'message': {
                                    'type': 'offer',
                                    'number': currentStore.callReducer.acceptedFrom,
                                    'message': offer
                                }
                            });
                        },
                        function() {
                            console.log('Set local description failed.');
                        }
                    );


                }.bind(this),
                function() {
                    console.log('Creating offer failed.');
                }, {
                    'mandatory': this.getConstrains()
                }
            );
        } catch (e) {
            console.log(e);
        }

    }

    createAnswer(offer) {
        console.log('Create answer');
        myPc.setRemoteDescription(
            new(this.getSessionDescription())(offer),
            function() {
                console.log('Remote SDP attached.');
            },
            function() {
                console.log('Falied to attach remote SDP.');
            }
        )

        myPc.createAnswer(
            function(answer) {
                myPc.setLocalDescription(
                    answer,
                    function() {
                        console.log('Answer as my SDP.')
                        this.applyCandidates();
                    }.bind(this),
                    function() {
                        console.log('Failed to attach remote sdp.');
                    });
                console.log('Answer created.');

                let currentStore = Store.getState();

                console.log('Sending answer')
                Store.dispatch({
                    'type': 'SOCKET_OUT_MSG',
                    'message': {
                        'type': 'answer',
                        'number': currentStore.callReducer.acceptedFrom,
                        'message': answer
                    }
                });

            }.bind(this),
            function() {
                console.log('Creating answer failed.');
            }, {
                'mandatory': this.getConstrains()
            }
        );
    }
    storeCandidate(candidate) {
        Store.dispatch({
            'type': 'ADD_CANDIDATE',
            'candidate': candidate
        });
    }
    applyCandidates() {
        console.log('Applying candidates');
        let currentStore = Store.getState();
        console.log('LEN', currentStore.webrtcReducer.candidates.length);
        if (currentStore.webrtcReducer.candidates.length < 2) {
            setTimeout(this.applyCandidates.bind(this), 1000);
            return false;
        }
        currentStore.webrtcReducer.candidates.forEach(function(candidate) {
            let iceCandidate = new(this.getCandidate())(candidate);
            console.log('CC');
            console.log(candidate);
            myPc.addIceCandidate(iceCandidate, function() {
                    console.log('Candidate added.');
                },
                function(e) {
                    console.log(iceCandidate);
                    console.log(e);
                    console.log('Failed to add candidate');
                });
        }.bind(this));
    }

    applyAnswer(answer) {
        console.log('Answer receiver', answer);
        let sdpObj = this.getSessionDescription();
        let sdpAnsw = new sdpObj(answer);
        console.log(sdpAnsw);
        myPc.setRemoteDescription(
            sdpAnsw,
            function(answer) {
                console.log('Remote SDP Answer attached.');
                this.applyCandidates();
            }.bind(this),
            function(e) {
                console.log(e);
                console.log('FAILED: Remote SDP Answer attached.');
            },
        );


    }


    setCommunicationRelay() {
        Store.subscribe(function() {
            let currentStore = Store.getState();
            if (currentStore.socketReducer.incomingMessages.length > this.incomingMessages.length) {
                let messages = currentStore.socketReducer.incomingMessages.slice(0);
                let message = messages.pop();
                this.incomingMessages = currentStore.socketReducer.incomingMessages.slice(0);

                switch (message.type) {
                    case 'offer':
                        this.createAnswer(message.message);
                        break;

                    case 'answer':
                        this.applyAnswer(message.message);
                        break;

                    case 'candidate':
                        console.log('INCOMING cand');
                        this.storeCandidate(message.message);
                        break;
                }
            }

        }.bind(this));
    }


    getIce() {
        return [{
            urls: "stun:23.21.150.121"
        }, {
            urls: "stun:stun.l.google.com:19302"
        }];
    }

    getPC() {
        let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
        return RTCPeerConnection;
    }

    getCandidate() {
        let RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate;
        return RTCIceCandidate;
    }

    getSessionDescription() {
        let RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
        return RTCSessionDescription;
    }

    getConstrains() {
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
            return {
                'offerToReceiveAudio': true,
                'offerToReceiveVideo': true
            };
        }
        return {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        };
    }

    setListeners() {}


}

export default WebRTC;
