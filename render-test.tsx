import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App';
import { Provider } from 'react-redux';
import { store } from './src/store';

try {
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location="/attendance/reports">
        <App />
      </StaticRouter>
    </Provider>
  );
  console.log("RENDER SUCCESS");
} catch (e) {
  console.error("RENDER ERROR:", e);
}
