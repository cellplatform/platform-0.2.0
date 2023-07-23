import { type t } from '../common';

const SAMPLE = {
  groupScaleDiagram:
    'https://user-images.githubusercontent.com/185555/208217954-0427e91d-fcb3-4e9a-b5f1-1f86ed3500bf.png',
};

/**
 * https://github.com/team-db/tdb.working/issues/22
 */

const left: t.Pos = ['left', 'bottom'];
const center: t.Pos = ['center', 'bottom'];
const right: t.Pos = ['right', 'bottom'];
const position = center;
const scale = 1.1;
const height = 280;

const slugs: t.ConceptSlug[] = [
  {
    id: 'ember.pitch.intro',
    title: 'Introduction',
    video: { id: 847196819, position, scale, height },
    image: {
      src: '/images/ember/pitching.png',
      sizing: 'cover',
    },
  },
  {
    id: 'ember.pitch.structure',
    title: 'Simple Structure',
    video: { id: 846848747, position, scale, height },
    image: {
      src: '/images/ember/structure.png',
      sizing: 'cover',
    },
  },
  {
    id: 'ember.pitch.example',
    title: 'An Example',
    video: { id: 846848687, position, scale, height },
    image: {
      src: '/images/ember/example.png',
      sizing: 'cover',
    },
  },
  {
    id: 'ember.pitch.succes',
    title: 'Making it Memorable',
    video: { id: 847199651, position, scale, height },
    image: {
      src: '/images/ember/success.png',
      sizing: 'cover',
    },
  },
  {
    id: 'ember.pitch.conclusion',
    title: 'Tie it all Together',
    video: { id: 847193255, position, scale, height },
    image: {
      src: '/images/ember/pitching.png',
      sizing: 'cover',
    },
  },
];

export const DATA = {
  slugs,
} as const;
