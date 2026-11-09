import { Toaster, toast } from 'react-hot-toast';

export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1e293b',
          borderRadius: '16px',
          padding: '12px 18px',
          fontSize: '14px',
          fontWeight: 500,
          boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #ede9fe',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}

export { toast };

