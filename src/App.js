import { interval } from "rxjs";
import { map, tap } from "rxjs/operators";
import { useObservable } from "rxjs-hooks";
import React, { useState, useEffect, createRef } from 'react';

import style from './App.module.scss';

const boxLen = 50;

function App() {

  const [gridSize, setGridSize] = useState({
    colCount: 0,
    rowCount: 0,
  });

  const appDOM = createRef();
  const headerDOM = createRef();

  useEffect(() => {

    const handleResize = () => {
      setGridSize({
        colCount: ~~(appDOM.current.offsetWidth / boxLen),
        rowCount: ~~((appDOM.current.offsetHeight - headerDOM.current.offsetHeight) / boxLen),
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [appDOM, headerDOM]);

  const value = useObservable(() => interval(500).pipe(
    map((val) => val * 1),
    tap(console.warn)
  ));
  
  return (
    <div className={style.App} ref={appDOM}>
      <div className={style.header} ref={headerDOM}>
        {value}
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
      </div>
    </div>
  );
}

export default App;
