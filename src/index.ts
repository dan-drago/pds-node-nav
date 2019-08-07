import { PDSNodeNavSceneManager } from './PDSNodeNav/PDSNodeNavSceneManager';
import './global.scss';

let demo: PDSNodeNavSceneManager;

/**
 * Create threeJs canvas and inject into container
 */
function initThreeJs() {
  const containerId = 'canvas-container';
  const canvasContainer = document.getElementById('canvas-container');
  if (!!canvasContainer) {
    demo = new PDSNodeNavSceneManager(canvasContainer, cbUpdateInfoPanel);
  } else {
    throw new Error('No container with id ' + containerId + ' found!!!');
  }
}
initThreeJs();

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
// if (process.env.NODE_ENV === 'development') displayFpsStats();

//
// Set up listeners
//

// Home Page Button
const homePageButton = document.getElementById('home-button');
if (!!homePageButton) {
  homePageButton.onclick = (e: MouseEvent) => {
    e.preventDefault();
    console.log('!!!');

    if (!!demo) demo.zoomToPDSNode('Small Bodies Node');
  };
} else throw new Error('No home-page div found!');

async function cbUpdateInfoPanel(
  title: string,
  text: string,
  websiteUrl: string,
  websiteImage: string
) {
  //
  console.log('~~~~~');

  // Slide content offscreen
  const infoPanelContent = document.getElementById('info-panel-content');
  if (!infoPanelContent) throw new Error('No div with id "info-panel-content"');
  const width = infoPanelContent.offsetWidth;
  console.log('--->>>>', width);
  infoPanelContent.style.transition = `transform 300ms ease-out`;
  await setTimeoutW(() => (infoPanelContent.style.transform = `translateX(${width}px)`), 300);

  // Set title
  const infoPanelTitle = document.getElementById('info-panel-title');
  if (!!infoPanelTitle) {
    infoPanelTitle.innerText = title;
  } else {
    throw new Error("No div with 'info-panel-title' id found");
  }

  // Set Website image
  const infoPanelImg = document.getElementById('info-panel-image') as HTMLImageElement;
  if (!!infoPanelImg) {
    infoPanelImg.src = !!websiteImage ? websiteImage : '/images/pirates.jpg';
  } else {
    throw new Error("No div with 'info-panel-image' id found");
  }

  // Set text
  const infoPanelTextSpan = document.getElementById('info-panel-text');
  if (!!infoPanelTextSpan) {
    infoPanelTextSpan.innerHTML = text;
  } else {
    throw new Error("No div with 'info-panel-text' id found");
  }

  // Slide in content
  await setTimeoutW(() => (infoPanelContent.style.transform = `translateX(0px)`), 300);
  // infoPanelContent.style.transition = `transform 300ms ease-out`;
  // infoPanelContent.style.transform = `translateX(${width}px)`;
  // infoPanelContent.style.transform = `translateX(0px)`;
}

async function setTimeoutW(cb: any, t: number) {
  return new Promise((resolve, reject) => {
    cb();
    setTimeout(() => {
      resolve();
    }, t);
  });
}
