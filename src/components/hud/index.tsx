import React, {useEffect, useRef} from 'react';
import LoadingHud from './Hud';
import {useStore} from '@/hooks';
import {observer} from 'mobx-react';

/**
 * Will support later.
 * @param {[type]} props [description]
 */
const Hud: React.FC = () => {
  const ref = useRef<LoadingHud | null>();
  // @ts-ignore
  const {hud} = useStore();

  useEffect(() => {
    if (ref.current != null) {
    }
    if (hud.isVisible) {
      ref.current?.show?.();
    } else {
      ref.current?.close?.();
    }
  }, [hud.isVisible]);

  return <LoadingHud ref={node => (ref.current = node)} />;
};

export default observer(Hud);
