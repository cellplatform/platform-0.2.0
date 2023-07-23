import { type t } from '../common';

const left: t.Pos = ['left', 'bottom'];
const right: t.Pos = ['right', 'bottom'];
const scale = 1.1;

const slugs: t.VideoConceptSlug[] = [
  {
    id: 'ember.pitch.intro',
    title: 'Introduction',
    video: { id: 847196819, position: left, scale },
  },
  {
    id: 'ember.pitch.structure',
    title: 'Simple Structure',
    video: { id: 846848747, position: right, scale },
  },
  {
    id: 'ember.pitch.example',
    title: 'An Example',
    video: { id: 846848687, position: left, scale },
  },
  {
    id: 'ember.pitch.succes',
    title: 'Making it Memorable',
    video: { id: 847199651, position: right, scale },
  },
  {
    id: 'ember.pitch.conclusion',
    title: 'Tie it all Together',
    video: { id: 847193255, position: left, scale },
  },
];

export const DATA = {
  slugs,
} as const;
