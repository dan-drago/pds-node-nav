import * as THREE from 'three';
import { ISceneEntity, SceneEntityBase } from '../../ThreeJsScaffold/scene.entity';
import { ISceneManager } from '../../ThreeJsScaffold/scene.manager';
import { PDSNodeNavSceneManager } from '../PDSNodeNavSceneManager';
import { PDSData, IPDSDATUM } from '../PDSInfo';

export class PDSNode extends SceneEntityBase implements ISceneEntity {
  private _children: PDSNode[] = [];
  private _PdsNodeNavSceneManager: PDSNodeNavSceneManager;
  private _data: IPDSDATUM;

  constructor(
    parentSceneManager: ISceneManager,
    private _parentPDSNode: PDSNode | null,
    private _name: string,
    private _radius: number
  ) {
    super(parentSceneManager);

    this._PdsNodeNavSceneManager = parentSceneManager as any;

    this._sceneEntityGroup.name = _name;

    if (!PDSData[_name]) throw new Error('Data not found for ' + _name);
    this._data = PDSData[_name];

    // Add this node to parent's children
    if (!!_parentPDSNode) _parentPDSNode.addToChildren(this);
  }

  init = () => {
    // const material = new THREE.MeshPhongMaterial();
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(PDSData[this._name].icon, () => {
        this._isSceneEntityReady = true;
        this._parentSceneManager.attemptStart();
      })
    });

    const geometry = new THREE.CylinderGeometry(this._radius, this._radius, 0.001, 2 * 32);
    const cylinderMesh = new THREE.Mesh(geometry, material);
    cylinderMesh.position.set(0, 0, 0);
    cylinderMesh.rotateX(Math.PI / 2);
    cylinderMesh.rotateY(Math.PI / 2);
    cylinderMesh.name = this._name;

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this._radius, this._radius, this._radius),
      material
    );

    this._sceneEntityGroup.add(cylinderMesh);
    // this._sceneEntityGroup.add(mesh);

    // Finish
    // this._isSceneEntityReady = true;
    // this._parentSceneManager.attemptStart();
  };

  update = (time: number) => {
    //
    // Parameterize orbits as function of radius
    const t = time * 0.025;
    const orbitalRadius = this._radius * 5.3;

    // Determine angular offset by position amongst sibling nodes
    const siblings: PDSNode[] = this._parentPDSNode ? this._parentPDSNode.getChildren() : [];
    const childPosition = !!siblings ? siblings.indexOf(this) : 0;
    const thetaOffset = Math.PI / 2 + (!!childPosition ? childPosition / siblings.length : 0);

    // Calc circular position about parent node
    const parentPosition = this._parentPDSNode
      ? this._parentPDSNode.getPosition()
      : new THREE.Vector3();
    const x = orbitalRadius * Math.cos((Math.PI * t) / orbitalRadius + 2 * Math.PI * thetaOffset);
    const y = orbitalRadius * Math.sin((Math.PI * t) / orbitalRadius + 2 * Math.PI * thetaOffset);
    const newPosition = new THREE.Vector3(parentPosition.x + x, parentPosition.y + y, 0);
    this._sceneEntityGroup.position.set(newPosition.x, newPosition.y, newPosition.z);
  };

  getPosition = (): THREE.Vector3 => this._sceneEntityGroup.position;

  getRadius = () => this._radius;

  getChildPosition = (child: PDSNode): number => {
    const pos = this._children.indexOf(child);
    return pos;
  };

  getChildren = (): PDSNode[] => this._children;

  addToChildren = (child: PDSNode) => {
    this._children.push(child);
  };

  getName = () => this._name;

  getAboutText = () => PDSData[this._name].about;

  getWebsiteUrl = () => PDSData[this._name].websiteUrl;

  getWebsiteImage = () => PDSData[this._name].websiteImage;
}
