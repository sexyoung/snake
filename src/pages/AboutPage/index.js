import React from 'react';

import { NAV } from 'consts';

export function AboutPage({ send }) {
  return (
    <div>
      AboutPage
      <button onClick={() => send(NAV.GO_MENU)}>menu</button>
    </div>
  );
}
