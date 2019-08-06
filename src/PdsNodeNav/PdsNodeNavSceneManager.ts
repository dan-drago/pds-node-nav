import * as THREE from 'three';
import { SceneManagerBase, ISceneManager } from '../ThreeJsScaffold/scene.manager';
import { MiscHelpers } from './PdsNodeNavEntities/Helpers';
import { DirectionalLight } from './PdsNodeNavEntities/DirectionalLight';
import { PDSNode } from './PdsNodeNavEntities/PDSNode';
import { distanceBetweenPoints } from 'src/ThreeJsScaffold/utils/threeGeometry';
import { SimpleLight } from './PDSNodeNavEntities/SimpleLight';
import { Clock } from 'three';

export class PDSNodeNavSceneManager extends SceneManagerBase implements ISceneManager {
  private _raycaster = new THREE.Raycaster();
  private _mouse = new THREE.Vector2();
  private _zoomingObject: PDSNode;
  private _zoomClock: THREE.Clock | undefined;
  private _isZooming = false;
  private _radiusShrinkFactor = 0.3; // Factor to shrink nested nodes
  private _mainNode: PDSNode | undefined;
  private _viewHeightParam = 4.0;
  private _isWheelEnabled = !false;

  constructor(container: HTMLElement) {
    super(container);

    // Fix later: we want OCs off only when when zooming
    this._orbitControls.enabled = !true;
    this._orbitControls.enableRotate = false;

    // Set up
    container.style.backgroundColor = 'rgba(0,0,0,1)';
    this._camera.position.set(0, 0, 100);
    this._updateCamera = this.updateCamera;

    // Create nested nodes
    const rf = this._radiusShrinkFactor;
    const lev000 = new PDSNode(this, null, 'NASA', 1);
    const lev110 = new PDSNode(this, lev000, 'SBN', rf);
    const lev120 = new PDSNode(this, lev000, 'Engineering', rf);
    const lev130 = new PDSNode(this, lev000, 'Atmospheres', rf);
    const lev140 = new PDSNode(this, lev000, 'Geosciences', rf);
    const lev150 = new PDSNode(this, lev000, 'Cartography & Imaging', rf);
    const lev160 = new PDSNode(this, lev000, 'Navigational & Ancillary Information', rf);
    const lev170 = new PDSNode(this, lev000, 'Planetary Plasma Interactions', rf);
    const lev180 = new PDSNode(this, lev000, 'Ring-Moon Systems', rf);

    const lev111 = new PDSNode(this, lev110, 'Planetary Science Institute', rf * rf);
    const lev112 = new PDSNode(this, lev110, 'Minor Planets Center', rf * rf);
    const lev113 = new PDSNode(this, lev110, 'IAWN', rf * rf);
    const lev114 = new PDSNode(this, lev110, 'CATCH', rf * rf);
    const lev115 = new PDSNode(this, lev110, 'Legacy SBN', rf * rf);

    // Create entities
    this._sceneEntities = [
      // new DirectionalLight(this),
      // new MiscHelpers(this),
      new SimpleLight(this),

      lev000,
      lev110,
      lev120,
      lev130,
      lev140,
      lev150,
      lev160,
      lev170,
      lev180,
      lev111,
      lev112,
      lev113,
      lev114,
      lev115
    ];

    // Load all entities
    this._sceneEntities.forEach(el => el.init());

    // Define primary, unmoving, parent-less node
    this._mainNode = lev000;

    // Initial zoom to primary node
    this._zoomingObject = lev000;
    // this.resetView();
    this.zoomToPDSNode('NASA');

    // Set up raycasting
    window.addEventListener('click', this.onMouseClick, false);
    window.addEventListener('mouseenter', this.onMouseEnter, false);
    window.addEventListener('mouseleave', this.onMouseLeave, false);

    this._container.onmouseenter = this.onMouseEnter;
    this._container.onmouseleave = this.onMouseLeave;

    window.addEventListener('mousewheel', this.onMouseWheel as any, false);
    window.addEventListener('scroll', this.onMouseWheel as any, false);
  }

  onMouseEnter = (e: MouseEvent) => {
    console.log('@@@');
    this._isWheelEnabled = true;
  };

  onMouseLeave = (e: MouseEvent) => {
    console.log('@@@---');
    this._isWheelEnabled = false;
  };

  onMouseWheel = (e: WheelEvent) => {
    if (!this._isWheelEnabled) return;
    // e.preventDefault();
    const dz = e.deltaY;
    const tryNewZ = this._camera.position.z + dz * 0.01;
    const minZ = this._zoomingObject.getRadius() * this._viewHeightParam;
    const newZ = tryNewZ > minZ ? tryNewZ : minZ;
    this._camera.position.setZ(newZ);
  };

  onMouseClick = (event: MouseEvent) => {
    // Set up raycaster from mouse click; pattern copied from elsewhere
    const rect = this._renderer.domElement.getBoundingClientRect();
    this._mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this._mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this._raycaster.setFromCamera(this._mouse, this._camera);

    // Find all named meshes intersecting the picking ray
    const allMeshesEtc: any[] = [];
    this._scene.children.forEach(group => group.children.forEach(obj => allMeshesEtc.push(obj)));
    const intersectingMeshes = this._raycaster.intersectObjects(allMeshesEtc);

    // If a mesh is named, zoom the camera to it
    const intersectingMeshesNames = intersectingMeshes.map(el => el.object.name).filter(el => !!el);
    if (intersectingMeshesNames.length > 1) throw new Error('Nodes are overlapping somehow');
    else if (intersectingMeshesNames.length === 1) {
      const foundName = intersectingMeshesNames[0];
      this.zoomToPDSNode(foundName);
    }
  };

  zoomToPDSNode = (foundMeshName: string) => {
    // Needed for e.g. reset div overlapping a node
    if (!!this._isZooming) return;

    // Match found mesh name to a sceneEntity and zoom to it
    this._sceneEntities.forEach(sceneEntity => {
      const sceneEntityGroup = sceneEntity.getSceneEntityGroup();
      if (sceneEntityGroup.name === foundMeshName && sceneEntity instanceof PDSNode) {
        this._zoomingObject = sceneEntity;
        this._zoomClock = new THREE.Clock();
        this._isZooming = true;
      }
    });
  };

  updateCamera = (time: number) => {
    if (!!this._zoomingObject && !!this._zoomClock) {
      const targetPosition = this._zoomingObject!.getSceneEntityGroup().position.clone();

      !!this._isZooming
        ? targetPosition.setZ(this._zoomingObject.getRadius() * this._viewHeightParam)
        : targetPosition.setZ(this._camera.position.z);

      const t = this._zoomClock.getElapsedTime();
      let zoomParam = t * t * t * t * t * t * t * t * t * 5.5;
      if (zoomParam > 0.75) zoomParam = 0.75;

      const newPosition = this._camera.position.lerp(
        targetPosition,
        this._isZooming ? zoomParam : 1
      );
      this._camera.position.setX(newPosition.x);
      this._camera.position.setY(newPosition.y);
      if (!!this._isZooming) this._camera.position.setZ(newPosition.z);

      // When close enough, stop fractional movement
      const dist = distanceBetweenPoints(this._camera.position, targetPosition);
      if (dist < 0.005) {
        this._isZooming = false;
      }
    }
  };

  getRadiusShrinkFactor = () => this._radiusShrinkFactor;
}
