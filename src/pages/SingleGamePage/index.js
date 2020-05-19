import React, { useState, useEffect, useRef } from 'react';

import { ACTION, STATUS } from 'consts';
import createSnake, { boxLen } from 'components/Snake';

import style from './style.module.scss';

let Snake = null;
let fruitPos = {x: 3, y: 3};

const resetFrultPos = ({ snakePosArr, rowCount, colCount }) => {
  const grid = [...Array(rowCount * colCount).keys()].map(v => ({
    x: ~~(v / colCount),
    y: v % colCount,
  })).filter(curPos =>
    !snakePosArr.some(snakePos =>
      snakePos.x === curPos.x && snakePos.y === curPos.y
    )
  );
  console.log('new location', grid[~~(Math.random() * grid.length)]);
};

const checkEat = ({ snakePosArr, rowCount, colCount }) => {
  return snakePosArr.some(snakePos =>
    snakePos.x === fruitPos.x && snakePos.y === fruitPos.y
  );
};

export function SingleGamePage({ state, send }) {

  const headerDOM = useRef();
  const singleGamePageDOM = useRef();

  /** 只要不是 playing 應該就是暫停吧 */
  const [gridSize, setGridSize] = useState({
    colCount: 0,
    rowCount: 0,
  });

  const handleResize = () => {
    const colCount = ~~(singleGamePageDOM.current.offsetWidth / boxLen);
    const rowCount = ~~((singleGamePageDOM.current.offsetHeight - headerDOM.current.offsetHeight) / boxLen);
    
    setGridSize(gridSize => {
      if(colCount !== gridSize.colCount || rowCount !== gridSize.rowCount) {
        Snake = createSnake({ colCount, rowCount });
      }
      return {
        colCount,
        rowCount,
      };
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={style.SingleGamePage} ref={singleGamePageDOM}>
      <div className={style.header} ref={headerDOM}>
        0
        {state.at(STATUS.GAME.PAUSE) && "PAUSE"}
        {state.at(STATUS.GAME.GAMEOVER) && "GAMEOVER"}
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
        {Snake && <Snake {...{
          send,
          state,
          checkEat,
        }} />}
      </div>
    </div>
  );
}
