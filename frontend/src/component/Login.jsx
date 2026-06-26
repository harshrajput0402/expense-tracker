import React from 'react'
import { loginStyles } from '../assets/dummyStyles'
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import axios from 'axios'
function Login({ onLogin, API_URL = "http://localhost:3000" }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // to fetch profile here 
    const fetchProfile = async (token) => {
        if (!token) return null;
        const res = await axios.get(`${API_URL}/api/user/get`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        return res.data;
    };

    const persistAuth = (profile, token) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        try {
            if (token) storage.setItem("token", token);
            if (profile) storage.setItem("user", JSON.stringify(profile));
        }
        catch (err) {
            console.error("persistAuth error", err);
        }
    };
    // to handle login form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent default form submission
        setLoading(true); // set loading state to true when starting login
        setError("");
        try {
            const res = await axios.post(`${API_URL}/api/user/login`,
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );
            const data = res.data || {};
            const token = data.token || null;

            // fetch profile using token
            let profile = data.user || null;

            if (!profile) {
                const copy = { ...data };
                delete copy.token;
                delete copy.user;
                if (Object.keys(copy).length > 0) {
                    profile = copy;
                }
            }
            if (!profile && token) {
                try {
                    profile = await fetchProfile(token);

                }
                catch (err) {
                    console.error("Error fetching profile after login", err);
                    profile = { email }; // fallback to email if profile fetch fails
                }
            }
            if (!profile) {
                profile = { email }; // fallback to email if no profile data
            }
            persistAuth(profile, token);
            if (typeof onLogin === "function") {
                try {
                    onLogin(profile, token, rememberMe);
                }
                catch (err) {
                    console.warn("onLogin callback error", err);
                    navigate("/"); // fallback navigation if onLogin fails  
                }
            }
            else {
                navigate("/"); // fallback navigation if no onLogin callback
            }
            setPassword("");


        }
        catch (err) {
            console.error("Login error:", err?.response || err);
            const serverMsg =
                err.response?.data?.message ||
                (err.response?.data ? JSON.stringify(err.response.data) : null) ||
                err.message ||
                "Login failed";
            setError(serverMsg);
        }
        finally {
            setLoading(false);
        }
    }





    return (
        <div className={loginStyles.pageContainer} >
            <div className={loginStyles.cardContainer} >
                <div className={loginStyles.header} >
                    <div className={loginStyles.avatar} >
                        <User className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className={loginStyles.headerTitle} > Welcome back </h1>
                    <p className={loginStyles.headerSubtitle} > Sign in to your Expense Tracker  account </p>
                </div>
                <div className={loginStyles.formContainer} >
                    {error && (
                        <div className={loginStyles.errorContainer}>
                            <div className={loginStyles.errorIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className={loginStyles.errorText}>{error}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} >
                        <div className='mb-6' >
                            <label htmlFor="email" className={loginStyles.label} >
                                Email Address
                            </label>
                            <div className={loginStyles.inputContainer} >
                                <div className={loginStyles.inputIcon} >
                                    <Mail className="h-6 w-5 text-gray-400" />
                                </div>
                                <input type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={loginStyles.input}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className='mb-6' >
                            <label htmlFor="password" className={loginStyles.label} >
                                Password
                            </label>
                            <div className={loginStyles.inputContainer} >
                                <div className={loginStyles.inputIcon} >
                                    <Lock className="h-6 w-5 text-gray-400" />
                                </div>
                                <input type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={loginStyles.passwordInput}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={loginStyles.passwordToggle}>
                                    {showPassword ? (
                                        <Eye className="h-6 w-5 text-gray-400" />
                                    ) : (
                                        <EyeOff className="h-6 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={loginStyles.checkboxContainer} >
                            <input type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={loginStyles.checkbox}
                            />
                            <label htmlFor="remember" className={loginStyles.checkboxLabel} >
                                Remember me
                            </label>
                        </div>

                        <button type="submit"
                            disabled={loading}
                            className={`${loginStyles.button} 
                            ${loading ? loginStyles.buttonDisabled : ""}`}
                        >
                            {loading ? (
                                <>
                                    <svg className={loginStyles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </>
                            )
                                : ("Sign In")}
                        </button>
                    </form>

                    {/* // to navigate to signup page  */}
                    <div className={loginStyles.signUpContainer} >
                        <p className={loginStyles.signUpText} >
                            Don't have an account? 
                            {/* <a href="/signup" className={loginStyles.signUpLink} >Sign up</a> */}
                            <Link to="/signup" className={loginStyles.signUpLink} >Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Login;