import cx from 'classnames';
import React, { useState, useEffect, useCallback } from 'react';

import { STATUS, ACTION } from 'consts';

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
let direction = '';

export default ({colCount = 0, rowCount = 0 }) => {
  return function Snake({ state, send }) {

    const GAME_STATUS = state.str(true);

    const [ x, setX ] = useState(0);
    const [ y, setY ] = useState(0);
    const setPos = {x: setX, y: setY};

    const left = x * boxLen;
    const top = y * boxLen;

    const move = () => {
      const D = ['LEFT', 'UP'].includes(direction) ? -1: 1;
      const XY = ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y';
      setPos[XY](value => value + D);
    };

    const handleKeydown = (e) => {
      if(KEY_MAP.hasOwnProperty(e.keyCode)) {
  
        const curXY = direction ? ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y': '';
        const nextXY = ['LEFT', 'RIGHT'].includes(KEY_MAP[e.keyCode]) ? 'x': 'y';
  
        /** 只能左/右 90度轉彎 */
        
        if(curXY !== nextXY)
          direction = KEY_MAP[e.keyCode];
        
        send(ACTION.GAME.PLAY);

      } else if(e.keyCode === 32) {
        if(state.at(STATUS.GAME.PLAYING)) {
          send(ACTION.GAME.PAUSE);
        } else if (state.at(STATUS.GAME.PAUSE)) {
          send(ACTION.GAME.PLAY);
        } else if (state.at(STATUS.GAME.GAMEOVER)) {
          send(STATUS.GAME.READY);
        }
      }
    };
    
    useEffect(() => {
      window.addEventListener('keydown', handleKeydown);
      return () => {
        window.removeEventListener("keydown", handleKeydown);
      };
    }, [state.value]);

    useEffect(() => {
      if(state.at(STATUS.GAME.READY)) {
        
        direction = '';
        setPos.x(~~(Math.random() * colCount));
        setPos.y(~~(Math.random() * rowCount));
      }
      else if(state.at(STATUS.GAME.PLAYING)) {
        move();
        moveInterval = setInterval(move, duration);
      } else if (state.inMeta('SNAKE_STOP')) {
        clearInterval(moveInterval);
      }
    }, [GAME_STATUS]);

    // 判斷邊界
    useEffect(() => {
      if(x < 0 || y < 0 || x >= colCount || y >= rowCount) {
        const D = ['LEFT', 'UP'].includes(direction) ? -1: 1;
        const XY = ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y';
        setPos[XY](value => value - D);
        send(ACTION.GAME.OVER);
      }
    }, [x, y]);
  
    return (
      <div className={cx(
        style.SnakeWrapper,
        style[GAME_STATUS],
      )}
      style={{
        left, top
      }}>
        <div className={cx(
          style.Snake,
          style[direction],
        )}></div>
      </div>
    );
  };
};