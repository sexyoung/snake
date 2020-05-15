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

let direction = 'RIGHT';
let moveInterval = null;

const getD = direction => direction ? ['LEFT', 'UP'].includes(direction) ? -1: 1: 0;
const getXY = direction => direction ? ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y': '';

/** [{x, y, direction}] */
let bodyArr = [];

const resetBody = () => {
  direction = 'RIGHT';
  bodyArr = [
    {x: 2, y: 3, direction: 'RIGHT'}
  ];
};

export default ({colCount = 0, rowCount = 0}) => {
  return function Snake({ state, send }) {

    const GAME_STATUS = state.str(true);

    // const [ headX, setHeadX ] = useState(3);
    // const [ headY, setHeadY ] = useState(3);
    // const setHeadPos = {x: setHeadX, y: setHeadY};
    const [ headPos, setHeadPos ] = useState({x: 3, y: 3});

    const move = () => {
      const D = getD(direction);
      const XY = getXY(direction);
      
      setHeadPos(headPos => {
        bodyArr[0] = { ...headPos, direction };
        headPos[XY] += D;
        return {...headPos};
      });
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
      resetBody();
    }, []);
    
    useEffect(() => {
      window.addEventListener('keydown', handleKeydown);
      return () => {
        window.removeEventListener("keydown", handleKeydown);
      };
    }, [state.value]);

    useEffect(() => {
      if(state.at(STATUS.GAME.READY)) {
        setHeadPos({x: 3, y: 3});
        resetBody();
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
      if(headPos.x < 0 || headPos.y < 0 || headPos.x >= colCount || headPos.y >= rowCount) {
        const D = getD(direction);
        const XY = getXY(direction);
        // setHeadPos[XY](value => value - D);
        setHeadPos(headPos => {
          headPos[XY] -= D;
          return headPos;
        });
        send(ACTION.GAME.OVER);
      }
    }, [headPos.x, headPos.y]);

    const top = headPos.y * boxLen;
    const left = headPos.x * boxLen;

    if(bodyArr.length)
      console.log(`(${headPos.x},${headPos.y})<-(${bodyArr[0].x},${bodyArr[0].y})`);  

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
              top:  (part.y - headPos.y) * boxLen,
              left: (part.x - headPos.x) * boxLen,
            }}
          />
        )}
      </div>
    );
  };
};