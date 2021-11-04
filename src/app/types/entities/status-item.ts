export class Item {
    id: number;
    text: string;
    isActive: boolean;

    constructor(id: number, text: string, isActive: boolean = false) {
        this.id = id;
        this.text = text;
        this.isActive = isActive;
    }
}