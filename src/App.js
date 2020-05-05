import { interval, combineLatest, of } from "rxjs";
import { scan, take, distinctUntilChanged, tap, map } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";
import React, { useState, useEffect, createRef } from 'react';

import Snake from 'components/Snake';

import style from './App.module.scss';

export const boxLen = 50;
const appDOM = createRef();
const headerDOM = createRef();

const DIRECTION_MAP = {
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

let coordinate = 0;
let currDirection = DIRECTION_MAP.RIGHT;

let time$ = interval(500);
let coordinate$ = of(coordinate);
let tickSnake$ = combineLatest(coordinate$, time$);

function App() {

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

  coordinate = useObservable(() => tickSnake$.pipe(
    map(([x]) => x),
    scan((coordinate) => coordinate + currDirection),
    distinctUntilChanged(),
    tap(console.log)
    // stop on coordinate < 0
  ));
  
  return (
    <div className={style.App} ref={appDOM}>
      <div className={style.header} ref={headerDOM}>
        0
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
            }}
          />
        }
      </div>
    </div>
  );
}

export default App;
