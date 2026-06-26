import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from "./component/Layout.jsx"
import DashBoard from "./pages/DashBoard.jsx"
import Login from "./component/Login.jsx"
import Signup from "./component/Signup.jsx"
import axios from 'axios';
import Income from './pages/Income.jsx';
import Expense from './pages/Expense.jsx'
import Profile from './pages/Profile.jsx'

const API_URL = "http://localhost:3000";
// to get transaction from localstorage 
const getTransactionsFromStorage = () => {
  const saved = localStorage.getItem("transactions")
  return saved ? JSON.parse(saved) : []
}


//  to protect route here 
const ProtectedRoute = ({ user, children }) => {
  const localToken = localStorage.getItem("token")
  const sessionToken = sessionStorage.getItem("token")
  const hasToken = localToken || sessionToken;
  if (!user || !hasToken) {
    return <Navigate to="/login" replace />
  }
  return children;
}

// to scroll to top when page gets reloaded or new page is visited 
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [location.pathname])
  return null;
}

const App = () => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // to store user and token in local or session storage based on remember me option
  const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) localStorage.setItem("token", tokenStr);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) sessionStorage.setItem("token", tokenStr);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setUser(userObj || null);
      setToken(tokenStr || null);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };
  const clearAuth = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem('token');
    }
    catch (err) {
      console.error("clearAuth error", err);
    }
    setUser(null);
    setToken(null)

  };

  // to update the user data in both state and storage 
  const updateUserData = (updateUser) => {
    setUser(updatedUser);

    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");

    if (localToken) {
      localStorage.setItem("user", JSON.stringify(updateUser));
    }
    else if (sessionToken) {
      sessionToken.setItem("user", JSON.stringify(updateUser));
    }

  }

  //  try to load user  with token when mounted 
  useEffect(() => {
    (async () => {
      try {
        const localUserRaw = localStorage.getItem("user");
        const sessionUserRaw = sessionStorage.getItem("user");
        const localToken = localStorage.getItem("token");
        const sessionToken = sessionStorage.getItem("token");

        const storedUser = localUserRaw ? JSON.parse(localUserRaw)
          : sessionUserRaw ? JSON.parse(sessionUserRaw)
            : null;

        const storedToken = localToken || sessionToken || null;

        const tokenFromLocal = !!localToken;

        if (storedUser) {
          setUser(storedUser);
          setToken(storedToken);
          setIsLoading(false);
          return;
        }
        if (storedToken) {
          try {
            const res = await axios.get(`${API_URL}/api/user/get`, {
              headers: { Authorization: `Bearer ${storedToken}` }
            }
            )
            const profile = res.data;
            persistAuth(profile, storedToken, tokenFromLocal)
          }
          catch (fetchErr) {
            console.warn("could not fetch profile with the stored token", fetchErr);
            clearAuth();
          }
        }
      }
      catch (err) {
        console.error("error bootstrapping auth", err);
      }
      finally {

        setIsLoading(false);


        try {
          setTransactions(getTransactionsFromStorage());
        }
        catch (txErr) {
          console.error("Error loading transactions:", txErr);
        }
      }
    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
    catch (err) {
      console.error("error saving transaction:", err);
    }
  }, [transactions]);

  const handleLogin = (userData, tokenFromApi, remember = false) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };
  const handleSignup = (userData, tokenFromApi, remember = false) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };
  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  }
  // transaction helpers
  const addTransaction = (newTransaction) =>
    setTransactions((p) => [newTransaction, ...p]);


  const editTransaction = (id, updatedTransaction) =>
    setTransactions((p) =>
      p.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)),
    );


  const deleteTransaction = (id) =>
    setTransactions((p) => p.filter((t) => t.id !== id));


  const refreshTransactions = () =>
    setTransactions(getTransactionsFromStorage());


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} ></Route>
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} ></Route>


        <Route path="/" element={
          <ProtectedRoute user={user}
            addTransaction={addTransaction}
            edittransaction={editTransaction}
            deletetransaction={deleteTransaction}
            refreshtransaction={refreshTransactions}>
            <Layout user={user} onLogout={handleLogout} />
          </ProtectedRoute>}>
          <Route index element={<DashBoard />}
            transactions={transactions}
            addTransaction={addTransaction}
            edittransaction={editTransaction}
            deletetransaction={deleteTransaction}
            refreshtransaction={refreshTransactions}
          />

          <Route path='/income' element={<Income
            transactions={transactions}
            addTransaction={addTransaction}
            edittransaction={editTransaction}
            deletetransaction={deleteTransaction}
            refreshtransaction={refreshTransactions}
          />
          }
          />
          <Route path='/expense' element={<Expense 
            transactions={transactions}
            addTransaction={addTransaction}
            edittransaction={editTransaction}
            deletetransaction={deleteTransaction}
            refreshtransaction={refreshTransactions}
          />
          }
          />
          <Route path='/profile' element={<Profile
           user={user}
           onUpadteProfile={updateUserData}
           onLogout={handleLogout}
          />}
          />
        </Route>

        <Route path='*' 
        element={<Navigate to={user ? "/" : "/login"} replace  />} />
      </Routes>
    </>
  )
}

export default App;