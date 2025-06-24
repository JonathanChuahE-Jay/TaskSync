import { useQuery } from '@tanstack/react-query'
import { friendApi } from '@/services/friendServices.ts'

export function useListFriendsQuery() {
	return useQuery({
		queryKey: ['friends'],
		queryFn: friendApi.listFriends,
	})
}
