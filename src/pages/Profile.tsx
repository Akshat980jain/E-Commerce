import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DynamicIcon from '../components/common/DynamicIcon';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Initialize form with user data
      setFormData(prevData => ({
        ...prevData,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (isEditing) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      // Only validate password fields if any of them has a value
      if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
        if (!formData.currentPassword) {
          newErrors.currentPassword = 'Current password is required to change password';
        }
        
        if (formData.newPassword && formData.newPassword.length < 6) {
          newErrors.newPassword = 'Password must be at least 6 characters';
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    if (validateForm()) {
      // In a real app, this would call an API to update the user's profile
      // For demo purposes, we'll just show a success message
      
      // Update user data in local storage to simulate backend update
      if (user) {
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Show success message
        setSuccessMessage('Profile updated successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        
        // Exit edit mode
        setIsEditing(false);
        
        // Reset password fields
        setFormData(prevData => ({
          ...prevData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
              // Reset form data to original values
              setFormData({
                name: user.name,
                email: user.email,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
              setErrors({});
            } else {
              navigate(-1); // Go back
            }
          }}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          {isEditing ? (
            <>
              <DynamicIcon name="close" size="sm" className="mr-1" />
              Cancel
            </>
          ) : (
            <>
              <DynamicIcon name="left" size="sm" className="mr-1" />
              Back
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md">
          <div className="flex items-start">
            <DynamicIcon name="cart" size="sm" className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                !isEditing ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                !isEditing ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {isEditing && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Change Password (Optional)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-md ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              className={`px-6 py-3 rounded-md font-medium flex items-center ${
                isEditing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <DynamicIcon 
                name={isEditing ? 'cart' : 'cart'} 
                size="sm" 
                color="#ffffff"
                className="mr-2"
                withHoverEffect={false}
              />
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
            
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to logout?')) {
                    logout();
                    navigate('/');
                  }
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center"
              >
                <DynamicIcon name="logout" size="sm" color="#ffffff" className="mr-2" withHoverEffect={false} />
                Logout
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Account Information</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Account Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account ID:</span>
                <span className="font-medium">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                <span className="font-medium">March 15, 2023</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/orders')}
                className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
              >
                <DynamicIcon name="box" size="sm" className="mr-2" />
                My Orders
              </button>
              <button 
                onClick={() => navigate('/cart')}
                className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
              >
                <DynamicIcon name="cart" size="sm" className="mr-2" />
                Shopping Cart
              </button>
              {user.role === 'admin' && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
                >
                  <DynamicIcon name="users" size="sm" className="mr-2" />
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile; 