import React from 'react';
import cx from 'classnames';

import { boxLen } from 'App';

import style from './style.module.scss';

export default function Snake({ coordinate = 0 }) {
  
  const left = (coordinate % 100) * boxLen;
  const top = ~~(coordinate / 100) * boxLen;

  return (
    <div className={style.SnakeWrapper} style={{
      left, top
    }}>
      <div className={cx(style.Snake)}></div>
    </div>
  );
}
