import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles.css';
import Home from './components/pages/Home';
import Header from './components/Header';
import SharePage from './components/pages/SharePage';
import Footer from './components/Footer';
import EditSample from './components/pages/EditPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header></Header>
  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/share/:id" element={<SharePage />} />
          <Route path="/edit/:id" element={<EditSample />} /> 
        </Routes>
        <Footer></Footer>
      </div>
    </Router>

    
  );
}

export default App;
