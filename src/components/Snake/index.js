import React from 'react';
import cx from 'classnames';

import style from './style.module.scss';

export const boxLen = +style.boxLen;
export const duration = +style.duration;

export default function Snake({ direction, pos }) {

  const left = pos.x * boxLen;
  const top = pos.y * boxLen;

  return (
    <div className={style.SnakeWrapper} style={{
      left, top
    }}>
      <div className={cx(style.Snake, style[direction])}></div>
    </div>
  );
}
