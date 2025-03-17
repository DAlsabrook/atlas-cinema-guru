// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Topic = {
  id: string;
  title: string;
};

export type Question = {
  id: string;
  title: string;
  topic_id: string;
  votes: number;
};

export type Title = {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  image?: string;
  favorited?: Boolean;
  watchLater?: Boolean;
};

export type UsersTitle = Title & {
  image: string;
  favorited: boolean;
  watchLater: boolean;
};

export type Activity = {
  id: string;
  timestamp: string;
  activity: "FAVORITED" | "WATCH_LATER";
  title: string;
}
