import { apiService as api } from './api'
import { mediaItemSvc as mediaItem } from './mediaItem'
import { postSvc as post } from './post'
import { postTagSvc as postTag } from './postTag'
import { tagSvc as tag } from './tag'
import { userSvc as user } from './user'

export const svc = {
	user,
	post,
	tag,
	mediaItem,
	postTag,
	api,
}
