import React, { useEffect, useRef, useState } from "react";
import "../VideoCallModal.css"

type VideoCallModalProps = {
  friendName: string;
  onEndCall: () => void;
};

const servers = {
    iceServers:[
        {
            urls:['stun:stun.l.google.com:19302','stun:stun.l.google.com:5349','stun:stun1.l.google.com:3478','stun:stun1.l.google.com:5349']
        }
    ]
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ friendName, onEndCall}) => {
     const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream,setRemoteStream] = useState<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  
  useEffect(() => {
  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setLocalStream(stream);
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  setupMedia();
  createOffer();
}, []);

useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  let createOffer = async ()=>{
    const peerConnection = new RTCPeerConnection(servers);

    setRemoteStream(new MediaStream());

    localStream?.getTracks().forEach((track)=>{
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track)=>{
            remoteStream?.addTrack(track);
        });
    }

    peerConnection.onicecandidate = async(event)=>{
        if(event.candidate){
            console.log("ice candidates", event.candidate);
        }
    }

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("offer", offer);
  }

  return (
    <div className="modal-overlay">
      <div className="video-modal">
        <div className="modal-header">{friendName}</div>

        <div className="video-content">
          <video ref={remoteVideoRef} className="friend-video player" autoPlay playsInline></video>
          <video ref={localVideoRef} className="your-video player" autoPlay playsInline></video>
        </div>

        <div className="video-controls">
          <button className="call-btn">🎤</button>
          <button className="call-btn">🎥</button>
          <button className="call-btn end" onClick={onEndCall}>❌</button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
