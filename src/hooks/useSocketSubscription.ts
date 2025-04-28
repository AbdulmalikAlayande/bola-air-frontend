/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { SocketMessage } from "@src/lib/socketManager";
import SocketManager from "@src/lib/socketManager";


export function useSocketSubscription<T = any>(topic: string) {
    const [message, setMessage] = useState<SocketMessage<T> | null>(null);

    useEffect(() => {
        const callback = (msg: SocketMessage<T>) => {
            setMessage(msg);
        };
        
        const socketManager: SocketManager = new SocketManager();
        socketManager.subscribe<T>(topic, callback);

        return () => {
            socketManager.unsubscribe(topic);
        };
    }, [topic]);

    return message;
}
