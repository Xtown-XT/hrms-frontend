import React, { useState } from "react";
import "./Login.css";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import axiosInstance from "../Features/Api/Api";
// import { useAuth } from "../context/AuthContext";
import { message as antdMessage } from "antd";
import Loading from "../utils/Loading";

const Login = () => {
  const navigate = useNavigate();
  // const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isMobileLogin, setIsMobileLogin] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidMobile = (mobile) => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };

  // const isValidPassword = (password) => {
  //   return password.length >= 8;
  // };

  const routeModules = import.meta.glob("../*/AppRoutes.jsx", { eager: true });

  const modules = Object.entries(routeModules).map(([path, mod]) => {
    const match = path.match(/\.\/(.*?)\/AppRoutes\.jsx$/);
    const name = match?.[1];

    return {
      name,
      path: `/${name}/*`,
      element: mod.default,
      menuItems: mod[`${name}MenuItems`] || [],
    };
  });

  const getDefaultRedirect = () => {
    const companyModule = modules.find((mod) => mod.name === "company");
    const filteredModules = modules.filter((mod) => mod.name !== "dashboard");

    // If company module exists, find the next available module for dashboard
    if (companyModule) {
      const nextModule = filteredModules.find((mod) => mod.name !== "company");
      if (nextModule) {
        return `/${nextModule.name}/pages/dashboard`;
      }
    }

    // If no company module or no other modules available
    return filteredModules.length > 0
      ? `/${filteredModules[0].name}/pages/dashboard`
      : "/404";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;

    if (isMobileLogin) {
      if (!mobile.trim()) {
        setMobileError("Mobile number is required");
        hasError = true;
      } else if (!isValidMobile(mobile)) {
        setMobileError("Please enter a valid 10-digit mobile number");
        hasError = true;
      }
    } else {
      if (!email.trim()) {
        setEmailError("Email is required");
        hasError = true;
      } else if (!isValidEmail(email)) {
        setEmailError("Please enter a valid email address");
        hasError = true;
      }
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      let isAuthenticated = false;
      let dummyRole = "user";

      if (
        (!isMobileLogin &&
          email.trim() === "admin@xtown.com" &&
          password === "Password123!") ||
        (isMobileLogin &&
          mobile.trim() === "9999999999" &&
          password === "Password123!")
      ) {
        isAuthenticated = true;
        dummyRole = "admin";
      }

      if (!isAuthenticated) {
        throw new Error("Invalid credentials...!");
      }

      antdMessage.success({
        content: "Login successful!",
        duration: 3,
        style: { marginTop: "20px" },
      });

      // Simulated redirect
      if (
        dummyRole === "admin" ||
        dummyRole === "cluster admin" ||
        dummyRole === "branch admin"
      ) {
        navigate(getDefaultRedirect());
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.message || "Login failed!";
      setLoginError(errorMessage);
      antdMessage.error({
        content: errorMessage,
        duration: 5,
        style: { marginTop: "20px" },
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLoginMode = () => {
    setIsMobileLogin(!isMobileLogin);
    setEmail("");
    setMobile("");
    setEmailError("");
    setMobileError("");
    setLoginError("");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="welcome-container">
          <h3 className="welcome-heading">
            Welcome to &nbsp;
            <img src={x_logo} alt="XTOWN" />
            town..!
          </h3>
          <span className="welcome-tagline">
            We’re here to turn your ideas into reality.
          </span>
        </div>
      </div>

      <div className="login-right">
        <img src={logo} alt="Company Logo" className="logo" />

        <form className="login-form" onSubmit={handleSubmit}>
          <h3>LOGIN TO YOUR ACCOUNT</h3>
          {loginError && (
            <div
              className="login-error-message"
              style={{ marginBottom: "1rem", textAlign: "center" }}
            >
              {loginError}
            </div>
          )}

          <div
            className={`form-group ${isMobileLogin ? "mobile" : "email"} ${
              isMobileLogin ? mobileError : emailError ? "error" : ""
            } mb-4`}
          >
            <div className="input-wrapper">
              {isMobileLogin ? (
                <>
                  <input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={mobile ? "filled" : ""}
                    placeholder="Mobile Number"
                    maxLength={10}
                  />
                  <label htmlFor="mobile">Mobile Number</label>
                  <FaEnvelope
                    className="input-icon toggle-icon"
                    onClick={toggleLoginMode}
                    title="Use Email instead"
                  />
                </>
              ) : (
                <>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={email ? "filled" : ""}
                    placeholder="Email"
                  />
                  <label htmlFor="email">Email</label>
                  <FaPhone
                    className="input-icon toggle-icon"
                    onClick={toggleLoginMode}
                    title="Use Mobile Number instead"
                  />
                </>
              )}
            </div>
            {isMobileLogin && mobileError && (
              <div className="login-error-message">{mobileError}</div>
            )}
            {!isMobileLogin && emailError && (
              <div className="login-error-message">{emailError}</div>
            )}
          </div>
          <div
            className={`form-group password ${passwordError ? "error" : ""}`}
          >
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={password ? "filled" : ""}
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
              {showPassword ? (
                <FaEyeSlash
                  className="input-icon toggle-icon"
                  onClick={togglePasswordVisibility}
                  title="Hide Password"
                />
              ) : (
                <FaEye
                  className="input-icon toggle-icon"
                  onClick={togglePasswordVisibility}
                  title="Show Password"
                />
              )}
            </div>
            {passwordError && (
              <div className="login-error-message">{passwordError}</div>
            )}
          </div>

          <button type="submit" className="log-button" disabled={loading}>
            {loading ? <Loading /> : "LOGIN"}
          </button>
           <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <span>Don't have an account?</span>
              <span
                style={{
                  color: "#3d2c8bff",
                  fontWeight: "bold",
                  marginLeft: "4px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

// import { useState } from "react";
// import "./Login.css";
// import logo from "../components/assets/Company_logo.png";
// import x_logo from "../components/assets/Dark Logo.png";
// import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { message as antdMessage } from "antd";
// import Loading from "../utils/Loading";
// import { serviceUser } from "../iot/services/services";
// import { handleApiError } from "../utils/errorHandler";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [isMobileLogin, setIsMobileLogin] = useState(false);
//   const [emailError, setEmailError] = useState("");
//   const [mobileError, setMobileError] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [loginError, setLoginError] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const isValidEmail = (email) => {
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return regex.test(email);
//   };

//   const isValidMobile = (mobile) => {
//     const regex = /^\d{10}$/;
//     return regex.test(mobile);
//   };

//   const routeModules = import.meta.glob("../*/AppRoutes.jsx", { eager: true });
//   const modules = Object.entries(routeModules).map(([path, mod]) => {
//     const match = path.match(/\.\/(.*?)\/AppRoutes\.jsx$/);
//     const name = match?.[1];
//     return {
//       name,
//       path: `/${name}/*`,
//       element: mod.default,
//       menuItems: mod[`${name}MenuItems`] || [],
//     };
//   });

//   const getDefaultRedirect = () => {
//     const filteredModules = modules.filter((mod) => mod.name !== "dashboard");
//     return filteredModules.length > 0
//       ? `/${filteredModules[0].name}/pages/dashboard`
//       : "/404";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setEmailError("");
//     setMobileError("");
//     setPasswordError("");
//     setLoginError("");

//     let hasError = false;

//     if (isMobileLogin) {
//       if (!mobile.trim()) {
//         setMobileError("Mobile number is required");
//         hasError = true;
//       } else if (!isValidMobile(mobile)) {
//         setMobileError("Please enter a valid 10-digit mobile number");
//         hasError = true;
//       }
//     } else {
//       if (!email.trim()) {
//         setEmailError("Email is required");
//         hasError = true;
//       } else if (!isValidEmail(email)) {
//         setEmailError("Please enter a valid email address");
//         hasError = true;
//       }
//     }

//     if (!password.trim()) {
//       setPasswordError("Password is required");
//       hasError = true;
//     }

//     if (hasError) return;

//     setSubmitting(true);
//     try {
//       const payload = {
//         email: email.trim(),
//         password: password.trim(),
//       };

//       const response = await serviceUser.loginUser(payload);
//       if (response.status === 200 || response.status === 201) {
//         const token = response.data.access_token;
//         const userObj = await login(token);
//         if (userObj) {
//           antdMessage.success({
//             content: "Login successful!",
//             duration: 3,
//             style: { marginTop: "20px" },
//           });
//           navigate(getDefaultRedirect());
//         } else {
//           setLoginError("Unable to fetch user profile after login.");
//           antdMessage.error({
//             content: "Login succeeded but we couldn’t retrieve your profile.",
//             duration: 5,
//             style: { marginTop: "20px" },
//           });
//         }
//       } else {
//         setLoginError("Unexpected response status: " + response.status);
//         antdMessage.error({
//           content: "Login failed. Try again.",
//           duration: 5,
//           style: { marginTop: "20px" },
//         });
//       }
//     } catch (error) {
//       const errMsg =
//         error.response?.data?.message || error.message || "Login failed!";
//       handleApiError(errMsg);
//       setLoginError(errMsg);
//       antdMessage.error({
//         content: errMsg,
//         duration: 5,
//         style: { marginTop: "20px" },
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleLoginMode = () => {
//     setIsMobileLogin(!isMobileLogin);
//     setEmail("");
//     setMobile("");
//     setEmailError("");
//     setMobileError("");
//     setLoginError("");
//   };

//   return (
//     <div className="login-container">
//       <div className="login-left">
//         <div className="welcome-container">
//           <h3 className="welcome-heading">
//             Welcome to&nbsp;
//             <img src={x_logo} alt="XTOWN" />
//             town..!
//           </h3>
//           <span className="welcome-tagline">
//             We’re here to turn your ideas into reality.
//           </span>
//         </div>
//       </div>

//       <div className="login-right">
//         <img src={logo} alt="Company Logo" className="logo" />

//         <form className="login-form" onSubmit={handleSubmit}>
//           <h3>LOGIN TO YOUR ACCOUNT</h3>
//           {loginError && (
//             <div
//               className="login-error-message"
//               style={{ marginBottom: "1rem", textAlign: "center" }}
//             >
//               {loginError}
//             </div>
//           )}

//           <div
//             className={`form-group ${isMobileLogin ? "mobile" : "email"} ${
//               isMobileLogin ? mobileError : emailError ? "error" : ""
//             } mb-4`}
//           >
//             <div className="input-wrapper">
//               {isMobileLogin ? (
//                 <>
//                   <input
//                     id="mobile"
//                     type="tel"
//                     value={mobile}
//                     onChange={(e) => setMobile(e.target.value)}
//                     className={mobile ? "filled" : ""}
//                     placeholder="Mobile Number"
//                     maxLength={10}
//                   />
//                   <label htmlFor="mobile">Mobile Number</label>
//                   <FaEnvelope
//                     className="input-icon toggle-icon"
//                     onClick={toggleLoginMode}
//                     title="Use Email instead"
//                   />
//                 </>
//               ) : (
//                 <>
//                   <input
//                     id="email"
//                     type="text"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className={email ? "filled" : ""}
//                     placeholder="Email"
//                   />
//                   <label htmlFor="email">Email</label>
//                   <FaPhone
//                     className="input-icon toggle-icon"
//                     onClick={toggleLoginMode}
//                     title="Use Mobile Number instead"
//                   />
//                 </>
//               )}
//             </div>
//             {isMobileLogin && mobileError && (
//               <div className="login-error-message">{mobileError}</div>
//             )}
//             {!isMobileLogin && emailError && (
//               <div className="login-error-message">{emailError}</div>
//             )}
//           </div>

//           <div
//             className={`form-group password ${passwordError ? "error" : ""}`}
//           >
//             <div className="input-wrapper">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={password ? "filled" : ""}
//                 placeholder="Password"
//               />
//               <label htmlFor="password">Password</label>
//               {showPassword ? (
//                 <FaEyeSlash
//                   className="input-icon"
//                   onClick={togglePasswordVisibility}
//                   title="Hide Password"
//                 />
//               ) : (
//                 <FaEye
//                   className="input-icon"
//                   onClick={togglePasswordVisibility}
//                   title="Show Password"
//                 />
//               )}
//             </div>
//             {passwordError && (
//               <div className="login-error-message">{passwordError}</div>
//             )}
//           </div>

//           <button type="submit" className="log-button" disabled={submitting}>
//             {submitting ? <Loading /> : "LOGIN"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
