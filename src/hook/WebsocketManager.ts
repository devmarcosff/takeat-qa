import io, { Socket } from 'socket.io-client';

interface WebSocketMessage {
    event: string;
    data: unknown;
}

interface PaymentConfirmation {
    type: 'pix-payment';
    zoop_id: string;
    session_id: string;
    status: string;
    orderId: string;
    [key: string]: unknown;
}

export function isPaymentConfirmation(data: WebSocketMessage | PaymentConfirmation): data is PaymentConfirmation {
    return 'type' in data && data.type === 'pix-payment';
}

interface MessageCallback {
    (data: WebSocketMessage | PaymentConfirmation): void;
}

export default class WebsocketManager {
    private token: string;
    private messageCallbacks: Map<string, MessageCallback>;
    private wss_url: string;
    private socket: Socket | null;

    constructor(token: string) {
        this.token = token;
        this.messageCallbacks = new Map();
        const wss_url = (process.env.NEXT_PUBLIC_API_PIX_SOCKET || '').replace('http', 'ws');
        this.wss_url = `${wss_url}/buyers`;
        this.socket = null;
        this.socketConnect();
    }

    socketConnect() {
        if (this.token) {
            this.socket = io(this.wss_url, {
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
                query: {
                    token: this.token,
                },
            });

            this.socket.on('event', (message: string) => {
                this.onMessage(JSON.parse(message));
            });

            // Add payment confirmation listener
            this.socket.on('payment_confirmation', (data: PaymentConfirmation) => {
                this.onMessage(data);
            });
        } else {
            console.warn('Could not init websocket manager.');
        }
    }

    onMessage(data: WebSocketMessage | PaymentConfirmation) {
        for (const cb of this.messageCallbacks.values()) {
            cb(data);
        }
    }

    addMessageCallback(id: string, callback: MessageCallback) {
        this.messageCallbacks.set(id, callback);
    }

    checkConnection() {
        // check if websocket instance is closed, if so call `connect` function.
        if (!this.socket && this.token !== '') {
            this.socketConnect();
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.token = '';
            this.socket = null;
        }
    }
}