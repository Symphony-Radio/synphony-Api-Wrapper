export type HexColor = `#${string}`;

export interface StatsResponse {
  meta?: {
    source?: string;
    generatedAt?: number;
  };
  nowPlaying?: {
    track?: {
      artist?: string;
      title?: string;
      album?: string;
      spotify?: {
        id?: string;
        url?: string;
        preview?: string | null;
      };
      artwork?: {
        url?: string;
        palette?: {
          vibrant?: HexColor;
          lightVibrant?: HexColor;
          muted?: HexColor;
          dark?: HexColor;
          background?: HexColor;
        };
      };
    };
    timing?: {
      startedAt?: number;
      finishAt?: number;
      durationMs?: number;
      progressPercent?: number;
    };
  };
  onAir?: {
    presenter?: {
      is_following?: number;
      isLiked?: boolean;
      id?: number;
      name?: string;
      avatar?: string;
      is_live?: boolean;
    };
  };
  engagement?: unknown[];
  loggedIn?: boolean;
  song?: {
    artist?: string;
    track?: string;
    avatar?: string;
    rating?: {
      like?: number;
      favourite?: number;
      dislike?: number;
      is_like?: number;
      is_favourite?: number;
      is_dislike?: number;
    };
  };
  listeners?: {
    total?: number;
    unique?: number;
    current?: number;
  };
}

export interface UpcomingResponse {
  now: {
    hourNumber: number;
    presenter: {
      name?: string;
      isShow?: boolean | null;
      avatar?: string;
      id?: number;
      discord?: { id?: string | null };
    };
    slot?: { description?: string | null };
  };
  next: {
    hourNumber: number;
    presenter: {
      name?: string;
      isShow?: boolean | null;
      avatar?: string;
      id?: number;
      discord?: { id?: string | null };
    };
    slot?: { description?: string | null };
    timeUntil?: string;
  };
  later?: {
    hourNumber: number;
    presenter: {
      name?: string;
      isShow?: boolean | null;
      avatar?: string;
      id?: number;
      discord?: { id?: string | null };
    };
    slot?: { description?: string | null };
  };
}

export interface RecentlyPlayedItem {
  id?: number;
  artist?: string;
  track?: string;
  album?: string;
  avatar?: string;
  playedBy?: string;
  playedAt?: number;
  durationMs?: number;
  spotify?: {
    id?: string;
    url?: string;
    preview?: string | null;
  };
  colors?: {
    vibrant?: HexColor;
    lightVibrant?: HexColor;
    muted?: HexColor;
    dark?: HexColor;
    background?: HexColor;
  };
}

export interface RecentlyPlayedResponse {
  recentlyPlayed?: RecentlyPlayedItem[];
}

export interface RequestOptions {
  /** Timeout per request (ms). */
  timeoutMs?: number;
  /** Extra headers to send. */
  headers?: Record<string, string>;
  /** Abort the request via an external signal. */
  signal?: AbortSignal;
}
