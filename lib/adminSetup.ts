/**
 * Admin Setup Utility
 * 
 * This utility helps create an admin user for testing purposes.
 * In production, this should be done through a secure backend process.
 */

export interface StoredUser {
  id: string;
  name: string;
  mobile: string;
  password: string;
  role: 'admin' | 'user';
}

/**
 * Creates a default admin user if none exists
 * Call this function in the browser console or from a component
 */
export function createAdminUser(mobile: string = '9999999999', password: string = 'admin123', name: string = 'Admin User') {
  if (typeof window === 'undefined') {
    console.error('This function can only be run in the browser');
    return;
  }

  const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if admin already exists with this mobile
  const existingAdmin = users.find(u => u.mobile === mobile);
  
  if (existingAdmin) {
    console.warn('User with this mobile already exists:', existingAdmin);
    return existingAdmin;
  }

  // Create admin user
  const adminUser: StoredUser = {
    id: Date.now().toString(),
    name,
    mobile,
    password,
    role: 'admin',
  };

  users.push(adminUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  console.log('Admin user created successfully:', {
    mobile: adminUser.mobile,
    password: password,
    role: adminUser.role,
    name: adminUser.name,
  });

  return adminUser;
}

/**
 * Lists all users in the system
 */
export function listUsers() {
  if (typeof window === 'undefined') {
    console.error('This function can only be run in the browser');
    return;
  }

  const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
  console.table(users.map(u => ({
    id: u.id,
    name: u.name,
    mobile: u.mobile,
    role: u.role,
  })));
  return users;
}

/**
 * Updates a user's role
 */
export function updateUserRole(mobile: string, newRole: 'admin' | 'user') {
  if (typeof window === 'undefined') {
    console.error('This function can only be run in the browser');
    return;
  }

  const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.mobile === mobile);
  
  if (userIndex === -1) {
    console.error('User not found with mobile:', mobile);
    return;
  }

  users[userIndex].role = newRole;
  localStorage.setItem('users', JSON.stringify(users));
  
  console.log('User role updated:', {
    mobile: users[userIndex].mobile,
    name: users[userIndex].name,
    newRole: newRole,
  });

  return users[userIndex];
}

/**
 * Deletes a user by mobile number
 */
export function deleteUser(mobile: string) {
  if (typeof window === 'undefined') {
    console.error('This function can only be run in the browser');
    return;
  }

  const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
  const filteredUsers = users.filter(u => u.mobile !== mobile);
  
  if (users.length === filteredUsers.length) {
    console.error('User not found with mobile:', mobile);
    return false;
  }

  localStorage.setItem('users', JSON.stringify(filteredUsers));
  console.log('User deleted successfully:', mobile);
  return true;
}

// Make functions available in browser console for easy testing
if (typeof window !== 'undefined') {
  (window as any).adminSetup = {
    createAdminUser,
    listUsers,
    updateUserRole,
    deleteUser,
  };
}
