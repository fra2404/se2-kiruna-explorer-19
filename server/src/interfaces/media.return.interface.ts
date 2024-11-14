export interface IReturnMedia {
    filename: string;
    url: string;
    type: string;
    mimetype: string;
    pages?: number;
}

export interface IReturnPresignedUrl {
    url: string;
}
