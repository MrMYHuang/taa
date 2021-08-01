export class Bookmark {
    title: string = '';
    url: string = '';

    constructor(obj: Bookmark) {
        this.title = obj.title;
        this.url = obj.url;
    }
}
