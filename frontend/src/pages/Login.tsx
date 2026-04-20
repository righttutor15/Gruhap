import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setAuthSuccess, setAuthFailure } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, X, Eye, EyeOff } from 'lucide-react';
import './LoginPop.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
const OTP_RESEND_SECONDS = 30;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [step, setStep] = useState<'phone' | 'otp' | 'email' | 'emailOtp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [otpContext, setOtpContext] = useState<{ type: 'phone' | 'email' | null, value: string }>({ type: null, value: '' });

    const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    useEffect(() => {
        if ((step === 'otp' || step === 'emailOtp') && otpRefs[0].current) {
            otpRefs[0].current.focus();
        }
    }, [step]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const requestOtp = async (value: string, type: 'phone' | 'email') => {
        dispatch(setLoading(true));
        try {
            const response = await fetch(`${API_BASE_URL}/otp/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: value }),
            });

            const data = await response.json();

            if (!response.ok || data.success === false) {
                throw new Error(data.message || 'Unable to send OTP');
            }

            setOtpContext({ type, value });
            setOtp(['', '', '', '']);
            setResendTimer(OTP_RESEND_SECONDS);
            toast({ title: "OTP Sent", description: `We've sent a 4-digit code to your ${type}.` });
            return data;
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to send OTP", variant: "destructive" });
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.every((digit) => digit !== '')) return;

        dispatch(setLoading(true));
        const enteredOtp = otp.join('');

        try {
            const response = await fetch(`${API_BASE_URL}/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: otpContext.value,
                    enteredOtp,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.success === false) {
                throw new Error(data.message || 'OTP verification failed');
            }

            // Success!
            const userData = {
                uid: data.data?.userId || "user_" + Date.now(),
                email: otpContext.type === 'email' ? otpContext.value : (data.data?.email || ""),
                displayName: data.data?.name || "User"
            };

            dispatch(setAuthSuccess(userData));
            setShowSuccessAnimation(true);

            setTimeout(() => {
                navigate('/'); // Or MainDashBoard if it exists
            }, 2500);

        } catch (error: any) {
            dispatch(setAuthFailure(error.message));
            toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 10) {
            toast({ title: "Invalid Input", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
            return;
        }

        try {
            await requestOtp(phoneNumber, 'phone');
            setStep('otp');
        } catch (err) {}
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await requestOtp(email, 'email');
            setStep('emailOtp');
        } catch (err) {}
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 3) {
                otpRefs[index + 1].current?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    return (
        <div className="login-pop-page-wrapper">
            {/* Left Section - AI Experience */}
            <div className="login-pop-left-section">
                <div className="login-pop-chat-header">
                    <h3>Experience Gruhap</h3>
                    <p>Your Trusted AI Study Buddy</p>
                </div>

                <div className="login-pop-chat-container">
                    {/* Chat Messages */}
                    <div className="chat-bubble ai-bubble" style={{ animationDelay: '0.2s' }}>
                        <div className="bubble-avatar avatar-ai">G</div>
                        <div className="bubble-content">
                            <div className="bubble-name">Gruhap AI</div>
                            <p>Hey! Ready to crush your study goals today?</p>
                        </div>
                    </div>

                    <div className="chat-bubble user-bubble" style={{ animationDelay: '0.8s' }}>
                        <div className="bubble-avatar avatar-user">U</div>
                        <div className="bubble-content">
                            <p>I'm having a hard time with Calculus integration.</p>
                        </div>
                    </div>

                    <div className="chat-bubble ai-bubble" style={{ animationDelay: '1.4s' }}>
                        <div className="bubble-avatar avatar-ai">G</div>
                        <div className="bubble-content">
                            <div className="bubble-name">Gruhap AI</div>
                            <p>I've got you! Should we start with a 1-min concept summary, or solve a practice problem together?</p>
                        </div>
                    </div>

                    <div className="chat-bubble user-bubble" style={{ animationDelay: '2s' }}>
                        <div className="bubble-avatar avatar-user">U</div>
                        <div className="bubble-content">
                            <p>Let's solve a problem!</p>
                        </div>
                    </div>

                    <div className="chat-bubble ai-bubble" style={{ animationDelay: '2.6s' }}>
                        <div className="bubble-avatar avatar-ai">G</div>
                        <div className="bubble-content">
                            <div className="bubble-name">Gruhap AI</div>
                            <p>Perfect. Let's master the substitution method step-by-step. You'll ace this!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="login-pop-right-section">
                <div className="login-pop-nav">
                    <button className="nav-btn" onClick={() => {
                        if (step === 'otp') setStep('phone');
                        else if (step === 'emailOtp') setStep('email');
                        else navigate(-1);
                    }}>
                        <ArrowLeft size={20} />
                    </button>
                    <button className="nav-btn" onClick={() => navigate('/')}>
                        <X size={20} />
                    </button>
                </div>

                <div className="login-pop-card">
                    {showSuccessAnimation ? (
                        <div className="success-overlay">
                            <div className="checkmark-circle">
                                <svg viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" />
                                    <path className="checkmark-check" d="M30 50 L45 65 L70 35" />
                                </svg>
                            </div>
                            <h3 className="success-text">Login Successful!</h3>
                        </div>
                    ) : (
                        <>
                            <div className="login-pop-logo">Gruhap</div>

                            {step === 'phone' && (
                                <>
                                    <h2 className="login-pop-heading">Welcome Back!</h2>
                                    <p className="login-pop-subheading">Sign in to continue your academic journey</p>
                                    <form className="login-pop-form" onSubmit={handlePhoneSubmit}>
                                        <div className="phone-input-container">
                                            <div className="country-selector">
                                                <img src="https://flagcdn.com/in.svg" alt="IN" className="flag-icon" />
                                                <span className="country-code">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                className="phone-input"
                                                placeholder="Phone Number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="continue-btn" disabled={isLoading}>
                                            {isLoading ? 'Processing...' : 'Continue'}
                                        </button>
                                        <div className="divider"><span>or</span></div>
                                        <button type="button" className="email-btn" onClick={() => setStep('email')}>
                                            Continue with Email
                                        </button>
                                    </form>
                                </>
                            )}

                            {step === 'otp' && (
                                <>
                                    <h2 className="login-pop-heading">Verify OTP</h2>
                                    <p className="login-pop-subheading">Sent to +91 {phoneNumber}</p>
                                    <form className="login-pop-form">
                                        <div className="otp-inputs">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={otpRefs[i]}
                                                    type="text"
                                                    maxLength={1}
                                                    className="otp-field"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                />
                                            ))}
                                        </div>
                                        <div className="resend-container">
                                            <span>Didn't receive code?</span>
                                            {resendTimer > 0 ? (
                                                <span className="resend-timer">{resendTimer}s</span>
                                            ) : (
                                                <button type="button" className="resend-link" onClick={() => requestOtp(phoneNumber, 'phone')}>Resend</button>
                                            )}
                                        </div>
                                        <button 
                                            type="button" 
                                            className="continue-btn" 
                                            onClick={handleVerifyOtp}
                                            disabled={isLoading || !otp.every(d => d)}
                                        >
                                            {isLoading ? 'Verifying...' : 'Verify & Continue'}
                                        </button>
                                    </form>
                                </>
                            )}

                            {step === 'email' && (
                                <>
                                    <h2 className="login-pop-heading">Login with Email</h2>
                                    <p className="login-pop-subheading">Enter your email to receive an OTP</p>
                                    <form className="login-pop-form" onSubmit={handleEmailSubmit}>
                                        <input
                                            type="email"
                                            className="phone-input"
                                            placeholder="Email Address"
                                            style={{ marginBottom: '1.5rem' }}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="continue-btn" disabled={isLoading}>
                                            {isLoading ? 'Processing...' : 'Continue'}
                                        </button>
                                        <div className="divider"><span>or</span></div>
                                        <button type="button" className="email-btn" onClick={() => setStep('phone')}>
                                            Back to Phone Login
                                        </button>
                                    </form>
                                </>
                            )}

                            {step === 'emailOtp' && (
                                <>
                                    <h2 className="login-pop-heading">Verify Email OTP</h2>
                                    <p className="login-pop-subheading">Sent to {email}</p>
                                    <form className="login-pop-form">
                                        <div className="otp-inputs">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={otpRefs[i]}
                                                    type="text"
                                                    maxLength={1}
                                                    className="otp-field"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                />
                                            ))}
                                        </div>
                                        <div className="resend-container">
                                            {resendTimer > 0 ? (
                                                <span className="resend-timer">Resend in {resendTimer}s</span>
                                            ) : (
                                                <button type="button" className="resend-link" onClick={() => requestOtp(email, 'email')}>Resend OTP</button>
                                            )}
                                        </div>
                                        <button 
                                            type="button" 
                                            className="continue-btn" 
                                            onClick={handleVerifyOtp}
                                            disabled={isLoading || !otp.every(d => d)}
                                        >
                                            {isLoading ? 'Verifying...' : 'Verify & Continue'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
