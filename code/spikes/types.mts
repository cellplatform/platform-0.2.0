/**
 * (Spike)
 * Ideas for 2D cartesian position types
 */

export type PosEdge = 'near' | 'center' | 'far';
export type PosEdgeXY = [PosEdge, PosEdge];

export type PosX = 'left' | 'center' | 'right';
export type PosY = 'top' | 'bottom';
export type PositonXY = [PosX, PosY];

/**
 * ConceptSlug
 */
type ImageData = { binary: Uint8Array; mimetype: string };

export type VideoConceptSlug = {
  video: { kind: 'vimeo'; id: string };
  image: { data: ImageData };
};

const programme: VideoConceptSlug[] = []; // ← approx 3..5
