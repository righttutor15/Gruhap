import React from 'react';

export interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export interface ChatHistory {
  id: string;
  name: string;
  messages: Message[];
}

export interface UserInfo {
  name: string;
  avatar: string;
  plan: string;
}

export const mainNavItems = [
  { id: 'new-chat', icon: '➕', label: 'New Chat' },
  { id: 'search', icon: '🔍', label: 'Search' },
  { id: 'category', icon: '🏷️', label: 'Categories' },
];

export const sidebarCategories = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Computer Science', 'History', 'Geography'
];

export const categories = ["JEE", "NEET", "K12 Subjects", "Other"];

export const scrollingActions = [
  { text: "Solve Physics PYQs", iconType: 'physics' },
  { text: "Chemistry Formulas", iconType: 'chemistry' },
  { text: "Math Concept Drill", iconType: 'mathematics' },
  { text: "Biology Mock Test", iconType: 'biology' },
  { text: "Mock Tests", iconType: 'mockTests' },
  { text: "Quick Revision", iconType: 'revision' },
  { text: "Browse PYQs", iconType: 'pyqs' },
  { text: "Math Formulas", iconType: 'formulas' },
];

export const renderIcon = (iconType: string) => {
  const icons: Record<string, string> = {
    physics: '⚡', chemistry: '🧪', mathematics: '📐', biology: '🧬',
    mockTests: '📝', revision: '⏳', pyqs: '📚', formulas: '➗'
  };
  return icons[iconType] || '🎯';
};
