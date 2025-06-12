'use client';

import { ReactNode, createElement } from 'react';

interface DarkModeWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * مكون لضمان دعم الوضع المظلم والخطوط العربية
 */
export default function DarkModeWrapper({ children, className = '' }: DarkModeWrapperProps) {
  return (
    <div className={`bg-background text-text arabic-text min-h-screen ${className}`}>
      {children}
    </div>
  );
}

/**
 * مكونات مساعدة للعناصر الشائعة
 */

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export function Header({ children, className = '' }: HeaderProps) {
  return (
    <div className={`bg-surface shadow-sm border-b border-border ${className}`}>
      {children}
    </div>
  );
}

interface TitleProps {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Title({ children, className = '', level = 1 }: TitleProps) {
  const baseClasses = 'text-text arabic-text font-bold';
  const sizeClasses = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-base',
    6: 'text-sm'
  };

  const tagName = `h${level}`;

  return createElement(
    tagName,
    { className: `${baseClasses} ${sizeClasses[level]} ${className}` },
    children
  );
}

interface TextProps {
  children: ReactNode;
  className?: string;
  secondary?: boolean;
}

export function Text({ children, className = '', secondary = false }: TextProps) {
  const textColor = secondary ? 'text-textSecondary' : 'text-text';
  return (
    <p className={`${textColor} arabic-text ${className}`}>
      {children}
    </p>
  );
}

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 arabic-text';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:opacity-90 hover:shadow-md',
    secondary: 'bg-surface text-text border border-border hover:bg-background',
    outline: 'bg-transparent text-text border border-border hover:bg-surface'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

export function Input({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  type = 'text'
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`bg-background border border-border text-text rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent arabic-text ${className}`}
    />
  );
}

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function Select({ value, onChange, options, className = '' }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`bg-background border border-border text-text rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent arabic-text ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className = '' }: CodeBlockProps) {
  return (
    <pre className={`bg-surface border border-border text-text p-3 rounded-lg overflow-auto text-sm ${className}`}>
      {children}
    </pre>
  );
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export function Badge({ children, className = '', variant = 'default' }: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    default: 'bg-surface text-text border-border'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border arabic-text ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

interface AlertProps {
  children: ReactNode;
  className?: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

export function Alert({ children, className = '', variant = 'info' }: AlertProps) {
  const variantClasses = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  };

  return (
    <div className={`p-4 rounded-lg border arabic-text ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
