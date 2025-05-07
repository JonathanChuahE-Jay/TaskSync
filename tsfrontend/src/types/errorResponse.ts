export interface ErrorResponse {
    code?: Array<string>
    non_field_errors?: Array<string>
    [key: string]: any
}

export interface ErrorApiResponse {
	general?: string;
	[key: string]: string | undefined;
}
