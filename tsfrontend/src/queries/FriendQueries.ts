import { queryOptions} from '@tanstack/react-query'
import { friendApi } from '@/services/friendServices.ts'

export function useListFriendsQuery() {
	return queryOptions({
		queryKey: ['friends'],
		queryFn: friendApi.listFriends,
	})
}
