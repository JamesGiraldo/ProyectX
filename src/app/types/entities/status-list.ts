import { Item } from './status-item';

export class StatusList {
    items: Item[];

    constructor() {
        this.items = [];
    };

    add(itemToAdd: Item): { success: boolean, message: string } {
        if (!this.exists(itemToAdd.id) && !this.exists(itemToAdd.text)) {
            this.items.push(itemToAdd);
            return { success: true, message: 'Item added to the list' };
        } else {
            return { success: false, message: 'Item was already added to the list' };
        }
    }

    exists(x: number): boolean;
    exists(x: string): boolean;
    exists(x): any {
        if (typeof x === 'number') this.items.find(element => element.id == x) == undefined ? false : true;
        if (typeof x === 'string') this.items.find(element => element.text == x) == undefined ? false : true;
    }
}