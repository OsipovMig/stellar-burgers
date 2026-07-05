import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Возвращаем классический BrowserRouter
import { Provider } from 'react-redux';
import store from './services/store';
import App from './components/app/app';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Оборачиваем строго в BrowserRouter, чтобы старые компоненты в @ui ожили */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
