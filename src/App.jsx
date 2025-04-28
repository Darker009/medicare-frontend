import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Home/>
      </main>
    </div>
  );
}

export default App;