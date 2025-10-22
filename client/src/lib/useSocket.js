import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const url = import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:5000';
    const socket = io(url, { transports: ['websocket'] });
    socketRef.current = socket;
    return () => socket.disconnect();
  }, []);

  return socketRef;
}
