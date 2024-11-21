import * as tags from './groups'
import * as mediaItems from './mediaItems'
import * as postTags from './postGroups'
import * as posts from './posts'
import * as users from './users'

export const schema = {
	...users,
	...posts,
	...tags,
	...mediaItems,
	...postTags,
}
