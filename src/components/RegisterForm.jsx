import React, { useState } from 'react';
import googleIcon from '../images/google-icon.png';
import marixLogoM from '../images/marix-logo-m.png'; 

export default function AuthForm() {
  const [authMode, setAuthMode] = useState('signup'); 
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const isStrictEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  const isLoginValid = isStrictEmailValid && formData.password.length > 0;
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
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 2000); 
  };

  return (
    <div 
      className="min-h-screen bg-marix-cream flex flex-col justify-between p-4 md:p-6 text-[#111111] relative overflow-hidden"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      
      {/* 🚀 RESPONSIVE TOAST FIX: Uses full mobile scaling with explicit side constraints */}
      {successMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 max-w-sm bg-marix-teal text-white px-4 py-3 rounded-xl shadow-xl font-medium text-xs md:text-sm flex items-start gap-2.5 break-words">
          <span className="shrink-0">✨</span>
          <div className="flex-1 min-w-0">
            {successMessage}
          </div>
        </div>
      )}

            {/* Brand Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center py-2 select-none">
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
          className="tracking-tight text-[#111111] pt-1">
            ARIX
          </span>
        </div>

        <span 
          style={{
            fontSize: '1rem',
            // color: '#452b1fd2',
            // fontWeight: '700',
            // letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
          className="hidden sm:inline-block"
        >
          secure gateway
        </span>
      </header>
      
      {/* Central Content Area */}
      <div className="w-full flex flex-col justify-center items-center my-auto py-6">
        
        {/* Dynamic Headings on Screen Background */}
        <div className="text-center mb-8 select-none">
          <h2 className="text-3xl font-black tracking-tight text-[#111111] mb-2">
            {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-[#111111]/70 max-w-[320px] mx-auto leading-normal font-medium">
            {authMode === 'signup' 
              ? 'Join Marix to discover and get discovered.' 
              : 'Sign in to continue where you left off.'}
          </p>
        </div>

        {/* Sharper Form Content Card */}
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-xl border border-gray-200/90 px-6 py-8 md:px-8 relative transition-all duration-300">
          
          {/* Form Loader Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-xl z-40 flex items-center justify-center transition-all">
              <div className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 border-4 border-marix-teal/20 border-t-marix-teal rounded-full animate-spin"></div>
                <p className="text-xs font-bold tracking-wide text-[#111111]/70">Connecting to Marix...</p>
              </div>
            </div>
          )}

          {/* Dynamic Navigation Tabs */}
          <div className="flex bg-marix-cream/60 p-1 rounded-lg mb-6 border border-gray-200/50">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all ${
                authMode === 'login' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#111111]/50 hover:text-[#111111]'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md transition-all ${
                authMode === 'signup' ? 'bg-white text-[#111111] shadow-sm' : 'text-[#111111]/50 hover:text-[#111111]'
              }`}
            >
              Create account
            </button>
          </div>

          {/* Google Auth Option */}
          <button 
            type="button"
            disabled={isLoading}
            className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#111111] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-3 transition-all mb-5 disabled:opacity-50 shadow-sm active:scale-[0.99]"
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5 object-contain" />
            Continue with Google
          </button>

          {/* Divider Line */}
          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-widest text-[#111111]/40">Or use email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            
            {/* Conditional Input: First Name */}
            {authMode === 'signup' && (
              <div className="flex flex-col gap-1 transition-all duration-200">
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

            {/* Email Input */}
            <div className="flex flex-col gap-1">
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

            {/* Password Input with Eye Toggle Switch */}
            <div className="flex flex-col gap-1">
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111111] transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {authMode === 'login' && (
                <div className="text-right mt-1">
                  <span className="text-[11px] font-bold text-marix-teal underline cursor-pointer hover:opacity-80 transition-opacity">
                    Forgot Password?
                  </span>
                </div>
              )}
              
              {authMode === 'signup' && formData.password && (
                <div className="flex gap-3 mt-1 px-0.5">
                  <span className={`text-[10px] flex items-center gap-1 ${hasMinLength ? 'text-marix-teal font-medium' : 'text-red-500 opacity-80'}`}>
                    {hasMinLength ? '✓' : '•'} 8+ chars
                  </span>
                  <span className={`text-[10px] flex items-center gap-1 ${hasNumber ? 'text-marix-teal font-medium' : 'text-red-500 opacity-80'}`}>
                    {hasNumber ? '✓' : '•'} 1+ number
                  </span>
                </div>
              )}
            </div>

            {/* Conditional Input: Confirm Password */}
            {authMode === 'signup' && (
              <div className="flex flex-col gap-1 transition-all duration-200">
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
                  <span className={`text-[10px] mt-0.5 px-0.5 ${passwordsMatch ? 'text-marix-teal font-medium' : 'text-red-500 opacity-80'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </span>
                )}
              </div>
            )}

            {/* Principal Action Button */}
            <button
              type="submit"
              disabled={isLoading || (authMode === 'signup' ? !isSignUpValid : !isLoginValid)}
              className="w-full bg-marix-brown hover:opacity-95 disabled:bg-gray-200 disabled:text-gray-400 font-bold py-3 rounded-xl text-sm transition-all shadow-md mt-2 flex items-center justify-center gap-2 text-white"
            >
              {authMode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>

      {/* Footer Anchor */}
      <footer className="w-full text-center text-[11px] opacity-40 py-2 border-t border-gray-200 max-w-6xl mx-auto">
        &copy; {new Date().getFullYear()} Marix Technologies. All rights reserved.
      </footer>

    </div>
  );
}