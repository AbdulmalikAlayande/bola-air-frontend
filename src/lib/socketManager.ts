/* eslint-disable @typescript-eslint/no-explicit-any */
import Logger  from "@src/utils/logger";
import { Client, StompConfig, IMessage, StompSubscription, IFrame } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {SOCKET_ENDPOINT, RECONNECT_DELAY} from "@src/utils/constants"

export type SocketMessage<T = any> = {
    type: string;
    content: T;
    senderId?: string;
    receiverId?: string;
    timestamp?: number;
};
  
export interface ISocketSubscription {
    topic: string;
    callback: (message: any) => void;
}

export default class SocketManager {
	private client: Client;
	private subscriptions: Map<string, StompSubscription> = new Map();
    connected: boolean = false;

	constructor() {

		const stompConfig: StompConfig = {
			connectHeaders: {
				login: "guest",
				passcode: "guest",
			},
			reconnectDelay: RECONNECT_DELAY,
			webSocketFactory: () => new SockJS(SOCKET_ENDPOINT),
            onConnect: () => {
                this.connected = true;
                Logger.info("[SocketManager] Connected")
            },
            onStompError: (frame: IFrame) => {
                Logger.error(`[SocketManager] STOMP Error: ${JSON.stringify(frame)}`)
            },
            onDisconnect: () => {
                this.connected = false;
                Logger.warning("[SocketManager] Disconnected")
            },
			debug: (str) => {
				Logger.debug(`STOMP: ${str}`);
			},
		};

		this.client = new Client(stompConfig);
		this.client.activate();
	}

	public subscribe<T>(topic: string, callback: (message: SocketMessage<T>) => void) {
		
        if(this.subscriptions.has(topic)){
            Logger.warning(`[SocketManager] Already subscribed to topic: ${topic}`);
            return;
        }

        const subscription = this.client.subscribe(`/topic/${topic}`, (message: IMessage) => {
			try{
                const parsedMessage = JSON.parse(message.body);
                callback(parsedMessage);
            }catch (error) {
                Logger.error(`[SocketManager] Failed to parse message: ${error}`)
            }
		});

		this.subscriptions.set(topic, subscription);
		return subscription;
	}

	public unsubscribe(topic: string): void {
        
        const subscription = this.subscriptions.get(topic)
		
        if(subscription){
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
            Logger.info(`[SocketManager] Unsubscribed from ${topic}`)
        }
	}

    public send<T = any>(destination: string, body: T){
        
        if(!this.connected){
            Logger.warning(`[SocketManager] Cannot Send Message`)
            return;
        }

        this.client.publish({
            destination, 
            headers: {'content-type': 'application/json'}, 
            body: JSON.stringify(body)
        });
    }

	// Method to disconnect the WebSocket connection
	public disconnect(): void {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
        this.subscriptions.clear();

        if (this.connected) {
            this.client.deactivate();
            this.connected = false;
            Logger.info("[SocketManager] Disconnected from socket");
        }
	}
}


/**
 * @description future implementations
 * Add a global socket context to share state between components.
 * Create a SocketEventBus for publish/subscribe decoupling.
 * Set up a Queue for message buffering (if offline).
 * Add a retry mechanism when connection drops mid-flight.
*/