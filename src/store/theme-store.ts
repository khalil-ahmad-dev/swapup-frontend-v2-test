import { applyThemeClass } from '@/lib/utils';
import { create } from 'zustand';

interface IThemeState {
  theme: 'dark' | 'light' | 'system';
  toggleTheme: () => void;
}

const initialState: IThemeState = {
  theme: (localStorage.getItem('swapup-ui-theme') as ('dark' | 'light' | 'system')) || 'dark',
  toggleTheme: () => { },
};

export const useThemeStore = create<IThemeState>(set => ({
  ...initialState,
  toggleTheme: () =>
    set(state => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('swapup-ui-theme', newTheme);
      applyThemeClass(newTheme);
      return { ...state, theme: newTheme };
    }),
}));