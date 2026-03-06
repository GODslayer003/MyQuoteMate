// admin/src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProfile, updateAdminProfile } from '../store/authThunks';
import { clearError } from '../store/authSlice';
import { Settings, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { admin, loading, error } = useSelector(state => state.auth);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    dispatch(getAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (admin) {
      setFormData({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        email: admin.email || '',
        password: ''
      });
    }
  }, [admin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {};

    if (formData.firstName !== admin.firstName) updates.firstName = formData.firstName;
    if (formData.lastName !== admin.lastName) updates.lastName = formData.lastName;
    if (formData.email !== admin.email) updates.email = formData.email;
    if (formData.password) updates.password = formData.password;

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    const result = await dispatch(updateAdminProfile(updates));
    if (result.payload) {
      setSuccess(true);
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Risk Analytics Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">Risk Analytics Dashboard</h1>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <svg width="160" height="160" viewBox="0 0 160 160" className="drop-shadow-md">
              <circle cx="80" cy="80" r="68" fill="#F7F8FA" stroke="#ECECEC" strokeWidth="2" />
              {/* Orange Segment */}
              <circle cx="80" cy="80" r="60" fill="none" stroke="#FFA726" strokeWidth="18" strokeDasharray="120 188" strokeDashoffset="0" />
              {/* Red Segment */}
              <circle cx="80" cy="80" r="60" fill="none" stroke="#FF5252" strokeWidth="18" strokeDasharray="68 188" strokeDashoffset="120" />
              {/* White Segment (for separation, optional) */}
              {/* <circle cx="80" cy="80" r="60" fill="none" stroke="#fff" strokeWidth="18" strokeDasharray="0 188" strokeDashoffset="188" /> */}
              <text x="80" y="90" textAnchor="middle" fontSize="32" fill="#222" fontWeight="bold" style={{ fontFamily: 'Inter, sans-serif' }}>3</text>
              <text x="80" y="110" textAnchor="middle" fontSize="14" fill="#888" fontWeight="600" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '2px' }}>TOTAL RISKS</text>
            </svg>
            <div className="mt-2 text-xs text-gray-500 font-medium tracking-wide">Financial | Technical | Quality</div>
          </div>
          {/* Executive Risk Exposure Index */}
          <div className="flex-1">
            <div className="mb-2 font-semibold text-gray-700">EXECUTIVE RISK EXPOSURE INDEX</div>
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-full max-w-xs">
                <div className="flex-1 bg-green-300 rounded-l-full" style={{ width: '30%' }}></div>
                <div className="flex-1 bg-yellow-300" style={{ width: '30%' }}></div>
                <div className="flex-1 bg-orange-300" style={{ width: '30%' }}></div>
                <div className="flex-1 bg-red-300 rounded-r-full" style={{ width: '10%' }}></div>
              </div>
              <div className="ml-2">
                <svg width="18" height="18"><polygon points="9,0 18,18 0,18" fill="#FF6B3D" /></svg>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>LOW RISK</span>
              <span>HIGH RISK</span>
            </div>
          </div>
        </div>
        {/* Strategic Insight */}
        <div className="mt-8 p-5 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="font-bold text-orange-700 text-lg mb-1">STRATEGIC INSIGHT</div>
          <div className="text-gray-700 text-sm leading-relaxed">
            MODERATE EXPOSURE: Standard industry risks identified. Most items can be resolved through minor specification adjustments. <br />
            <span className="block mt-2">This page provides a summary of risk analytics relevant to your current settings and profile. Please review the insights and adjust your specifications as needed to minimize exposure.</span>
          </div>
        </div>
      </div>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your admin profile and preferences</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Changes saved successfully</p>
              <p className="text-sm text-green-700">Your profile has been updated</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading && !admin ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Admin Profile</h2>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditing
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.firstName || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.lastName || 'Not set'}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                  {formData.email}
                </div>
              )}
            </div>

            {/* Password (only show if editing) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password (optional)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="input-field pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>
            )}

            {/* Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: admin.firstName || '',
                      lastName: admin.lastName || '',
                      email: admin.email || '',
                      password: ''
                    });
                  }}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;