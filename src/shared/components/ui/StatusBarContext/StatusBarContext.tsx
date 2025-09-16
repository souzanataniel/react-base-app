import React, {createContext, ReactNode, useContext, useState} from 'react';
import {StatusBar, StatusBarStyle} from 'expo-status-bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '@/shared/constants/colors';

interface StatusBarContextType {
  setStatusBar: (color: string, style: StatusBarStyle) => void;
  resetStatusBar: () => void;
}

const StatusBarContext = createContext<StatusBarContextType | null>(null);

const DEFAULT_COLOR: string = COLORS.PRIMARY;
const DEFAULT_STYLE: StatusBarStyle = 'light';

export function StatusBarProvider({children}: { children: ReactNode }) {
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [style, setStyle] = useState<StatusBarStyle>(DEFAULT_STYLE);

  const setStatusBar = (newColor: string, newStyle: StatusBarStyle) => {
    setColor(newColor);
    setStyle(newStyle);
  };

  const resetStatusBar = () => {
    setColor(DEFAULT_COLOR);
    setStyle(DEFAULT_STYLE);
  };

  return (
    <StatusBarContext.Provider value={{setStatusBar, resetStatusBar}}>
      <SafeAreaView
        edges={['top']}
        style={{flex: 1, backgroundColor: color}}>
        <StatusBar style={style} backgroundColor={color}/>
        {children}
      </SafeAreaView>
    </StatusBarContext.Provider>
  );
}

export const useStatusBar = () => {
  const context = useContext(StatusBarContext);
  if (!context) {
    throw new Error('useStatusBar must be used within StatusBarProvider');
  }
  return context;
};
