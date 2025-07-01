import React, { useEffect, useRef, useState } from "react";
import "../VideoCallModal.css";

type VideoCallModalProps = {
  callFlag: string;
  setCallFlag: (callFlag: string) => void;
  connection: signalR.HubConnection | undefined;
  selectedFriend: string;
};

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  callFlag,
  setCallFlag,
  connection,
  selectedFriend,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoFlag, setVideoFlag] = useState(true);
  const [audioFlag, setAudioFlag] = useState(true);
  const [friendName, setFriendName] = useState(selectedFriend);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const callFlagRef = useRef<string>(callFlag);
  const isConnectedRef = useRef(false);

  const [callDuration, setCallDuration] = useState(0); // seconds
  const callStartTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ];

  useEffect(() => {
    callFlagRef.current = callFlag;
  }, [callFlag]);

  useEffect(() => {
    setFriendName(selectedFriend);
  }, [selectedFriend]);

  useEffect(() => {
    if (!isConnectedRef.current) {
      isConnectedRef.current = true;
      if (connection) {
        connection.on("ReceiveOffer", async (sender, offer) => {
          console.log("Callee: Offer received from caller.");
          setFriendName(sender);
          setCallFlag("pending");
          callFlagRef.current = "pending";

          const start = Date.now();
          while (
            callFlagRef.current == "pending" &&
            Date.now() - start < 60000
          ) {
            await new Promise((res) => setTimeout(res, 500));
          }

          if (callFlagRef.current == "accept") {
            // 1. Create Peer Connection
            const peerConnection = new RTCPeerConnection({ iceServers });
            peerConnectionRef.current = peerConnection;
            console.log("Callee: Created RTCPeerConnection.");

            // 2. Setup ICE and ontrack handlers
            peerConnection.onicecandidate = (event) => {
              if (event.candidate && connection) {
                connection.invoke(
                  "SendIceCandidate",
                  sender,
                  JSON.stringify(event.candidate)
                );
                console.log("Callee: Sent ICE candidate to caller.");
              }
            };

            const rStream = new MediaStream();
            setRemoteStream(rStream);
            peerConnection.ontrack = (event) => {
              event.streams[0]
                .getTracks()
                .forEach((track) => rStream.addTrack(track));
              console.log("Callee: Added remote track.");
            };

            // 3. Get local media
            const localStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
            setLocalStream(localStream);
            localStream
              .getTracks()
              .forEach((track) => peerConnection.addTrack(track, localStream));
            console.log("Callee: Local media added to peer connection.");

            // 4. Set remote description (Offer)
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(JSON.parse(offer))
            );
            console.log("Callee: Set remote description (Offer).");

            // 5. Create Answer
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            console.log("Callee: Created and set local description (Answer).");

            var callStartTime = Date.now();

            // 6. Send Answer to Caller
            connection.invoke(
              "SendAnswer",
              sender,
              JSON.stringify(answer),
              callStartTime
            );
            console.log("Callee: Sent answer to caller.");

            setCallTimer(callStartTime);
          } else {
            onEndCall();
          }
        });

        connection.on(
          "ReceiveAnswer",
          async (sender, answer, callStartTime) => {
            await peerConnectionRef.current?.setRemoteDescription(
              new RTCSessionDescription(JSON.parse(answer))
            );
            setCallTimer(callStartTime);
          }
        );

        connection.on("ReceiveIceCandidate", async (sender, candidate) => {
          try {
            await peerConnectionRef.current?.addIceCandidate(
              new RTCIceCandidate(JSON.parse(candidate))
            );
          } catch (err) {
            console.error("Error adding received ice candidate", err);
          }
        });

        connection.on("EndCall", () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          callStartTimeRef.current = null;
          setCallDuration(0);
          peerConnectionRef.current?.close();
          peerConnectionRef.current = null;

          localStream?.getTracks().forEach((track) => track.stop());
          remoteStream?.getTracks().forEach((track) => track.stop());

          setLocalStream(null);
          setRemoteStream(null);
          setCallFlag("");
        });
      }

      const setCallTimer = (time: number) => {
        callStartTimeRef.current = time;

        timerRef.current = setInterval(() => {
          if (callStartTimeRef.current) {
            const elapsed = Math.floor(
              (Date.now() - callStartTimeRef.current) / 1000
            );
            setCallDuration(elapsed); // updates every second
          }
        }, 1000);
      };
    }
  }, []);

  useEffect(() => {
    if (callFlag === "out") {
      // 1. Get Local Media
      const setMedia = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setLocalStream(localStream);
        console.log("Caller: Local media stream obtained.");

        // 2. Create PeerConnection
        const peerConnection = new RTCPeerConnection({ iceServers });
        peerConnectionRef.current = peerConnection;
        console.log("Caller: RTCPeerConnection created.");

        // 3. Add Local Tracks
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
          console.log(
            `Caller: Added local ${track.kind} track to peer connection.`
          );
        });

        // 4. Create Remote Media Stream
        const remoteStream = new MediaStream();
        setRemoteStream(remoteStream);
        peerConnection.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
          console.log("Caller: Remote track added.");
        };

        // 5. Handle ICE Candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate && connection) {
            connection.invoke(
              "SendIceCandidate",
              friendName,
              JSON.stringify(event.candidate)
            );
            console.log("Caller: Sent ICE candidate.");
          }
        };

        // 6. Create and Send Offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log("Caller: Offer created and local description set.");

        if (connection) {
          await connection.invoke(
            "SendOffer",
            friendName,
            JSON.stringify(offer)
          );
          console.log("Caller: Offer sent via SignalR.");
        }
      };
      setMedia();
    }
  }, [callFlag]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const onEndCall = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    callStartTimeRef.current = null;
    setCallDuration(0);

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());

    setLocalStream(null);
    setRemoteStream(null);
    setCallFlag("");

    connection?.invoke("EndCall", friendName);
  };

  return callFlag === "" ? null : (
    <div className="modal-overlay">
      {callFlag == "out" || callFlag == "accept" ? (
        <div className="video-modal">
          <div className="modal-header">
            {callDuration == 0
              ? "Ringing...."
              : `Duration: ${String(Math.floor(callDuration / 60)).padStart(
                  2,
                  "0"
                )}:${String(callDuration % 60).padStart(2, "0")}`}
          </div>
          <div className="video-content">
            <div className="video-wrapper">
              <video
                ref={remoteVideoRef}
                className="friend-video player"
                autoPlay
                playsInline
              ></video>
              <div className="video-label">{friendName}</div>
            </div>
            <div className="video-wrapper">
              <video
                ref={localVideoRef}
                className="your-video player"
                autoPlay
                playsInline
                muted
              ></video>
              <div className="video-label">You</div>
            </div>
          </div>
          <div className="video-controls">
            <button
              className="call-btn"
              onClick={() => setAudioFlag(!audioFlag)}
            >
              🎤
            </button>
            <button
              className="call-btn"
              onClick={() => setVideoFlag(!videoFlag)}
            >
              🎥
            </button>
            <button className="call-btn end" onClick={() => onEndCall()}>
              ❌
            </button>
          </div>
        </div>
      ) : (
        <div className="video-modal">
          <div className="modal-header">{friendName}</div>
          <div className="single-video-content">
            <video
              ref={localVideoRef}
              className="your-video player"
              autoPlay
              playsInline
              muted
            ></video>
          </div>
          <div className="video-controls">
            <button
              className="call-btn accept"
              onClick={() => {
                setCallFlag("accept");
              }}
            >
              Answer
            </button>
            <button className="call-btn end" onClick={() => onEndCall()}>
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallModal;
