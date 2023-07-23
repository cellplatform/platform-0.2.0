import { type t } from '../common';

const position: t.Pos = ['left', 'bottom'];
const scale = 1.1;

const slugs: t.VideoConceptSlug[] = [
  {
    id: 'ember.pitch.intro',
    title: 'Introduction',
    video: { id: 847196819, position, scale },
  },
  {
    id: 'ember.pitch.structure',
    title: 'Simple Structure',
    video: { id: 846848747, position: ['right', 'bottom'], scale },
  },
  {
    id: 'ember.pitch.example',
    title: 'An Example',
    video: { id: 846848687, position, scale },
  },
  {
    id: 'ember.pitch.succes',
    title: 'Making it Memorable',
    video: { id: 847199651, position, scale },
  },
  {
    id: 'ember.pitch.conclusion',
    title: 'Tie it all Together',
    video: { id: 847193255, position, scale },
  },
];

export const DATA = {
  slugs,
};
