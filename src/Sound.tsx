import React, { useEffect, useState } from "react";
import audio from "./static/ocean-waves.mp3"
import { ReactComponent as SpeakerOn } from "./static/speaker-on.svg";
import { ReactComponent as SpeakerOff } from "./static/speaker-off.svg";

function Sound(props: { interacted: boolean }) {
  const [interacted, setInteracted] = useState(props.interacted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waves] = useState(new Audio(audio));
  waves.loop = true;

  if (props.interacted !== interacted) {
    setInteracted(props.interacted)
    setIsPlaying(props.interacted)
  }

  useEffect(() => {
    isPlaying ? waves.play() : waves.pause();
  }, [isPlaying, waves]);

  
  function toggleSound() {
    setIsPlaying(!isPlaying);
  };

  return (
    <button className="speaker"
      onClick={() => {
        toggleSound();
      }}
    >
      <SpeakerOn className={!isPlaying ? 'hidden' : ''} />
      <SpeakerOff className={isPlaying ? 'hidden' : ''} />
    </button>
  );
};

export default Sound;
