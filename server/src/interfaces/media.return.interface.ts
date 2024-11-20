export interface IReturnMedia {
    id: string;
    filename: string;
    url: string;
    type: string;
    mimetype: string;
    pages?: number;
}

export interface IReturnPresignedUrl {
    url: string;
}
