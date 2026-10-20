import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  fullPage?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  dark = false,
  fullPage = false,
  text,
}) => {
  const sizeMap = { sm: 16, md: 24, lg: 40 };
  const px = sizeMap[size];

  const spinner = (
    <div
      style={{
        width: px,
        height: px,
        border: `${size === 'sm' ? 2 : 3}px solid ${dark ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.3)'}`,
        borderTopColor: dark ? '#f43f5e' : '#fff',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 gap-4">
        <div className="w-12 h-12 brand-gradient rounded-2xl flex items-center justify-center animate-float shadow-xl">
          <span className="text-white font-black text-2xl">R</span>
        </div>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(244,63,94,0.2)', borderTopColor: '#f43f5e', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex items-center gap-3">
        {spinner}
        <span className={`text-sm font-medium ${dark ? 'text-slate-600' : 'text-white'}`}>{text}</span>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
