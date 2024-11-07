import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import WebGLApp from "./webgl-app/webgl-app";
import Sound from "./Sound";
import Splash from "./Splash";

let didInit = false;

function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<WebGLApp | null>(null);

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!didInit) {
      initWebGlApp();
      didInit = true;
    }
  }, []);

  function initWebGlApp() {
    if (!webglRef.current && rootRef.current) {
      // Initialize WebGLApp and append the WebGLRenderer canvas to rootRef.current
      webglRef.current = new WebGLApp(rootRef.current);
    }
  }

  return (
    <div>
      <Splash onClick={() => { setClicked(true) }}/>
      <div ref={rootRef}></div>
      <div className="sound">
        <Sound interacted={clicked} />
      </div>
    </div>
  );
}

export default App;
