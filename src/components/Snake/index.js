import React from 'react';
import cx from 'classnames';

import { DIRECTION_MAP } from 'App';

import style from './style.module.scss';

export const boxLen = +style.boxLen;
export const duration = +style.duration;

export default function Snake({ coordinate, direction }) {
  
  const left = (coordinate % 100) * boxLen;
  const top = ~~(coordinate / 100) * boxLen;

  return (
    <div className={style.SnakeWrapper} style={{
      left, top
    }}>
      <div className={cx(style.Snake, style[DIRECTION_MAP[direction]])}></div>
    </div>
  );
}
