import React from 'react';
import { Machine, interpret, assign } from 'xstate';

const increment = context => context.count + 1;
const decrement = context => context.count - 1;

const lightMachine = Machine({
  initial: 'red',
  context: {
    count: 0
  },
  states: {
    red: {
      on: {
        CLICK: {
          target: 'green',
        },
        boom: {
          target: 'broken',
        },
      },
    },
    green: {
      on: {
        CLICK: 'yellow',
        INC: { actions: assign({ count: increment }) },
        DEC: { actions: assign({ count: decrement }) },
      },
    },
    yellow: {
      on: {
        CLICK: 'red',
      },
    },
    broken: {
      type: 'final',
    }
  },
});

const service = interpret(lightMachine);
service.start();
console.log(service.state.value); // red

service.send('CLICK');
console.log(service.state.value); // green

service.send('INC');
service.send('INC');
console.log(service.state.context.count); // 2

service.send('CLICK');
console.log(service.state.value); // yellow
service.send('boom'); // boom 只發生在 red, 所以這邊不會有反應
service.send('boom');
service.send('boom');
service.send('INC');
service.send('DEC'); // DEC 只發生在 green, 所以它不會觸發
console.log(service.state.context.count); // 2

service.send('CLICK');
console.log(service.state.value); // red

service.send('boom');
console.log(service.state.value); // broken

service.send('CLICK'); // broken 為 final 狀態，所以也沒有 click 事件
console.log(service.state.value);


export function AboutPage() {
  return (
    <div>
      AboutPage
    </div>
  );
}
