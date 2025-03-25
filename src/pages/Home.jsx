import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles.css';

function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>FJ Bank</h1>
        <nav>
          <Link to="/login" className="login-button">Login</Link>
          <Link to="/signup" className="signup-link">Sign Up</Link>
        </nav>
      </header>
      
      <main className="main-content">
        <section className="hero-section">
          <h2>Welcome to FJ Bank</h2>
          <p>Your trusted partner for all financial services</p>
        </section>
        
        <section className="about-section">
          <h3>About Us</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam 
            eget felis eget urna ultrices tincidunt. Vivamus at sagittis nunc. 
            Praesent consectetur, ex nec efficitur ultricies, ex libero fringilla 
            arcu, non tempor nulla justo id ipsum.
          </p>
          <p>
            Fusce consequat dolor vitae diam faucibus, vel tempus sem varius. 
            Integer at odio eget arcu varius elementum. Duis porttitor mauris 
            ut est consequat, a sagittis ipsum tempus. Vestibulum ante ipsum 
            primis in faucibus orci luctus et ultrices posuere cubilia curae.
          </p>
        </section>
        
        <section className="features-section">
          <h3>Our Services</h3>
          <div className="feature-cards">
            <div className="feature-card">
              <h4>Personal Banking</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna ultrices tincidunt.</p>
            </div>
            <div className="feature-card">
              <h4>Business Banking</h4>
              <p>Fusce consequat dolor vitae diam faucibus, vel tempus sem varius. Integer at odio eget arcu varius elementum.</p>
            </div>
            <div className="feature-card">
              <h4>Investment Solutions</h4>
              <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <p>&copy; 2023 FJ Bank. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;