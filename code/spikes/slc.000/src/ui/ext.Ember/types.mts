type Id = string;
type Url = string;
type VideoId = number;

export type VideoConceptSlug = {
  id: Id;
  title?: string;
  video: { id: VideoId };
  image?: { src: Url };
};

export type VideoConceptClickHandler = (e: VideoConceptClickHandlerArgs) => void;
export type VideoConceptClickHandlerArgs = {
  index: number;
};
