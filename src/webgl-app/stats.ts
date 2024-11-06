import { WebGLRenderer } from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";

class ThreeRenderStats {
  lastTime = Date.now();
  msTexts: Array<HTMLElement> = [];
  dom: HTMLElement = document.createElement("div");

  constructor() {
    this.dom.style.cssText = "width:80px;opacity:0.9;cursor:pointer;";

    const msDiv = document.createElement("div");
    msDiv.style.cssText =
      "padding:0 0 3px 3px;text-align:left;background-color:rgb(0, 0, 0);";
    this.dom.appendChild(msDiv);

    const nLines = 11;
    for (let i = 0; i < nLines; i++) {
      this.msTexts[i] = document.createElement("div");
      this.msTexts[i].style.cssText =
        "color:rgb(255, 255, 255);background-color:rgb(0, 0, 0);font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
      msDiv.appendChild(this.msTexts[i]);
      this.msTexts[i].innerHTML = "-";
    }
  }

  getMaxMemory() {
    return Math.round(
      // @ts-ignore
      window.performance.memory
        ? // @ts-ignore
          window.performance.memory.jsHeapSizeLimit / 1048576
        : 0
    );
  }

  getCurrentMemory() {
    return Math.round(
      // @ts-ignore
      window.performance && window.performance.memory
        ? // @ts-ignore
          window.performance.memory.usedJSHeapSize / 1048576
        : 0
    );
  }

  update(webglRenderer: WebGLRenderer) {
    // refresh only 30time per second
    if (Date.now() - this.lastTime < 1000 / 30) return;
    this.lastTime = Date.now();

    this.msTexts[0].textContent = `=== Content ===`;
    this.msTexts[1].textContent = `Programs: ${webglRenderer.info.programs?.length}`;
    this.msTexts[2].textContent = `Geometries: ${webglRenderer.info.memory.geometries}`;
    this.msTexts[3].textContent = `Textures: ${webglRenderer.info.memory.textures}`;
    this.msTexts[4].textContent = `=== Render ===`;
    this.msTexts[5].textContent = `Calls: ${webglRenderer.info.render.calls}`;
    this.msTexts[6].textContent = `Triangles: ${webglRenderer.info.render.triangles}`;
    this.msTexts[7].textContent = `Lines: ${webglRenderer.info.render.lines}`;
    this.msTexts[8].textContent = `Points: ${webglRenderer.info.render.points}`;
    this.msTexts[9].textContent = `=== System ===`;
    this.msTexts[10].textContent = `Memory: ${this.getCurrentMemory()}mb/${this.getMaxMemory()}`;
  }
}

export enum RenderStatsPosition {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}

export type RenderStatOptions = {
  parent: HTMLElement;
  position: {
    alignment: RenderStatsPosition;
    x: number;
    y: number;
    unit: "px" | "rem";
  };
};

export default class RenderStats {
  stats!: Stats;
  renderStats!: ThreeRenderStats;
  options: RenderStatOptions;
  container = document.createElement("div");

  constructor(options: RenderStatOptions) {
    this.options = options;
    // @ts-ignore
    this.stats = new Stats();
    this.renderStats = new ThreeRenderStats();
    this.container.style.cssText = `position:fixed;z-index:10000;`;
    this.container.style.cssText += this.getStyle(options);
    this.stats.dom.style.cssText = "top:0;left:0;cursor:pointer;opacity:0.9;";
    options.parent.appendChild(this.container);
    this.container.appendChild(this.stats.dom);
    this.container.appendChild(this.renderStats.dom);
  }

  toggle(visible: boolean) {
    this.container.style.display = visible ? "block" : "none";
  }

  getStyle(options: RenderStatOptions) {
    const { x, y, unit, alignment } = options.position;
    switch (alignment) {
      case RenderStatsPosition.TopLeft:
        return `top:${y}${unit};left:${x}${unit}`;
      case RenderStatsPosition.TopRight:
        return `top:${y}${unit};right:${x}${unit}`;
      case RenderStatsPosition.BottomLeft:
        return `bottom:${y}${unit};left:${x}${unit}`;
      default:
        return `bottom:${y}${unit};right:${x}${unit}`;
    }
  }

  update(
    renderer: WebGLRenderer,
    updateStats = true,
    updateRenderStats = true
  ) {
    if (updateStats) this.stats.update();
    if (updateRenderStats) this.renderStats.update(renderer);
  }
}
