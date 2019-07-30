import * as THREE from 'three';
import { SceneManagerBase, ISceneManager } from '../ThreeJsScaffold/scene.manager';
import { MiscHelpers } from './PdsNodeNavEntities/Helpers';
import { DirectionalLight } from './PdsNodeNavEntities/DirectionalLight';
import { PDSNode } from './PdsNodeNavEntities/PDSNode';
import { distanceBetweenPoints } from 'src/ThreeJsScaffold/utils/threeGeometry';

export class PDSNodeNavSceneManager extends SceneManagerBase implements ISceneManager {
  private _raycaster = new THREE.Raycaster();
  private _mouse = new THREE.Vector2();
  private _zoomingObject: PDSNode | null = null;
  private _isZooming = false;
  private _radiusShrinkFactor = 0.3;

  constructor(container: HTMLElement) {
    super(container);

    this._orbitControls.enabled = false;

    // Set up
    container.style.backgroundColor = 'rgba(0,0,0,1)';
    this._camera.position.set(0, 0, 10);
    this._updateCamera = this.updateCamera;

    // Create nested PDSNodes
    // this.allPDSNodes = {};

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
      // new SimpleLight(this),

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

    // Set up raycasting
    window.addEventListener('click', this.onMouseClick, false);
  }

  onMouseClick = (event: MouseEvent) => {
    // set up raycaster from mouse click
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this._raycaster.setFromCamera(this._mouse, this._camera);
    console.log('>>>', this._mouse.toArray());

    // find all named meshes intersecting the picking ray
    const allMeshes: any[] = [];
    this._scene.children.forEach(el => el.children.forEach(el2 => allMeshes.push(el2)));
    const intersectingMeshes = this._raycaster.intersectObjects(allMeshes);

    // if a mesh is named, zoom the camera to it
    const intersectingMeshesNames = intersectingMeshes.map(el => el.object.name).filter(el => !!el);
    console.log(intersectingMeshesNames);
    if (intersectingMeshesNames.length > 1) throw new Error('Nodes are overlapping somehow');
    else if (intersectingMeshesNames.length === 1) {
      const foundName = intersectingMeshesNames[0];
      this.zoomToPDSNode(foundName);
    }
  };

  updateCamera = (time: number) => {
    //
    if (!!this._zoomingObject) {
      // const newPosition = this._zoomingMesh!.position + new THREE.Vector3();
      const newPosition = this._zoomingObject!.getSceneEntityGroup().position.clone();
      // this._camera.lookAt(newPosition);
      newPosition.setZ(5 * this._zoomingObject.getRadius());
      // console.log(newPosition.toArray());
      const v = this._camera.position.lerp(newPosition, this._isZooming ? 0.1 : 1);
      this._camera.position.set(v.x, v.y, v.z);
      // console.log('x', v.x, v.y, v.z);

      const dist = distanceBetweenPoints(this._camera.position, newPosition);

      if (dist < 0.1) this._isZooming = false;
    }
  };

  zoomToPDSNode = (name: string) => {
    console.log('>>>', name);
    this._sceneEntities.forEach(sceneEntity => {
      // sceneEntity.getSceneEntityGroup().children.forEach(object => {
      const sceneEntityGroup = sceneEntity.getSceneEntityGroup();
      if (sceneEntityGroup.name === name) {
        // object-name match
        // this._zoomel.position.clone();
        console.log('Found Name: ', sceneEntityGroup.name, sceneEntityGroup.type);
        if (sceneEntity instanceof PDSNode) {
          this._zoomingObject = sceneEntity;
          this._isZooming = true;
        }
      }
    });
  };

  getRadiusShrinkFactor = () => this._radiusShrinkFactor;
}
