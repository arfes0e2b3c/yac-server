import * as mediaItems from './mediaItems'
import * as postTags from './postTags'
import * as posts from './posts'
import * as tags from './tags'
import * as users from './users'

export const schema = {
	...users,
	...posts,
	...tags,
	...mediaItems,
	...postTags,
}
