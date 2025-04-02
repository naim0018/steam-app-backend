export interface Game {
  appid: number;
  name: string;
}

export interface GameDetails {
  steam_appid: number;
  name: string;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  website: string;
  developers: string[];
  publishers: string[];
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  categories: {
    id: number;
    description: string;
  }[];
  genres: {
    id: number;
    description: string;
  }[];
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  background: string;
  background_raw: string;
  screenshots: {
    id: number;
    path_thumbnail: string;
    path_full: string;
  }[];
  movies?: {
    id: number;
    name: string;
    thumbnail: string;
    webm: {
      [key: string]: string;
    };
    mp4: {
      [key: string]: string;
    };
    highlight?: boolean;
  }[];
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  };
  metacritic?: {
    score: number;
    url: string;
  };
} 