
import { useState } from "react";
import "./Splash.css";

function Splash(props: { onClick: Function; }) {

  const [isOpen, setIsOpen] = useState(true);

  function start() {
    setIsOpen(false);
    props.onClick();
  }


  return (
    <div className={isOpen ? 'splash' : 'splash hidden'}>

      <div className="instructions">
				<p className="title">
					Instructions
				</p>
				<p>
					Click and drag to look around<br/>
					Click speaker icon to mute/unmute
				</p>
      </div>

      <button className="start-btn"
        onClick={() => {
          start();
        }}
      >
        <span>Start</span>
      </button>
    </div>
  );
};

export default Splash;
