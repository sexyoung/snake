import { empty, timer, fromEvent, merge, combineLatest } from "rxjs";
import { useEventCallback } from "rxjs-hooks";
import React, { useState, useEffect, useRef } from 'react';
import {
  tap,
  scan,
  mapTo,
  pluck,
  filter,
  switchMap,
  takeWhile,
  distinctUntilChanged,
} from "rxjs/operators";


import { ACTION, STATUS } from 'consts';
import Snake, { duration, boxLen } from 'components/Snake';

import style from './style.module.scss';
const KEY_MAP = {
  '37': 'LEFT',
  '38': 'UP',
  '39': 'RIGHT',
  '40': 'DOWN',
};

const INIT_POS = {x: 0, y: 0};
const INIT_DIRECTION = 'RIGHT';
const INIT_IS_PAUSE = true;
let pos = {...INIT_POS};
let direction = INIT_DIRECTION;

let colCount = 0;
let rowCount = 0;

const keydown$ = fromEvent(document, 'keydown');

const tickSnake$ = timer(0, duration).pipe(
  mapTo(JSON.stringify(pos)),
  scan(p => {
    const updatePos = 
      JSON.stringify(INIT_POS) === p &&
      JSON.stringify(INIT_POS) !== JSON.stringify(pos)?
        {...pos}: JSON.parse(p)
    ;

    const D = ['LEFT', 'UP'].includes(direction) ? -1: 1;
    const XY = ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y';
    
    updatePos[XY] = updatePos[XY] + D;
    return JSON.stringify(updatePos);

  }, JSON.stringify(INIT_POS)),
  distinctUntilChanged(),
  tap(value => pos = JSON.parse(value)),
  takeWhile( value => {
    const pos = JSON.parse(value);
    return pos.x >= 0 && pos.y >= 0 &&
          pos.x < colCount && pos.y < rowCount;
  }),
);

export function SingleGamePage({ state, send }) {

  const headerDOM = useRef();
  const singleGamePageDOM = useRef();

  /** 只要不是 playing 應該就是暫停吧 */
  const [isPause, setIsPause] = useState(!state.at(STATUS.GAME.PLAYING));
  const [gridSize, setGridSize] = useState({
    colCount,
    rowCount,
  });

  const handleResize = () => {
    colCount = ~~(singleGamePageDOM.current.offsetWidth / boxLen);
    rowCount = ~~((singleGamePageDOM.current.offsetHeight - headerDOM.current.offsetHeight) / boxLen);
    setGridSize({
      colCount,
      rowCount,
    });
  };


  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [handleTogglePause, r] = useEventCallback((event$) =>
    merge(event$, keydown$).pipe(
      scan((curIsPause, e) => {
        if(e.type === 'click') return !curIsPause;
        if(e.type === 'keydown') {
          if(KEY_MAP.hasOwnProperty(e.keyCode)) {
            direction = KEY_MAP[e.keyCode];
            return false;
          }
        }
        return curIsPause;
      }, INIT_IS_PAUSE),
      tap(setIsPause),
      switchMap(curIsPause => curIsPause ? empty(): tickSnake$),
    )
  );

  console.log('isPause', isPause, r);
  

  return (
    <div className={style.SingleGamePage} ref={singleGamePageDOM}>
      <div className={style.header} ref={headerDOM}>
        0
        <button onClick={handleTogglePause}>
          {isPause ? 'play': 'pause'}
        </button>
        <button onClick={() => send(ACTION.NAV.GO_MENU)}>menu</button>
      </div>
      <div className={style.grid}>
        {
          !gridSize.colCount || !gridSize.rowCount ? null:
            [...Array(gridSize.rowCount).keys()].map(row =>
              <div key={row} className={style.row}>
                {[...Array(gridSize.colCount).keys()].map(col =>
                  <div key={col} style={{
                    width: boxLen,
                    height: boxLen,
                  }} className={style.box} />
                )}
              </div>
            )
        }
        <Snake {...{
          pos,
          direction,
        }} />
      </div>
    </div>
  );
}
