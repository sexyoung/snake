import React, { useState, useEffect, useRef } from 'react';

import { ACTION, STATUS } from 'consts';
import Snake, { duration, boxLen } from 'components/Snake';

import style from './style.module.scss';
const KEY_MAP = {
  '37': 'LEFT',
  '38': 'UP',
  '39': 'RIGHT',
  '40': 'DOWN',
};

const INIT_DIRECTION = 'RIGHT';
let moveInterval = null;
let direction = INIT_DIRECTION;

let colCount = 0;
let rowCount = 0;

export function SingleGamePage({ state, send }) {

  const GAME_STATUS = state.str(true);

  const headerDOM = useRef();
  const singleGamePageDOM = useRef();

  const [ x, setX ] = useState(0);
  const [ y, setY ] = useState(0);
  const setPos = {x: setX, y: setY};

  /** 只要不是 playing 應該就是暫停吧 */
  const [isPause, setIsPause] = useState(!state.at(STATUS.GAME.PLAYING));
  const [gridSize, setGridSize] = useState({
    colCount,
    rowCount,
  });

  const handleKeydown = (e) => {
    if(KEY_MAP.hasOwnProperty(e.keyCode)) {

      const curXY = ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y';
      const nextXY = ['LEFT', 'RIGHT'].includes(KEY_MAP[e.keyCode]) ? 'x': 'y';

      /** 只能左/右 90度轉彎 */
      if(curXY !== nextXY)
        direction = KEY_MAP[e.keyCode];

      if(state.at(STATUS.GAME.READY)) {
        setIsPause(false);
        send(ACTION.GAME.PLAY);
      }
    }
  };

  const handleResize = () => {
    colCount = ~~(singleGamePageDOM.current.offsetWidth / boxLen);
    rowCount = ~~((singleGamePageDOM.current.offsetHeight - headerDOM.current.offsetHeight) / boxLen);
    setGridSize({
      colCount,
      rowCount,
    });
  };

  const handleRestart = () => {
    send(STATUS.GAME.READY);
  };

  const move = () => {
    const D = ['LEFT', 'UP'].includes(direction) ? -1: 1;
    const XY = ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y';
    setPos[XY](value => value + D);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeydown);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);
    
  useEffect(() => {
    if(GAME_STATUS === STATUS.GAME.PLAYING) {
      move();
      moveInterval = setInterval(move, duration);
    } else if (state.inMeta('SNAKE_STOP')) {
      clearInterval(moveInterval);
    }
  }, [GAME_STATUS]);

  useEffect(() => {
    if(x < 0 || y < 0) {
      const D = ['LEFT', 'UP'].includes(direction) ? -1: 1;
      const XY = ['LEFT', 'RIGHT'].includes(direction) ? 'x': 'y';
      setPos[XY](value => value - D);
      send(ACTION.GAME.OVER);
    }
  }, [x, y]);

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
        <Snake {...{
          pos: {x, y},
          direction,
        }} />
      </div>
    </div>
  );
}
