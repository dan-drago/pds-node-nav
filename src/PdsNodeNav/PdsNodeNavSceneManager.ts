import { SceneManagerBase, ISceneManager } from '../ThreeJsScaffold/scene.manager';
import { MiscHelpers } from './PdsNodeNavEntities/Helpers';
import { DirectionalLight } from './PdsNodeNavEntities/DirectionalLight';
import { PDSNode } from './PdsNodeNavEntities/PDSNode';

export class PDSNodeNavSceneManager extends SceneManagerBase implements ISceneManager {
  constructor(container: HTMLElement) {
    super(container);

    // Style canvas
    container.style.backgroundColor = 'rgba(0,0,0,1)';

    // Create entities
    this._sceneEntities = [
      //
      new DirectionalLight(this),
      new MiscHelpers(this),
      // new SimpleLight(this),
      new PDSNode(this, null, 1)
    ];

    // Set this as entities parent
    this._sceneEntities.forEach(el => el.init());
  }

  updateCamera = (time: number) => {
    //
  };
}
