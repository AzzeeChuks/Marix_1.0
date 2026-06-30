import React, { useState, useEffect } from 'react';
import googleIcon from '../images/google-icon.png';
import marixLogoM from '../images/marix-logo-m.png'; 

export default function AuthForm({ initialMode = 'signup', onSuccessLogin, onCancel }) {
  const [authMode, setAuthMode] = useState(initialMode); 
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  // Master Rule Engine for Passwords (Shared across both Sign In and Sign Up views)
  const isStrictEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  // 🚀 FIXED: Login validation now strictly demands both minimum character limits and number validation rules
  const isLoginValid = isStrictEmailValid && hasMinLength && hasNumber;
  const isSignUpValid = formData.firstName.trim().length > 0 && isStrictEmailValid && hasMinLength && hasNumber && passwordsMatch;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      if (authMode === 'signup') {
        const cleanFirstName = formData.firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        setSuccessMessage(`Account created! Welcome, @${cleanFirstName}_${randomDigits}`);
      } else {
        setSuccessMessage('Signed in successfully!');
      }

      setTimeout(() => {
        setSuccessMessage('');
        if (onSuccessLogin) {
          // Send user's name or fallback character up to update navbar initials tracking state parameters
          onSuccessLogin(authMode === 'signup' ? formData.firstName : formData.email.split('@')[0]); 
        }
      }, 2000);

    }, 2000); 
  };

  return (
    <div 
      className="w-full min-h-screen bg-marix-cream text-[#111111] px-4 py-6 md:p-6 flex flex-col gap-y-6 md:gap-y-8 select-none"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      
      {/* Toast Overlays */}
      {successMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 max-w-sm bg-marix-teal text-white px-4 py-3 rounded-xl shadow-xl font-medium text-xs md:text-sm flex items-start gap-2.5 break-words animate-fadeIn">
          <span className="shrink-0">✨</span>
          <div className="flex-1 min-w-0">
            {successMessage}
          </div>
        </div>
      )}

      {/* Brand Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-2 shrink-0 select-none">
        <div className="flex items-center cursor-pointer">
          <img 
            src={marixLogoM} 
            alt="M" 
            style={{ width: '55px', height: '55px', margin: '0 -10px', objectFit: 'contain' }} 
          />
          <span 
            style={{
              fontSize: '1.05rem',
              color: '#452b1fd2',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
            className="tracking-tight text-[#111111] pt-1"
          >
            Arix
          </span>
        </div>

        <span 
          style={{ fontSize: '1rem', textTransform: 'uppercase' }}
          className="hidden sm:inline-block font-bold tracking-wider text-gray-400"
        >
          secure gateway
        </span>
      </header>

      {/* Back Arrow Link */}
      <div className="w-full max-w-6xl mx-auto text-left shrink-0">
        <div className="max-w-[420px]">
          <button 
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-[#111111]/60 hover:text-[#111111] transition-colors flex items-center gap-1 focus:outline-none"
          >
            <i className="ph ph-arrow-left"></i>
            <span>Back to Marketplace</span>
          </button>
        </div>
      </div>
      
      {/* Central Card Forms Module */}
      <div className="w-full flex flex-col items-center">
        
        <div className="text-center mb-6 max-w-[420px]">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#111111] mb-2 transition-all duration-150">
            {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-[#111111]/70 max-w-[320px] mx-auto leading-normal font-medium h-5">
            {authMode === 'signup' 
              ? 'Join Marix to discover and get discovered.' 
              : 'Sign in to continue where you left off.'}
          </p>
        </div>

        {/* Content Card Wrapper */}
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-xl border border-gray-200/90 px-6 py-8 md:px-8 relative transition-all duration-300 overflow-hidden">
          
          {/* Isolated loader overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-xl z-40 flex items-center justify-center transition-all">
              <div className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 border-4 border-marix-teal/20 border-t-marix-teal rounded-full animate-spin"></div>
                <p className="text-xs font-bold tracking-wide text-[#111111]/70">Connecting to Marix...</p>
              </div>
            </div>
          )}

          {/* Nav Tabs Selector Box */}
          <div className="flex bg-marix-cream/60 p-1 rounded-lg mb-6 border border-gray-200/50 relative z-10 select-none">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all duration-150 outline-none focus:outline-none focus:ring-0 active:outline-none ${
                authMode === 'login' 
                  ? 'bg-white text-[#111111] shadow-sm' 
                  : 'text-[#111111]/40'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all duration-150 outline-none focus:outline-none focus:ring-0 active:outline-none ${
                authMode === 'signup' 
                  ? 'bg-white text-[#111111] shadow-sm' 
                  : 'text-[#111111]/40'
              }`}
            >
              Create account
            </button>
          </div>

          {/* Google Button */}
          <button 
            type="button"
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 text-[#111111] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-3 transition-colors mb-5 disabled:opacity-50 shadow-sm outline-none focus:outline-none focus:ring-0 active:outline-none"
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5 object-contain" />
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-widest text-[#111111]/40">Or use email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 select-text transition-all duration-300">
            
            {authMode === 'signup' && (
              <div className="flex flex-col gap-1 text-left animate-fadeIn">
                <label className="text-[11px] font-bold tracking-wider uppercase text-[#111111]/70">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-marix-teal transition-colors text-[#111111]"
                />
              </div>
            )}

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[11px] font-bold tracking-wider uppercase text-[#111111]/70">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-marix-teal transition-colors text-[#111111]"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <label className="text-[11px] font-bold tracking-wider uppercase text-[#111111]/70">Password</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl pl-4 pr-11 py-2.5 text-sm focus:outline-none focus:border-marix-teal transition-colors text-[#111111]"
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111111] transition-colors focus:outline-none flex items-center justify-center"
                >
                  <i className={`ph ${showPassword ? 'ph-eye-slash' : 'ph-eye'} text-base`}></i>
                </button>
              </div>
              
              {authMode === 'login' && (
                <div className="text-right mt-1 select-none">
                  <span className="text-[11px] font-bold text-marix-teal underline cursor-pointer hover:opacity-80 transition-opacity">
                    Forgot Password?
                  </span>
                </div>
              )}
              
              {/* 🚀 FIXED: Password requirement indicators are now displayed dynamically across BOTH modes */}
              {formData.password && (
                <div className="flex gap-3 mt-1 px-0.5 select-none animate-fadeIn">
                  <span className={`text-[10px] flex items-center gap-1 ${hasMinLength ? 'text-marix-teal font-medium' : 'text-red-500 opacity-80'}`}>
                    {hasMinLength ? '✓' : '•'} 8+ chars
                  </span>
                  <span className={`text-[10px] flex items-center gap-1 ${hasNumber ? 'text-marix-teal font-medium' : 'text-red-500 opacity-80'}`}>
                    {hasNumber ? '✓' : '•'} 1+ number
                  </span>
                </div>
              )}
            </div>

            {authMode === 'signup' && (
              <div className="flex flex-col gap-1 text-left animate-fadeIn">
                <label className="text-[11px] font-bold tracking-wider uppercase text-[#111111]/70">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-marix-teal transition-colors text-[#111111]"
                />
                {formData.confirmPassword && (
                  <span className={`text-[10px] mt-0.5 px-0.5 select-none ${passwordsMatch ? 'text-marix-teal font-medium' : 'text-red-500 opacity-80'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (authMode === 'signup' ? !isSignUpValid : !isLoginValid)}
              className="w-full bg-marix-brown hover:opacity-95 disabled:bg-gray-200 disabled:text-gray-400 font-bold py-3 rounded-xl text-sm transition-all shadow-md mt-2 flex items-center justify-center gap-2 text-white focus:outline-none select-none"
            >
              {authMode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[11px] opacity-40 py-4 border-t border-gray-200 max-w-6xl mx-auto mt-auto shrink-0">
        &copy; {new Date().getFullYear()} Marix Technologies. All rights reserved.
      </footer>

    </div>
  );
}