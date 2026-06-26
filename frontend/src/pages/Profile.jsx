import React, { memo, useCallback, useEffect, useState } from "react";
import { profileStyles } from "../assets/dummyStyles";
import Modal from "react-modal";
import { Eye, EyeOff, User, Lock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const BASE_URL = "http://localhost:3000/api";

Modal.setAppElement("#root");

const PasswordInput = memo(
  ({
    name,
    label,
    value,
    error,
    showField,
    onToggle,
    onChange,
    disabled,
  }) => (
    <div>
      <label className={profileStyles.passwordLabel}>{label}</label>

      <div className={profileStyles.passwordContainer}>
        <input
          type={showField ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`${profileStyles.inputWithError} ${error ? "border-red-300" : "border-gray-200"
            }`}
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={profileStyles.passwordToggle}
        >
          {showField ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {error && <p className={profileStyles.errorText}>{error}</p>}
    </div>
  )
);

PasswordInput.displayName = "PasswordInput";

const Profile = ({ onUpdateProfile, onLogout }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    joinDate: "",
  });

  const [tempUser, setTempUser] = useState({
    name: "",
    email: "",
    joinDate: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const [loading, setLoading] = useState(false);


  // get token 
  const getAuthToken = useCallback(() => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }, []);

  // api req 
  const handleApiRequest = useCallback(
    async (method, endpoint, data = null) => {
      const token = getAuthToken();

      if (!token) {
        navigate("/login");
        return null;
      }

      try {
        setLoading(true);

        const config = {
          method,
          url: `${BASE_URL}${endpoint}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        if (data) config.data = data;

        const response = await axios(config);

        return response.data;
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          navigate("/login");
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken, navigate]
  );


  // fetch user data 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await handleApiRequest("get", "/user/get");

        if (data) {
          const userData = data.user || data;

          setUser(userData);
          setTempUser(userData);
        }
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchUser();
  }, [handleApiRequest]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setTempUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // handle password change 

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }, []);

  // password visiblity 

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const handleSaveProfile = async () => {
    try {
      const data = await handleApiRequest(
        "put",
        "/user/profile",
        tempUser
      );

      if (data) {
        const updatedUser = data.user || data;

        setUser(updatedUser);
        setTempUser(updatedUser);
        setEditMode(false);

        onUpdateProfile?.(updatedUser);

        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancelEdit = useCallback(() => {
    setTempUser(user);
    setEditMode(false);
  }, [user]);

  const validatePassword = useCallback(() => {
    const errors = {};

    if (!passwordData.current)
      errors.current = "Current password is required";

    if (!passwordData.new) {
      errors.new = "New password is required";
    } else if (passwordData.new.length < 8) {
      errors.new = "Password must be at least 8 characters";
    }

    if (passwordData.new !== passwordData.confirm) {
      errors.confirm = "Passwords do not match";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  }, [passwordData]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      await handleApiRequest("put", "/user/password", {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });

      toast.success("Password changed successfully");

      setShowPasswordModal(false);

      setPasswordData({
        current: "",
        new: "",
        confirm: "",
      });

      setPasswordErrors({});

      setShowPassword({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");

    onLogout?.();

    navigate("/signup");
  }, [navigate, onLogout]);

  const closePasswordModal = useCallback(() => {
    if (loading) return;

    setShowPasswordModal(false);

    setPasswordData({
      current: "",
      new: "",
      confirm: "",
    });

    setPasswordErrors({});

    setShowPassword({
      current: false,
      new: false,
      confirm: false,
    });
  }, [loading]);

  return (
    <div className={profileStyles.container}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className={profileStyles.mainContainer}>
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className={profileStyles.userName} >{user.name || "Loading..."}</h1>
          <p className={profileStyles.userEmail} >{user.email || "Loading..."}</p>
          {/* Your remaining JSX goes here */}
        </div>

        <div className={profileStyles.content} >
          <div className={profileStyles.grid} >
            <div className={profileStyles.card} >
              <div className="flex justify-between items-center mb-6" >
                <h2 className={profileStyles.cardTitle} >
                  <User className={profileStyles.icon} />
                  Personal Information
                </h2>
                {!editMode &&
                  <button onClick={() => setEditMode(true)}
                    className={profileStyles.editButton}
                    disabled={loading}>
                    {loading ? "Loading" : "Edit"}
                  </button>}
              </div>
              {editMode ? (
                <div className=" space-y-4" >
                  <div>
                    <label className={profileStyles.label} > Full Name</label>
                    <input type="text" name="name" value={tempUser.name}
                      onChange={handleInputChange} className={profileStyles.input}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className={profileStyles.label} > Email</label>
                    <input type="email" name="email" value={tempUser.email}
                      onChange={handleInputChange} className={profileStyles.input}
                      disabled={loading}
                    />
                  </div>
                  <div className="flex gap-3 pt-4 "
                  >
                    <button onClick={handleSaveProfile} className={profileStyles.buttonPrimary}
                      disabled={loading}>
                      {loading ? "Saving" : "Save Changes"}

                    </button>
                    <button onClick={handleCancelEdit} className={profileStyles.buttonSecondary}
                      disabled={loading}>
                      Cancel
                    </button>

                  </div>
                </div>
              ) : (
                <div className="space-y-4" >
                  <div>
                    <p className={profileStyles.label} > Full Name </p>
                    <p className="font-medium text-gray-800">
                      {user?.name
                        ?.split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        )
                        .join(" ") || "User"}
                    </p>
                  </div>
                  <div>
                    <p className={profileStyles.label} > Email Address </p>
                    <p className="font-medium text-gray-800" >{user.email}</p>
                  </div>
                </div>
              )}

            </div>
            <div className={profileStyles.card} >
              <h2 className={profileStyles.cardTitle} >
                <Lock className={profileStyles.icon} />
                Account Security
              </h2>
              <div className="space-y-4">
                <div className={profileStyles.securityItem} >
                  <div >
                    <p className={profileStyles.securityText} >Password</p>
                  </div>
                  <button onClick={() => setShowPasswordModal(true)}
                    className={profileStyles.changeButton}
                    disabled={loading} >
                    Change
                  </button>
                </div>
                <button onClick={handleLogout} className={`${profileStyles.buttonPrimary} mt-6 w-full
                 hover:opacity-90 transition-opacity `}
                  disabled={loading} >
                  {loading ? "Processing..." : "Logout"}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>


      {/* change password  */}
      <Modal
        isOpen={showPasswordModal}
        onRequestClose={closePasswordModal}
        contentLabel="Change Password"
        className="modal"
        overlayClassName="modal-overlay"
        // Prevent unnecessary re-renders
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
      >
        <div className={profileStyles.modalContent}>
          <div className={profileStyles.modalHeader}>
            <h3 className={profileStyles.modalTitle}>Change Password</h3>
            <button
              onClick={closePasswordModal}
              className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 lg:-mx-20">
            <PasswordInput
              name="current"
              label="Current Password"
              value={passwordData.current}
              error={passwordErrors.current}
              showField={showPassword.current}
              onToggle={() => togglePasswordVisibility('current')}
              onChange={handlePasswordChange}
              disabled={loading}
            />

            <PasswordInput
              name="new"
              label="New Password"
              value={passwordData.new}
              error={passwordErrors.new}
              showField={showPassword.new}
              onToggle={() => togglePasswordVisibility('new')}
              onChange={handlePasswordChange}
              disabled={loading}
            />

            <PasswordInput
              name="confirm"
              label="Confirm New Password"
              value={passwordData.confirm}
              error={passwordErrors.confirm}
              showField={showPassword.confirm}
              onToggle={() => togglePasswordVisibility('confirm')}
              onChange={handlePasswordChange}
              disabled={loading}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className={profileStyles.buttonPrimary}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={closePasswordModal}
                className={profileStyles.buttonSecondary}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
};

export default Profile;