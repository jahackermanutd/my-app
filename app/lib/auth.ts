export type UserRole = 'admin' | 'letter_writer' | 'signee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  title?: string;
}

export interface RolePermissions {
  // Letter Management
  canCreateLetter: boolean;
  canEditDraft: boolean;
  canDeleteDraft: boolean;
  canSubmitLetter: boolean;
  canViewAllLetters: boolean;
  canViewOwnLetters: boolean;
  
  // Approval Workflow
  canApproveLetter: boolean;
  canRejectLetter: boolean;
  canSignLetter: boolean;
  
  // Template Management
  canCreateTemplate: boolean;
  canEditTemplate: boolean;
  canDeleteTemplate: boolean;
  
  // User Management
  canManageUsers: boolean;
  canAssignRoles: boolean;
  
  // System Settings
  canConfigureWorkflow: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    // Full privileges - can do everything
    canCreateLetter: true,
    canEditDraft: true,
    canDeleteDraft: true,
    canSubmitLetter: true,
    canViewAllLetters: true,
    canViewOwnLetters: true,
    canApproveLetter: true,
    canRejectLetter: true,
    canSignLetter: true,
    canCreateTemplate: true,
    canEditTemplate: true,
    canDeleteTemplate: true,
    canManageUsers: true,
    canAssignRoles: true,
    canConfigureWorkflow: true,
    canViewReports: true,
    canExportData: true,
  },
  letter_writer: {
    // Can create and manage own letters, submit for approval
    canCreateLetter: true,
    canEditDraft: true,
    canDeleteDraft: true,
    canSubmitLetter: true,
    canViewAllLetters: false,
    canViewOwnLetters: true,
    canApproveLetter: false,
    canRejectLetter: false,
    canSignLetter: false,
    canCreateTemplate: false,
    canEditTemplate: false,
    canDeleteTemplate: false,
    canManageUsers: false,
    canAssignRoles: false,
    canConfigureWorkflow: false,
    canViewReports: false,
    canExportData: false,
  },
  signee: {
    // Can view letters awaiting signature, approve/reject, and sign
    canCreateLetter: false,
    canEditDraft: false,
    canDeleteDraft: false,
    canSubmitLetter: false,
    canViewAllLetters: true,
    canViewOwnLetters: true,
    canApproveLetter: true,
    canRejectLetter: true,
    canSignLetter: true,
    canCreateTemplate: false,
    canEditTemplate: false,
    canDeleteTemplate: false,
    canManageUsers: false,
    canAssignRoles: false,
    canConfigureWorkflow: false,
    canViewReports: true,
    canExportData: false,
  },
};

export const getRolePermissions = (role: UserRole): RolePermissions => {
  return rolePermissions[role];
};

export const hasPermission = (
  user: User,
  permission: keyof RolePermissions
): boolean => {
  const permissions = getRolePermissions(user.role);
  return permissions[permission];
};

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Ahmadov',
    email: 'admin@example.uz',
    role: 'admin',
    department: 'IT Bo\'limi',
    title: 'Tizim Ma\'muri',
  },
  {
    id: '2',
    name: 'Dilshod Karimov',
    email: 'dilshod.k@example.uz',
    role: 'letter_writer',
    department: 'Korporativ Aloqalar',
    title: 'Xat Muharriri',
  },
  {
    id: '3',
    name: 'Nodira Rahimova',
    email: 'nodira.r@example.uz',
    role: 'signee',
    department: 'Boshqaruv',
    title: 'Direktor',
  },
];

// Helper to get current user (in a real app, this would come from auth context)
let currentUser: User = mockUsers[0]; // Default to admin for demo

export const getCurrentUser = (): User => {
  return currentUser;
};

export const setCurrentUser = (user: User): void => {
  currentUser = user;
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    letter_writer: 'Xat Muharriri',
    signee: 'Imzolovchi',
  };
  return roleNames[role];
};
