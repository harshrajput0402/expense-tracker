import react from 'react'
import axios from 'axios';
import { signupStyles } from '../assets/dummyStyles'
import { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

//  vdo at 2 : 46 
function Signup({ onSignup, API_URL = "http://localhost:3000" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  // for validateing the form user input

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // for handling the form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/user/register`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const { token, user } = res.data;
      persistAuth(user, token);
      onSignup(user, token);
      navigate("/profile");

      const data = res.data || {};
      const Token = data.token ?? null;
      let profile = data.user ?? null;
      if (!profile) {
        // check for any extra fields returned that could be user info
        const copy = { ...data };
        delete copy.Token;
        delete copy.user;
        if (Object.keys(copy).length) profile = copy;
      }

      if (!profile && token) {
        try {
          profile = await fetchProfile(token);
        } catch (fetchErr) {
          console.warn("Could not fetch profile after signup token:", fetchErr);
          profile = null;
        }
      }

      if (!profile) profile = { name, email };
      persistAuth(profile, token);
      if (typeof onSignup === "function") {
        try {
          onSignup(profile, rememberMe, token);
        } catch (callErr) {
          console.warn("onSignup threw:", callErr);
          navigate("/");
        }
      } else {
        navigate("/");
      }
      setPassword("");
    }
    catch (err) {
      console.error("Signup error:", err?.response || err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ api: err.response.data.message });
      } else {
        setErrors({ api: err.message || "An unexpected error occurred" });
      }
    }
    finally {
      setIsLoading(false);
    }

  }

  return (
    <div className={signupStyles.pageContainer} >

      <div className={signupStyles.cardContainer} >

        <div className={signupStyles.header} >
          <button onClick={() => navigate(-1)}
            className={signupStyles.backButton} >
            <ArrowLeft className=" w-5 h-5"></ArrowLeft>
          </button>
          <div className={signupStyles.avatar} >
            <User className="w-10 h-10 text-white" ></User>
          </div>
          <h1 className={signupStyles.headerTitle} > Create Account</h1>
          <p className={signupStyles.headerSubtitle} > Join us today and start your journey!</p>
        </div>
        <div className={signupStyles.formContainer} >
          {errors.api && <p className={signupStyles.apiError} >{errors.api}</p>}
          <form onSubmit={handleSubmit} noValidate >
            <div className="mb-6" >
              <label htmlFor="name" className={signupStyles.label} >
                Full name
              </label>
              <div className={signupStyles.inputContainer} >
                <div className={signupStyles.inputIcon} >
                  <User className="w-4 h-4" ></User>
                </div>
                <input type="text"
                  id="name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${signupStyles.input}
                  ${errors.name ? "border-red-300" : "border-gray-200"}`}
                  placeholder="Harsh Rajput"
                />
              </div>
              {errors.name && <p className={signupStyles.fieldError} >{errors.name}</p>}

            </div>
            <div className="mb-6" >
              <label htmlFor="email" className={signupStyles.label} >
                Email Address
              </label>
              <div className={signupStyles.inputContainer} >
                <div className={signupStyles.inputIcon} >
                  <Mail className="w-4 h-4" ></Mail>
                </div>
                <input type="text" id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${signupStyles.input} ${errors.email ? "border-red-300" : "border-gray-200"}`}
                  placeholder="harsh@rajput.com" >
                </input>
              </div>
              {errors.email && <p className={signupStyles.fieldError} >{errors.email}</p>}
            </div>
            <div className="mb-6" >
              <label htmlFor="password" className={signupStyles.label} >
                Password
              </label>
              <div className={signupStyles.inputContainer} >
                <div className={signupStyles.inputIcon} >
                  <Lock className="w-4 h-4" ></Lock>
                </div>
                <input type={showPassword ? "text" : "password"}
                  id="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${signupStyles.passwordInput} ${errors.password ? "border-red-300" : "border-gray-200"}`}
                  placeholder="••••••••" >
                </input>
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className={signupStyles.passwordToggle} >
                  {showPassword ? (<EyeOff className="w-5 h-5" />) : (<Eye className="w-5 h-P5" />)}
                </button>

              </div>
              {errors.password && <p className={signupStyles.fieldError} >{errors.password}</p>}

            </div>
            <div className={signupStyles.checkboxContainer} >
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={signupStyles.checkbox}
              />
              <label htmlFor="remember" className={signupStyles.checkboxLabel}>
                Remember Me
              </label>
            </div>
            <button type="submit"
              className={`${signupStyles.button} 
              ${isLoading ? signupStyles.buttonDisabled : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (<>
                <svg className={signupStyles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account
              </>) : (
                "Create Account"
              )}

            </button>

          </form>
        {/* if user have already account  */}
        <div className={signupStyles.signInContainer} >
          <p className={signupStyles.signInText} >
            Already have an account?{" "}
            <Link to="/login" className={signupStyles.signInLink} >
            Sign in
            </Link>
          </p>
        </div>

        </div>
      </div>

    </div>


  )
}
export default Signup; 