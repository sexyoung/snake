import React, { useState, useEffect, useRef } from 'react';

import { ACTION, STATUS } from 'consts';
import createSnake, { boxLen } from 'components/Snake';

import style from './style.module.scss';

let Snake = null;

export function SingleGamePage({ state, send }) {

  const headerDOM = useRef();
  const singleGamePageDOM = useRef();

  /** 只要不是 playing 應該就是暫停吧 */
  const [isPause, setIsPause] = useState(!state.at(STATUS.GAME.PLAYING));
  const [gridSize, setGridSize] = useState({
    colCount: 0,
    rowCount: 0,
  });

  const handleResize = () => {
    const colCount = ~~(singleGamePageDOM.current.offsetWidth / boxLen);
    const rowCount = ~~((singleGamePageDOM.current.offsetHeight - headerDOM.current.offsetHeight) / boxLen);
    setGridSize({
      colCount,
      rowCount,
    });

    Snake = createSnake({ colCount, rowCount, setIsPause });
  };

  const handleRestart = () => {
    send(STATUS.GAME.READY);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const togglePause = () => {
    if(state.at(STATUS.GAME.READY)) send(ACTION.GAME.PLAY);
    else if(state.at(STATUS.GAME.PAUSE)) send(ACTION.GAME.PLAY);
    else if(state.at(STATUS.GAME.PLAYING)) send(ACTION.GAME.PAUSE);
    setIsPause(isPause => !isPause);
  };

  return (
    <div className={style.SingleGamePage} ref={singleGamePageDOM}>
      <div className={style.header} ref={headerDOM}>
        0
        {state.inMeta('IN_GAME') &&
          <button onClick={togglePause}>
            {isPause ? 'resume': 'pause'}
          </button>
        }
        {state.at(STATUS.GAME.GAMEOVER) &&
          <button onClick={handleRestart}>
            restart
          </button>
        }
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
        }} />}
      </div>
    </div>
  );
}
