import React, { useEffect, useState } from "react";
import audio from "./static/ocean-waves.mp3"
import { ReactComponent as SpeakerOn } from "./static/speaker-on.svg";
import { ReactComponent as SpeakerOff } from "./static/speaker-off.svg";

function Sound(props: { hasInteracted: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waves] = useState(new Audio(audio));
  waves.loop = true;

  function toggleSound() {
    setIsPlaying(!isPlaying);
  };
  
  useEffect(() => {
    if (props.hasInteracted) {
      setIsPlaying(true);
    }
  }, [props.hasInteracted]);

  useEffect(() => {
    isPlaying ? waves.play() : waves.pause();
  }, [isPlaying, waves]);

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
