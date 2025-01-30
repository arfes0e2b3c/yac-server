import { mediaItemRepo as mediaItem } from './mediaItem'
import { notificationRepo as notification } from './notification'
import { postRepo as post } from './post'
import { postLikeRepo as postLike } from './postLike'
import { postTagRepo as postTag } from './postTag'
import { tagRepo as tag } from './tag'
import { userRepo as user } from './user'
import { userSettingRepo as userSetting } from './userSetting'

export const repo = {
	user,
	post,
	tag,
	mediaItem,
	postTag,
	postLike,
	notification,
	userSetting,
}
