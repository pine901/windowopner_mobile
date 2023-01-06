import {types} from 'mobx-state-tree';

const tag = 'MST.Hud::';

const Hud = types
  .model('Hud', {
    isVisible: false,
  })
  .actions(self => ({
    show: () => {
      self.isVisible = true;
    },
    hide: () => {
      self.isVisible = false;
    },
  }));

export default Hud;
