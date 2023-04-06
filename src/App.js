import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import Routes from './Routes';
import AppProvider from './context/AppProvider';

function App() {
  return (
    <AppProvider>
      <div>
        <Routes />
      </div>
    </AppProvider>
  );
}

export default App;
