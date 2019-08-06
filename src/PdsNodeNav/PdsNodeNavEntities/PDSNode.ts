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
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('/images/' + this.getImageFromName(this._name), () => {
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

  getImageFromName = (name: string) => {
    const nameImagePairs: any = {
      NASA: 'pds.jpg',
      SBN: 'sbn.png',
      'Minor Planets Center': 'mpc.png',
      CATCH: 'catch.png',
      'Planetary Science Institute': 'psi.png',
      'Legacy SBN': 'legacy.png',
      IAWN: 'iawn.png'
    };
    if (!!nameImagePairs[name]) return nameImagePairs[name];
    return 'scipio.jpg';
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
}
