import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Button from "./common/Button";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("signup");
  const [signupConfirmed, setSignupConfirmed] = useState(false);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (user) {
        try {
          const { data: application, error } = await supabase
            .from('applications')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          
          // Navigate to account page if application exists, otherwise to apply page
          navigate(application ? '/account' : '/apply');
        } catch (error) {
          console.error('Error checking application:', error);
          navigate('/apply'); // Default to apply page if check fails
        }
      }
    };

    checkExistingApplication();
  }, [user, navigate]);

  // Commenting out Google sign-in as it's not implemented yet
  /*
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  */

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/apply`,
          },
        });

        if (result.error) {
          if (result.error.message.includes('already registered')) {
            const { error: resendError } = await supabase.auth.resend({
              type: 'signup',
              email,
              options: {
                emailRedirectTo: `${window.location.origin}/apply`,
              },
            });

            if (resendError) throw resendError;
            setSignupConfirmed(true);
            return;
          }
          throw result.error;
        }

        if (result.data?.user) {
          setSignupConfirmed(true);
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (result.error) throw result.error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
  };

  if (showEmailForm) {
    if (signupConfirmed) {
      return (
        <div className="flex justify-center px-4 md:px-0">
          <div className="text-left mt-20 w-full max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6 text-center">
              Check Your Email
            </h1>
            <p className="text-white text-center mb-6">
              We've sent a confirmation email to {email}. Please check your inbox and follow the instructions to complete your registration.
            </p>
            <button
              onClick={() => setShowEmailForm(false)}
              className="text-white hover:text-gray-300 text-sm w-full text-center"
            >
              ← Back to all sign in options
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center px-4 md:px-0">
        <div className="text-left mt-20 w-full max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            {mode === "login" ? "Log In" : "Sign Up"} with Email
          </h1>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-4">
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#432347] border border-white rounded text-white"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#432347] border border-white rounded text-white"
                required
                minLength={6}
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-white mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#432347] border border-white rounded text-white"
                  required
                  minLength={6}
                />
              </div>
            )}

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-covenRed border-0"
              text={
                loading ? "Loading..." : mode === "login" ? "Log In" : "Sign Up"
              }
              disabled={loading}
            />
          </form>

          <button
            onClick={toggleMode}
            className="text-gray-400 hover:text-white text-sm w-full text-center mb-4"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>

          <button
            onClick={() => setShowEmailForm(false)}
            className="text-white hover:text-gray-300 text-sm w-full text-center"
          >
            ← Back to all sign in options
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="text-left mt-20 w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          {title}
        </h1>
        <div className="flex flex-col">
          {/* Commenting out Google sign-in button
          <Button
            onClick={signInWithGoogle}
            className="w-full bg-covenRed mb-4 border-0"
            text={
              <>
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                Sign up with Google
              </>
            }
          />
          */}
          <Button
            onClick={() => setShowEmailForm(true)}
            className="w-full text-white"
            text={
              <>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Sign up with Email
              </>
            }
          />
        </div>

        <p className="text-gray-400 text-sm mt-4 text-center">
          By signing up, you agree to our{" "}
          <a href="/terms" className="underline text-white">
            Terms
          </a>{" "}
          &{" "}
          <a href="/privacy" className="underline text-white">
            Privacy Policy
          </a>
        </p>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <button
            onClick={() => {
              setShowEmailForm(true);
              setMode("login");
            }}
            className="underline text-white hover:text-gray-300"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Login;
