import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (onEvent) => {
    const socketRef = useRef(null);

    useEffect(() => {
        // En desarrollo, el proxy de Vite redirige /socket.io a localhost:3001
        socketRef.current = io('/', {
            transports: ['websocket'],
            autoConnect: true
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socketRef.current.on('appointment-created', (data) => {
            if (onEvent) onEvent('created', data);
        });

        socketRef.current.on('appointment-updated', (data) => {
            if (onEvent) onEvent('updated', data);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return socketRef.current;
};
