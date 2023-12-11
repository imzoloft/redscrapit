export enum Listing {
  New = 'new',
  Hot = 'hot',
  Top = 'top',
  Rising = 'rising',
}

export interface RedditListingData {
  data: {
    kind: string;
    data: {
      after: string | null;
      children: RedditObject[];
      before: string | null;
    };
  };
}

export interface RedditObject {
  kind: string;
  data: PostData;
}

export interface PostData {
  title: string;
  author_fullname: string;

  thumbnail: string;
  url: string;
  subreddit: string;

  preview: {
    reddit_video_preview?: {
      fallback_url: string;
    };
  };
  media: {
    reddit_video?: {
      fallback_url: string;
    };
  } | null;
  is_video: boolean;
}
