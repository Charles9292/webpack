import React from 'react'
import ReactDom from 'react-dom/client'
import App from './app'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

const root = ReactDom.createRoot(document.getElementById('root'))
root.render(<App />)

console.log(1);