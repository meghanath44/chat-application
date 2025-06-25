import React, { useEffect, useRef, useState } from "react";
import "../VideoCallModal.css";
import type { HubConnection } from "@microsoft/signalr";

type VideoCallModalProps = {
  callFlag: string;
  setCallFlag: (callFlag: string) => void;
  connection: signalR.HubConnection | undefined;
  friendName: string;
  onEndCall: () => void;
};

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  callFlag,
  setCallFlag,
  connection,
  friendName,
  onEndCall,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [videoFlag, setVideoFlag] = useState(true);
  const [audioFlag, setAudioFlag] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isConnectedRef = useRef(false);

  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ];

  const setupMedia = async () => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);
    } catch (err) {
      console.log("Error accessing media devices.", err);
    }
  };

  useEffect(() => {
    if (!isConnectedRef.current) {
      isConnectedRef.current = true;
      const iceConfig: RTCConfiguration = {
        iceServers,
      };
      const peerConnection = new RTCPeerConnection(iceConfig);
      peerConnectionRef.current = peerConnection;

      if (connection) {
        connection.on("ReceiveOffer", async (sender: string, offer) => {
          setCallFlag("in");
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(offer))
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          const ans = JSON.stringify(answer);
          const sen = sender;
          connection.invoke("SendAnswer", sen, ans);
        });

        connection.on("ReceiveAnswer", async (sender, answer) => {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(answer))
          );
        });

        connection.on("ReceiveIceCandidate", async (sender, candidate) => {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(JSON.parse(candidate))
            );
          } catch (err) {
            console.error("Error adding received ice candidate", err);
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    setupMedia();

    localStreamRef.current?.getTracks().forEach((track) => {
        if (peerConnectionRef.current && localStreamRef.current)
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
      });

      const rStream = new MediaStream();
      remoteStreamRef.current = rStream;
      setRemoteStream(rStream);

      if (peerConnectionRef.current) {
        peerConnectionRef.current.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStreamRef.current?.addTrack(track);
          });
          setRemoteStream(remoteStreamRef.current);
        };
      }

    if (callFlag === "out" && peerConnectionRef.current)
      createOffer(peerConnectionRef.current, connection);
  }, [callFlag]);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [localStreamRef.current, remoteStreamRef.current]);

  let createOffer = async (
    peerConnection: RTCPeerConnection,
    connection: HubConnection | undefined
  ) => {

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && connection) {
        connection.invoke(
          "SendIceCandidate",
          friendName,
          JSON.stringify(event.candidate)
        );
        console.log("ice candidates", event.candidate);
      } else {
        console.log("All ICE candidates have been gathered");
      }
    };


    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    if (connection) {
      connection.invoke("SendOffer", friendName, JSON.stringify(offer));
      console.log("offer", offer);
    }
  };

  return callFlag === "" ? (
    <div></div>
  ) : (
    <div className="modal-overlay">
      <div className="video-modal">
        <div className="modal-header">{friendName}</div>
        <div className="video-content">
          <video
            ref={remoteVideoRef}
            className="friend-video player"
            autoPlay
            playsInline
            muted={false}
          ></video>
          <video
            ref={localVideoRef}
            className="your-video player"
            autoPlay
            playsInline
            muted={false}
          ></video>
        </div>
        {callFlag == "out" ? (
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
            <button className="call-btn end" onClick={onEndCall}>
              ❌
            </button>
          </div>
        ) : (
          <div className="video-controls">
            <button className="call-btn accept">🎤</button>
            <button className="call-btn end" onClick={onEndCall}>
              ❌
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;
