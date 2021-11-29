import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const apiHost = environment.socketHost;

@Injectable({
    providedIn: 'root',
})
export class SocketWebService {
    public socketsMap: Map<string, Socket> = new Map();
    private url: string = `${ apiHost }`;

    constructor(private socket: Socket) {}

    public of(namespace: string, soket: string): Socket {
        const socketInstance = new Socket({ url: `${ this.url }/${ namespace }`, options: { query: { token: `Bearer ${soket}` } } });
        this.socketsMap.set(namespace, socketInstance);
        return socketInstance;
    }

    public getSocket(namespace: string) {
        return this.socketsMap.get(namespace);
    }

    public fromToEvent(socket: Socket, event: string) {
        return socket.fromEvent(event);
    }

    public emitToEvent<T>(socket: Socket, event: string, payload: T) {
        return socket.emit(event, payload);
    }

    public disconnect(namespace: string, all?: boolean): void {
        const socketInstace = this.socketsMap.get(namespace);
        socketInstace.disconnect();
        this.socketsMap.delete(namespace);
    }

    get connection() {
        return this.socket.fromEvent('connect').pipe(shareReplay(1));
    }
}
