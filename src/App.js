import React, { useState } from 'react';
import ReactResizeDetector from 'react-resize-detector';

import style from './App.module.scss';

const boxLen = 50;

function App() {

  const [colCount, setColCount] = useState(0);
  const [rowCount, setRowCount] = useState(0);

  const handleResize = (width, height) => {
    setColCount(~~(width / boxLen));
    setRowCount(~~(height / boxLen));
  }
  
  return (
    <div className={style.App}>
      <div className={style.header}>
        0
      </div>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={handleResize}
      >
        {() =>
          <div className={style.grid}>
            {
              (!colCount || !rowCount) ? null:
              [...Array(1).keys()].map(row =>
                <div key={row}>
                  {[...Array(1).keys()].map(col =>
                    <div key={col} style={{
                      width: boxLen,
                      height: boxLen,
                    }} className={style.box} />
                  )}
                </div>
              )
            }
          </div>
        }
      </ReactResizeDetector>
    </div>
  );
}

export default App;
