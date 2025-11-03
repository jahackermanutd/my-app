// Professional Color Scheme following 60-30-10 rule
// Primary (60%): Main background and content areas
// Secondary (30%): Supporting elements and cards  
// Accent (10%): CTAs, highlights, and important elements

export const colors = {
  // Primary Color Palette - Deep Blue (Professional & Trustworthy)
  primary: {
    50: '#EFF6FF',   // Very light blue
    100: '#DBEAFE',  // Light blue
    200: '#BFDBFE',  
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',  // Main primary
    600: '#2563EB',  // Darker primary
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Secondary Color Palette - Slate Gray (60% - Background)
  neutral: {
    50: '#F8FAFC',   // Background
    100: '#F1F5F9',  // Card background
    200: '#E2E8F0',  // Border
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',  // Text secondary
    600: '#475569',
    700: '#334155',
    800: '#1E293B',  // Text primary
    900: '#0F172A',
  },
  
  // Accent Colors (10%)
  accent: {
    success: '#10B981',    // Green
    warning: '#F59E0B',    // Amber
    danger: '#EF4444',     // Red
    info: '#3B82F6',       // Blue
    purple: '#8B5CF6',     // Purple for special features
  },
  
  // Status Colors
  status: {
    draft: '#94A3B8',      // Gray
    pending: '#F59E0B',    // Amber
    approved: '#10B981',   // Green
    signed: '#3B82F6',     // Blue
    rejected: '#EF4444',   // Red
  },
};

// Semantic color mapping
export const semanticColors = {
  background: {
    primary: colors.neutral[50],
    secondary: colors.neutral[100],
    tertiary: '#FFFFFF',
  },
  text: {
    primary: colors.neutral[800],
    secondary: colors.neutral[500],
    inverse: '#FFFFFF',
  },
  border: {
    light: colors.neutral[200],
    medium: colors.neutral[300],
    dark: colors.neutral[400],
  },
};
