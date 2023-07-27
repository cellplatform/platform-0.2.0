import { ConceptPlayer } from '../Concept.Player';
import { ConceptSlug } from '../Concept.Slug';

export { ConceptPlayer, ConceptSlug };

export const Concept = {
  Player: ConceptPlayer,
  Slug: ConceptSlug,
} as const;
