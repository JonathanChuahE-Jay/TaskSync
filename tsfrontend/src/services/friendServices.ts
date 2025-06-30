import type { FriendListResponse } from '@/types/friends.ts'
import type { Pagination } from '@/types/common.ts'
import { kyInstance } from '@/lib/ky.ts'
import { handleKyError } from '@/utils/handleKyErrors.ts'

export const friendApi = {
	listFriends: async ():  Promise<Pagination<FriendListResponse>> => {
		try {
			return await kyInstance
				.get('users/friends/')
				.json<Pagination<FriendListResponse>>()
		} catch (err) {
			return await handleKyError(err)
		}
	}

}
