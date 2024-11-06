import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import WebGLApp from "./webgl-app/webgl-app";
import Sound from "./Sound";
import Splash from "./Splash";

function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const webglRef = useRef<WebGLApp | null>(null);

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    // Initialize WebGLApp and append the WebGLRenderer camvas to rootRef.current

    if (!webglRef.current && rootRef.current) {
      webglRef.current = new WebGLApp(rootRef.current);
    }
  }, []);

  return <div>
    <Splash onClick={() => { setClicked(true) }}/>
    <div ref={rootRef}></div>
    <div className="sound">
      <Sound hasInteracted={clicked}/>
    </div>
  </div>;
}

export default App;
