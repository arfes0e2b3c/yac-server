import { groupSvc as group } from './group'
import { mediaItemSvc as mediaItem } from './mediaItem'
import { postSvc as post } from './post'
import { userSvc as user } from './user'

export const svc = {
	user,
	post,
	group,
	mediaItem,
}
