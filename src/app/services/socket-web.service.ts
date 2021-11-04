import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketWebService extends Socket {
    public socketsMap: Map<string, Socket> = new Map();
    public uri = environment.apiHost + environment.apiVersion;

    constructor(private socket: Socket) {
        super({ url: '' });
    }

    public of(namespace: string): Socket {
        const socketInstance = new Socket({ url: `${this.uri}/${namespace}` });
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
