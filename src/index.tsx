import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Возвращаем BrowserRouter
import { Provider } from 'react-redux';
import store from './services/store';
import App from './components/app/app';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Передаем флаги будущих версий прямо в BrowserRouter, чтобы ссылки в UI ожили */}
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
