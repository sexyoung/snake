import React, { useState, useEffect } from 'react';

import style from './App.module.scss';

const boxLen = 50;

function App() {

  const [colCount, setColCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  const handleResize = ({ target }) => {
    console.warn(target);
  };
  
  return (
    <div className={style.App}>
      <div className={style.header}>
        0
      </div>
      <div className={style.grid}>
        {
          (!colCount || !rowCount) ? null:
          [...Array(rowCount).keys()].map(row =>
            <div key={row} className={style.row}>
              {[...Array(colCount).keys()].map(col =>
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
