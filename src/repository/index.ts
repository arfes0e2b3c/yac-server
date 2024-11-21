import { groupRepo as group } from './group'
import { mediaItemRepo as mediaItem } from './mediaItem'
import { postRepo as post } from './post'
import { userRepo as user } from './user'

export const repo = {
	user,
	post,
	group,
	mediaItem,
}
