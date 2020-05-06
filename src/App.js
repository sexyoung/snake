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

export const DIRECTION_MAP = {
  RIGHT: 1,
  LEFT: -1,
  DOWN: 100,
  UP: -100,
  '1': 'RIGHT',
  '-1': 'LEFT',
  '100': 'DOWN',
  '-100': 'UP',
}

const KEY_MAP = {
  '37': 'LEFT',
  '38': 'UP',
  '39': 'RIGHT',
  '40': 'DOWN',
}

const INIT_COORDINATE = 0;
let coordinate = INIT_COORDINATE;
let currDirection = DIRECTION_MAP.RIGHT;

const time$ = timer(0, duration);

const tickSnake$ = time$.pipe(
  mapTo(coordinate),
  scan((c) => {
    return currDirection + (
      c === INIT_COORDINATE && coordinate !== INIT_COORDINATE ?
      coordinate: c
    );
  }, INIT_COORDINATE),
  distinctUntilChanged(),
  tap(value =>
    coordinate = value
  ),
  tap((c) => console.log('位置', c)),
  // stop on coordinate < 0
);

function App() {

  const appDOM = useRef();
  const headerDOM = useRef();

  const [isPause, setIsPause] = useState(true);

  const [gridSize, setGridSize] = useState({
    colCount: 0,
    rowCount: 0,
  });

  const handleResize = () => {
    setGridSize({
      colCount: ~~(appDOM.current.offsetWidth / boxLen),
      rowCount: ~~((appDOM.current.offsetHeight - headerDOM.current.offsetHeight) / boxLen),
    });
  };

  const handleKeyDown = (e) => {
    if(KEY_MAP.hasOwnProperty(e.keyCode))
      currDirection = DIRECTION_MAP[KEY_MAP[e.keyCode]];
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
    ),
    INIT_COORDINATE,
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
        {coordinate !== null &&
          <Snake {...{
            coordinate,
            direction: currDirection,
          }} />
        }
      </div>
    </div>
  );
}

export default App;
