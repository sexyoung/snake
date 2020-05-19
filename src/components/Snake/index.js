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

let direction = 'RIGHT';
let moveInterval = null;

const getD = direction => direction ? ['LEFT', 'UP'].includes(direction) ? -1: 1: 0;
const getXY = direction => direction ? ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y': '';

const INIT_LEN = 1;
/** [{x, y, direction}] */
let bodyArr = [];
let isd270to360 = false;
let isd360to270 = false;

export default ({colCount = 0, rowCount = 0}) => {

  const isBump = headPos => {
    return (
      headPos.x < 0 ||
      headPos.y < 0 ||
      headPos.x >= colCount ||
      headPos.y >= rowCount ||
      bodyArr.some(part => part.x === headPos.x && part.y === headPos.y)
    );
  };

  const resetSnake = setHeadPos => {
    const newXY = {
      x: ~~(Math.random() * (colCount - 6)) + 3,
      y: ~~(Math.random() * (rowCount - 6)) + 3,
    };
    setHeadPos({...newXY});
    direction = Object.values(KEY_MAP)[~~(Math.random() * 4)];
    bodyArr = [...Array(INIT_LEN).keys()].map(value => ({
      ...newXY,
      [getXY(direction)]: newXY[getXY(direction)] - getD(direction) * (value + 1),
      direction,
    }));    
  };

  return function Snake({ state, send, checkEat }) {

    const GAME_STATUS = state.str(true);
    const [ headPos, setHeadPos ] = useState({x: 0, y: 0});

    const move = () => {
      const D = getD(direction);
      const XY = getXY(direction);
      
      setHeadPos(headPos => {
        for (let i = bodyArr.length - 1; i > 0; i--) {
          bodyArr[i] = {...bodyArr[i - 1]};
        }
        
        if(bodyArr.length) bodyArr[0] = { ...headPos, direction };
        headPos[XY] += D;
        const a = checkEat({
          rowCount,
          colCount,
          snakePosArr: [headPos, ...bodyArr],
        });

        console.log('checkEat', a);
        
        
        return {...headPos};
      });
    };

    const handleKeydown = (e) => {
      if(KEY_MAP.hasOwnProperty(e.keyCode)) {
        const curXY = getXY(direction);
        const updateDirection = KEY_MAP[e.keyCode];
        const nextXY = getXY(updateDirection);
  
        /** 只能左/右 90度轉彎 */
        if(curXY !== nextXY) {
          isd270to360 = direction === 'LEFT' && updateDirection === 'UP';
          isd360to270 = direction === 'UP' && updateDirection === 'LEFT';
          setTimeout(() => {
            isd270to360 = false;
            isd360to270 = false;
          }, duration);
          direction = updateDirection;
          // move();
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
        setHeadPos({x: 3, y: 3});
        resetSnake(setHeadPos);
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
      if(isBump(headPos)) {
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

    if(bodyArr.length) {
      console.log(
        `(${headPos.x},${headPos.y})<-`+
        bodyArr.map(part => `(${part.x}, ${part.y})`).join('<-')
      );
    }

    return (
      <div
        style={{ left, top }}
        className={cx(style.SnakeWrapper, style[GAME_STATUS])}
      >
        {
          isd270to360 && <div className={cx(style.d270to360)} /> ||
          isd360to270 && <div className={cx(style.d360to270)} /> ||
          <div className={cx(style.head, style[direction])} />
        }
        {bodyArr.map((part, i) =>
          <div
            key={i}
            className={cx(
              style.body,
              // style[part.direction]
            )}
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