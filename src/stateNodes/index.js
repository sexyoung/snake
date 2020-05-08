import { Machine } from 'xstate';

import navStateNode from './navStateNode';
/**
 * nav
 * - game
 */
export const appMachine = Machine(navStateNode);