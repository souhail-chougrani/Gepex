export class GPXNotification {
    title: string;
    body: string;
    constructor(data: GPXNotification) {
        this.title = data.title;
        this.body = data.body;
    }
}
