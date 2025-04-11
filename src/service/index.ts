import { analysisSvc as analysis } from './analysis'
import { apiService as api } from './api'
import { mediaItemSvc as mediaItem } from './mediaItem'
import { notificationSvc as notification } from './notification'
import { postSvc as post } from './post'
import { postLikeSvc as postLike } from './postLike'
import { postTagSvc as postTag } from './postTag'
import { tagSvc as tag } from './tag'
import { userSvc as user } from './user'
import { userSettingSvc as userSetting } from './userSetting'

export const svc = {
	user,
	post,
	tag,
	mediaItem,
	postTag,
	api,
	postLike,
	notification,
	userSetting,
	analysis,
}
