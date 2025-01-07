import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Button from './Button';

const Login = ({ title }) => {
  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  const handleEmailLogin = () => {
    console.log("Email login");
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="text-left mt-20 w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">{title}</h1>
        <div className="flex flex-col">
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-covenRed mb-4 border-0"
            text={
              <>
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                Sign Up with Google
              </>
            }
          />
          <Button
            onClick={handleEmailLogin}
            className="w-full text-white"
            text={
              <>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Sign Up with Email
              </>
            }
          />
        </div>
        <p className="text-gray-400 text-sm mt-4 text-center">
          By signing up, you agree to our <a href="/terms" className="underline text-white">Terms</a> & <a href="/privacy" className="underline text-white">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Login;