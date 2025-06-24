import type { FriendListResponse } from '@/types/friends.ts'
import { kyInstance } from '@/lib/ky.ts'
import { handleKyError } from '@/utils/handleKyErrors.ts'

export const friendApi = {
	listFriends: async ():  Promise<Array<FriendListResponse>> => {
		try {
			return await kyInstance
				.get('users/friends/')
				.json<Array<FriendListResponse>>()
		} catch (err) {
			return await handleKyError(err)
		}
	}

}
