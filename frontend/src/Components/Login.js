import React, { useState, useEffect } from 'react';
import logo from './Images/logo pcaarrd.png';
import { Container, Row, Col, Card, Toast } from 'react-bootstrap';
import './login-style.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ handleLogin }) => {
  const [showErrorToast, setShowErrorToast] = useState(false);
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');

  const login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    try {
      const response = await handleLogin(email, password);
      console.log('Login response:', response); // Log the entire response object
  
      if (response.success) {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('user_lvl', response.user_lvl); // Store user_lvl
        localStorage.setItem('id', response.id); // Store user_lvl
  
        // Ensure first_name is not undefined or null before storing
        if (response.first_name) {
          localStorage.setItem('first_name', response.first_name);
        } else {
          console.error('First name is undefined or null:', response.first_name);
        }

        if (response.last_name) {
          localStorage.setItem('last_name', response.last_name);
        } else {
          console.error('Last name is undefined or null:', response.last_name);
        }
  
        if (response.user_lvl === '2') {
          // Clear isLoggedIn, user_lvl, and first_name from localStorage
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user_lvl');
          localStorage.removeItem('first_name');
          localStorage.removeItem('last_name');
          
          setShowErrorToast(true);
          setToastMessage('Your account is awaiting approval from the admin.');
          return; // Don't navigate further
        } else if (response.user_lvl === '1' || response.user_lvl === '0') {
          navigate('/DOST');
          return; // Exit the function after navigating
        }
      } else {
        setShowErrorToast(true);
        setToastMessage('Incorrect email or password.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setShowErrorToast(true);
      setToastMessage('An error occurred while logging in.');
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/DOST');
    }
  }, []); // Empty dependency array to run only once after component mount

  return (
    <section className="vh-100">
      <div className="containerr py-5 h-100">
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col xl={10}>
            <Card className="bg-light shadow mb-5 bg-white rounded">
              <Row className="g-0">
                <Col md={6} lg={5} className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#0e2238', borderRadius: '5px 0 0 5px' }}>
                  <img className="img-fluid w-50" src={logo} alt="logo"/>
                </Col>
                <Col md={6} lg={7} className="d-flex align-items-center">
                  <Card.Body className="p-4 p-lg-5 text-black">
                    <br /><br />
                    <form>
                      <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>Log into your account</h5>
                      <div className="form-outline mb-4">
                        <h6>Email</h6>
                        <input type="email" id="email" className="form-control form-control-lg" />
                      </div>
                      <div className="form-outline mb-4">
                        <h6>Password</h6>
                        <input type="password" id="pass" className="form-control form-control-lg" />
                      </div>
                      <div className="pt-1 mb-4">
                        <button className="btn btn-lg btn-block" style={{ backgroundColor: '#0e2238', color: '#ffffff' }} type="button" onClick={login}>Login</button>
                      </div>
                      <a className="small text-muted" href="#!" onClick={() => navigate('/send-email')}>Forgot password?</a>
                      <p className="mb-5 pb-lg-2" style={{ color: '#0e2238' }}> Don't have an account? <Link to="/Signup" style={{ color: '#0e2238' }}>Register here</Link></p>
                    </form>

                    <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} delay={3000} autohide>
                      <Toast.Header>
                        <strong className="me-auto">Error</strong>
                      </Toast.Header>
                      <Toast.Body>Incorrect email or password.</Toast.Body>
                    </Toast>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}

export default Login;
