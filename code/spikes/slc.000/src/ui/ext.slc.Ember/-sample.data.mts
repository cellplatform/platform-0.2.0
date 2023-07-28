import { type t } from '../common';

const left: t.EdgePos = ['left', 'bottom'];
const center: t.EdgePos = ['center', 'bottom'];
const right: t.EdgePos = ['right', 'bottom'];

const position = center;

const scale = 1.1;
const height = 280;

/**
 * Content Slugs.
 */
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
    download: {
      kind: 'pdf',
      url: '/images/ember/structure.pdf',
      filename: 'slc.pdf',
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
    video: { id: 847199651, position, scale, height: 140 },
    image: {
      src: '/images/ember/succes.png',
      sizing: 'contain',
    },
  },
  {
    id: 'ember.pitch.conclusion',
    title: 'Tie it all Together',
    video: { id: 847193255, position, scale, height },
    image: {
      src: '/images/ember/thats-it.png',
      sizing: 'cover',
    },
  },
];

export const DATA = {
  slugs,
} as const;
