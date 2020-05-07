import { useMachine } from '@xstate/react';
import { Machine, interpret } from 'xstate';
import { useState, useEffect, useRef } from 'react';

let service = null;

export function getMachine(stateNode) {
  if(!service) {
    service = interpret(Machine(stateNode));
    service.start();
    console.warn('start');
  }
  return service;
}

export function useXState(service) {
  return service;
}