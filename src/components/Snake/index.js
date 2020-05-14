import cx from 'classnames';
import React, { useState, useEffect } from 'react';

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

let direction = '';
let moveInterval = null;

const getD = direction => direction ? ['LEFT', 'UP'].includes(direction) ? -1: 1: 0;
const getXY = direction => direction ? ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y': '';

/** [{x, y, direction}] */
const bodyArr = [
  {x: 2, y: 3, direction: 'RIGHT'}
];

export default ({colCount = 0, rowCount = 0}) => {
  return function Snake({ state, send }) {

    const GAME_STATUS = state.str(true);

    const [ headX, setHeadX ] = useState(0);
    const [ headY, setHeadY ] = useState(0);
    const setHeadPos = {x: setHeadX, y: setHeadY};

    const move = () => {
      const D = getD(direction);
      const XY = getXY(direction);
      setHeadPos[XY](value => value + D);
      bodyArr[0][XY] += D;
    };

    const handleKeydown = (e) => {
      if(KEY_MAP.hasOwnProperty(e.keyCode)) {
        const curXY = getXY(direction);
        const nextXY = getXY(KEY_MAP[e.keyCode]);
  
        /** 只能左/右 90度轉彎 */
        if(curXY !== nextXY) {
          direction = KEY_MAP[e.keyCode];
          move();
        }

        send(ACTION.GAME.PLAY);

      } else if (e.keyCode === 32) {
        if(state.at(STATUS.GAME.PLAYING)) send(ACTION.GAME.PAUSE);
        else if (state.at(STATUS.GAME.PAUSE)) send(ACTION.GAME.PLAY);
        else if (state.at(STATUS.GAME.GAMEOVER)) send(STATUS.GAME.READY);
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
        setHeadPos.x(3);
        setHeadPos.y(3);
        // setHeadPos.x(~~(Math.random() * colCount));
        // setHeadPos.y(~~(Math.random() * rowCount));
      }
      else if(state.at(STATUS.GAME.PLAYING)) {
        move();
        moveInterval = setInterval(move, duration);
      } else if (state.inMeta('SNAKE_STOP')) {
        clearInterval(moveInterval);
      }
    }, [GAME_STATUS]);

    // 判斷邊界, 還要判斷是否碰到蛇身體
    useEffect(() => {
      if(headX < 0 || headY < 0 || headX >= colCount || headY >= rowCount) {
        const D = getD(direction);
        const XY = getXY(direction);
        setHeadPos[XY](value => value - D);
        send(ACTION.GAME.OVER);
      }
    }, [headX, headY]);

    const top = headY * boxLen;
    const left = headX * boxLen;
  
    return (
      <div
        style={{ left, top }}
        className={cx(style.SnakeWrapper, style[GAME_STATUS])}
      >
        <div className={cx(style.head, style[direction])} />
        {bodyArr.map((part, i) =>
          <div
            key={i}
            className={style.body}
            style={{
              top:  (part.y - headY) * boxLen,
              left: (part.x - headX) * boxLen,
            }}
          />
        )}
      </div>
    );
  };
};