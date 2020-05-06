import {
  empty,
  timer,
} from "rxjs";

import {
  tap,
  scan,
  mapTo,
  switchMap,
  distinctUntilChanged,
} from "rxjs/operators";

import {
  useEventCallback,
} from "rxjs-hooks";

import React, { useState, useEffect, useRef } from 'react';

import Snake, { duration, boxLen } from 'components/Snake';

import style from './App.module.scss';

const KEY_MAP = {
  '37': 'LEFT',
  '38': 'UP',
  '39': 'RIGHT',
  '40': 'DOWN',
}

const INIT_POS = {x: 0, y: 0};
const INIT_DIRECTION = 'RIGHT';
let pos = {...INIT_POS};
let direction = INIT_DIRECTION;

let colCount = 0;
let rowCount = 0;

const time$ = timer(0, duration);

const tickSnake$ = time$.pipe(
  mapTo(JSON.stringify(pos)),
  scan(p => {
    const updatePos = (
      JSON.stringify(INIT_POS) === (p) &&
      JSON.stringify(INIT_POS) !== JSON.stringify(pos)?
      {...pos}: JSON.parse(p)
    );

    const D = ['LEFT', 'UP'].includes(direction) ? -1: 1;
    const XY = ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y';
    
    updatePos[XY] = updatePos[XY] + D;
    return JSON.stringify(updatePos);

  }, JSON.stringify(INIT_POS)),
  distinctUntilChanged(),
  tap(value =>
    pos = JSON.parse(value)
  ),
  tap(console.log)
  // tap(coordinate => {
  //   console.log(
  //     '位置', coordinate,
  //     'colCount', colCount,
  //     'rowCount', rowCount,
  //     '是否越界?', (
  //       coordinate < 0 ||
  //       coordinate % 100 > colCount ||
  //       ~~(coordinate / 100) > rowCount
  //     )
  //   );
  // }),
  // stop on coordinate < 0
);

function App() {

  const appDOM = useRef();
  const headerDOM = useRef();

  const [isPause, setIsPause] = useState(true);

  const [gridSize, setGridSize] = useState({
    colCount,
    rowCount,
  });

  const handleResize = () => {
    colCount = ~~(appDOM.current.offsetWidth / boxLen);
    rowCount = ~~((appDOM.current.offsetHeight - headerDOM.current.offsetHeight) / boxLen);
    setGridSize({
      colCount,
      rowCount,
    });
  };

  const handleKeyDown = (e) => {
    if(KEY_MAP.hasOwnProperty(e.keyCode))
      direction = KEY_MAP[e.keyCode];
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    document.addEventListener("keydown", handleKeyDown);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  const [handleTogglePause] = useEventCallback((event$) =>
    event$.pipe(
      scan(isPause => !isPause, isPause),
      tap(setIsPause),
      switchMap(isPause => isPause ? empty(): tickSnake$),
      // tap(console.log),
    )
  );
  
  return (
    <div className={style.App} ref={appDOM}>
      <div className={style.header} ref={headerDOM}>
        0
        <button onClick={handleTogglePause}>
          {isPause ? 'play': 'pause'}
        </button>
      </div>
      <div className={style.grid}>
        {
          (!gridSize.colCount || !gridSize.rowCount) ? null:
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

export default App;
