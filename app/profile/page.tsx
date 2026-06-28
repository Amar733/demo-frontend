'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { User, Mail, Shield, Lock, Calendar } from 'lucide-react';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password change state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.updateProfile(name.trim());
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Update local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.name = name.trim();
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Refresh the page to update user context
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await api.updatePassword(currentPassword, newPassword);
      
      if (response.success) {
        setSuccess('Password updated successfully!');
        setShowPasswordDialog(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setPasswordError(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleViewOrders = () => {
    router.push('/orders');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {/* Profile Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-3xl shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm mt-1">Member since {new Date().getFullYear()}</p>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-3" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.name}</p>
                )}
              </div>
            </div>

            {/* Email/Mobile Fields */}
            {user.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-3" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900 py-2">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
            )}
            
            {user.mobile && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-3" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <p className="text-gray-900 py-2">{user.mobile}</p>
                  <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
                </div>
              </div>
            )}

            {/* Role Field */}
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 mt-3" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="py-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Created */}
            {user.createdAt && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-3" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900 py-2">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button 
                onClick={handleSaveProfile} 
                className="flex-1"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  setName(user.name);
                  setError('');
                  setSuccess('');
                }} 
                variant="outline"
                className="flex-1"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}
        </Card>

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order History */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Order History</h3>
            <p className="text-gray-500 text-sm mb-4">View your past orders</p>
            <Button variant="outline" className="w-full" onClick={handleViewOrders}>
              View Orders
            </Button>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Security</h3>
            <p className="text-gray-500 text-sm mb-4">Update your password</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPasswordDialog(true)}
            >
              Change Password
            </Button>
          </Card>
        </div>

        {/* Password Change Dialog */}
        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Change Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {passwordError}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleChangePassword}
                  className="flex-1"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={isChangingPassword}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
