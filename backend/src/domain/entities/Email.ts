export class Email {
    constructor(
        public to: string | string[],
        public subject: string,
        public body: string,
        public from?: string,
    ) {}
}