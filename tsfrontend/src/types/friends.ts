export interface FriendListResponse {
	id: string;
	friend: {
		id: string;
		username: string;
		first_name: string;
		last_name: string;
		profile_picture: string | null;
	};
	created_at: string;
}