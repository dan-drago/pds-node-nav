import * as THREE from 'three';
import { ISceneEntity, SceneEntityBase } from '../../ThreeJsScaffold/scene.entity';
import { ISceneManager } from '../../ThreeJsScaffold/scene.manager';

export class PDSNode extends SceneEntityBase implements ISceneEntity {
  constructor(
    parentSceneManager: ISceneManager,
    private parentPDSNode: PDSNode | null,
    private radius: number
  ) {
    super(parentSceneManager);
  }

  init = () => {
    // const material = new THREE.MeshPhongMaterial();
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
    const cylinderMesh = new THREE.Mesh(geometry, material);
    cylinderMesh.position.set(0, 0, 0);

    this._sceneEntityGroup.add(cylinderMesh);

    // Finish
    this._isSceneEntityReady = true;
    this._parentSceneManager.attemptStart();
  };

  update = (time: number) => {
    // this._sceneEntityGroup.children.forEach(el => {
    //   el.rotation.x += 0.01;
    //   el.rotation.y += 0.02;
    //   el.position.set(10 * Math.cos(time), 0, 0);
    // });
  };
}
