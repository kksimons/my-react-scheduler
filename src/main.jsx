import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';


//use the new createRoot API from React 18 (any) to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,

);
