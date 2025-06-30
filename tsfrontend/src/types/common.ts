export interface Pagination<TData> {
	count: number;
	prev: number | null;
	next: number | null;
	results: Array<TData>;
}
