import React from 'react';
import cx from 'classnames';

import style from './style.module.scss';

export const boxLen = +style.boxLen;
export const duration = +style.duration;

const KEY_MAP = {
  '37': 'LEFT',
  '38': 'UP',
  '39': 'RIGHT',
  '40': 'DOWN',
};

let moveInterval = null;
let direction = 'RIGHT';

export default (colCount = 0, rowCount = 0) => {
  return function Snake({ direction, pos }) {

    const left = pos.x * boxLen;
    const top = pos.y * boxLen;
  
    return (
      <div className={style.SnakeWrapper} style={{
        left, top
      }}>
        <div className={cx(style.Snake, style[direction])}></div>
      </div>
    );
  };
};