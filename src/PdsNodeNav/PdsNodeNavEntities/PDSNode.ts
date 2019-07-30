import * as THREE from 'three';
import { ISceneEntity, SceneEntityBase } from '../../ThreeJsScaffold/scene.entity';
import { ISceneManager } from '../../ThreeJsScaffold/scene.manager';
import { PDSNodeNavSceneManager } from '../PDSNodeNavSceneManager';

export class PDSNode extends SceneEntityBase implements ISceneEntity {
  private _children: PDSNode[] = [];
  private _PdsNodeNavSceneManager: PDSNodeNavSceneManager;

  constructor(
    parentSceneManager: ISceneManager,
    private _parentPDSNode: PDSNode | null,
    private _name: string,
    private _radius: number
  ) {
    super(parentSceneManager);

    this._PdsNodeNavSceneManager = parentSceneManager as any;

    this._sceneEntityGroup.name = _name;

    // Add this node to parent's children
    if (!!_parentPDSNode) _parentPDSNode.addToChildren(this);
  }

  init = () => {
    // const material = new THREE.MeshPhongMaterial();
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const geometry = new THREE.CylinderGeometry(this._radius, this._radius, 0.001, 32);
    const cylinderMesh = new THREE.Mesh(geometry, material);
    cylinderMesh.position.set(0, 0, 0);
    cylinderMesh.rotateX(Math.PI / 2);
    cylinderMesh.name = this._name;
    this._sceneEntityGroup.add(cylinderMesh);

    // Finish
    this._isSceneEntityReady = true;
    this._parentSceneManager.attemptStart();
  };

  update = (time: number) => {
    const t = time * 0.05;
    let orbitalRadius = 0;
    const rf = this._PdsNodeNavSceneManager.getRadiusShrinkFactor();
    if (this._radius === rf) orbitalRadius = 1 / rf;
    if (this._radius === rf * rf) orbitalRadius = 1 / rf;

    orbitalRadius = this._radius * 6;

    const parentPosition = this._parentPDSNode
      ? this._parentPDSNode.getPosition()
      : new THREE.Vector3();

    const siblings: PDSNode[] = this._parentPDSNode ? this._parentPDSNode.getChildren() : [];
    const childPosition = !!siblings ? siblings.indexOf(this) : 0;
    const thetaOffset = !!childPosition ? childPosition / siblings.length : 0;
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
}
