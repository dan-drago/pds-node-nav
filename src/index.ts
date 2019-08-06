import { PDSNodeNavSceneManager } from './PDSNodeNav/PDSNodeNavSceneManager';
import './global.scss';

let demo: PDSNodeNavSceneManager;

initThreeJs();
// if (process.env.NODE_ENV === 'development') displayFpsStats();

/**
 * Create threeJs canvas and inject into container
 */
function initThreeJs() {
  const containerId = 'canvas-container';
  const canvasContainer = document.getElementById('canvas-container');
  if (!!canvasContainer) {
    demo = new PDSNodeNavSceneManager(canvasContainer);
  } else {
    throw new Error('No container with id ' + containerId + ' found!!!');
  }
}

/**
 * Loads and runs stats.min.js to display FPS, etc.
 */
function displayFpsStats() {
  const script = document.createElement('script');
  script.onload = () => {
    // @ts-ignore
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
  document.head.appendChild(script);
}

// Set up listeners

// Reset div
// const resetDiv = document.getElementById('reset-view');
// if (!!resetDiv) {
//   resetDiv.onclick = (e: MouseEvent) => {
//     e.preventDefault();
//     if (!!demo) demo.zoomToPDSNode('NASA');
//   };
// } else throw new Error('No reset div found!');

// Home Page
const homePageButton = document.getElementById('home-button');
if (!!homePageButton) {
  homePageButton.onclick = (e: MouseEvent) => {
    e.preventDefault();
    console.log('!!!');

    if (!!demo) demo.zoomToPDSNode('NASA');
  };
} else throw new Error('No home-page div found!');
