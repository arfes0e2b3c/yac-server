import { mediaItemRepo as mediaItem } from './mediaItem'
import { postRepo as post } from './post'
import { postTagRepo as postTag } from './postTag'
import { tagRepo as tag } from './tag'
import { userRepo as user } from './user'

export const repo = {
	user,
	post,
	tag,
	mediaItem,
	postTag,
}
