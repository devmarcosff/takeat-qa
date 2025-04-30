"use client";

import WebsocketManager, { isPaymentConfirmation } from '@/hook/WebsocketManager';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface PaymentContextType {
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  paymentOrderId: string | null;
  setPaymentOrderId: (id: string) => void;
  connectWebhook: (token: string, sessionId: string, zoopId: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const [websocketManager, setWebsocketManager] = useState<WebsocketManager | null>(null);

  const connectWebhook = (token: string, sessionId: string, zoopId: string) => {
    const manager = new WebsocketManager(token);
    setWebsocketManager(manager);

    manager.addMessageCallback('payment_confirmation', (data) => {
      if (isPaymentConfirmation(data) &&
        data.zoop_id === zoopId &&
        data.session_id === sessionId &&
        data.status === 'OK') {
        setPaymentStatus('confirmed');
        setPaymentOrderId(sessionId);
      } else if (isPaymentConfirmation(data) && data.status === 'failed') {
        setPaymentStatus('failed');
      }
    });
  };

  useEffect(() => {
    return () => {
      websocketManager?.close();
    };
  }, [websocketManager]);

  return (
    <PaymentContext.Provider value={{
      paymentStatus,
      paymentOrderId,
      setPaymentOrderId,
      connectWebhook,
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
} 