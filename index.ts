// deno-lint-ignore-file no-inferrable-types
import { axiod, Destination } from './includes/deps.ts';
import { downloadFromURL } from './utils/network.ts';

import { Listing, PostData, RedditListingData } from './includes/types.ts';
import {
  createDirectoryIfNotExist,
  getUserInput,
  writeJson,
} from './utils/io.ts';

async function getPost(
  subreddit: string,
  listing: Listing = Listing.New,
  limit: number = 100,
  after: string | null
): Promise<RedditListingData | undefined> {
  if (after === null) after = '';

  try {
    const url = `https://www.reddit.com/r/${subreddit}/${listing}.json?limit=${limit}&after=${after}`;
    return await axiod.get(url);
  } catch (e) {
    console.log(e.message);
    Deno.exit(1);
  }
}

function extractPostsData(
  rawPosts: RedditListingData
): [string | null, PostData[]] {
  const { data } = rawPosts.data;
  const { after } = data;

  const posts = data.children.map((child) => {
    return child.data;
  });
  return [after, posts];
}

async function extractMediaFromPosts(subreddit: string, postsData: PostData[]) {
  const re = /(?:\.([^.]+))?$/;

  for (const postData of postsData) {
    const destination: Destination = {
      dir: `./media/${subreddit}/images/`,
    };

    if (postData.preview?.reddit_video_preview) {
      destination.dir = `./media/${subreddit}/videos/`;
      destination.file = `${postData.author_fullname}_${postData.title.replace(
        '/',
        '_'
      )}${re.exec(postData.preview.reddit_video_preview.fallback_url)?.at(0)}`;

      await downloadFromURL(
        <string>postData.preview.reddit_video_preview?.fallback_url,
        destination
      );
    } else if (<number>re.exec(postData.url)?.at(0)?.length > 5) {
      if (postData.thumbnail !== 'self' && postData.thumbnail !== 'nsfw') {
        destination.file = `${
          postData.author_fullname
        }_${postData.title.replace('\\', '_')}${re
          .exec(postData.thumbnail)
          ?.at(0)}`.replace('/', '_');

        await downloadFromURL(postData.thumbnail, destination);
      }
    } else {
      destination.file = `${postData.author_fullname}_${postData.title.replace(
        '/',
        '_'
      )}${re.exec(postData.url)?.at(0)}`;

      await downloadFromURL(postData.url, destination);
    }
  }
}

async function main() {
  const subreddit = getUserInput('Enter subreddit name: ');
  const limit = Number(getUserInput('Enter limit: '));
  const listing = getUserInput(
    'Enter listing (new, top, hot, rising):'
  ) as Listing;

  createDirectoryIfNotExist(subreddit);

  let choice = '';
  let postAfter: string | null = '';

  do {
    const response = await getPost(subreddit, listing, limit, postAfter);
    const [after, posts] = extractPostsData(<RedditListingData>response);
    postAfter = after;

    // writeJson(posts); If you want to analyse the data you get from the API

    await extractMediaFromPosts(subreddit, posts);
    choice = getUserInput('Continue? (y/n): ');
  } while (choice.toLocaleLowerCase() !== 'n');
}
await main();
