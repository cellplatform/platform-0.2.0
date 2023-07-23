import { type t } from '../common';

/**
 * https://github.com/team-db/tdb.working/issues/22
 */

const left: t.Pos = ['left', 'bottom'];
const center: t.Pos = ['center', 'bottom'];
const right: t.Pos = ['right', 'bottom'];
const scale = 1.1;

const slugs: t.ConceptSlug[] = [
  {
    id: 'ember.pitch.intro',
    title: 'Introduction',
    video: { id: 847196819, position: center, scale },
    image: {
      src: 'https://private-user-images.githubusercontent.com/185555/255375447-0ab3e5cb-6faf-4fef-b866-1b54ddd081cf.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE2OTAwOTMwMTQsIm5iZiI6MTY5MDA5MjcxNCwicGF0aCI6Ii8xODU1NTUvMjU1Mzc1NDQ3LTBhYjNlNWNiLTZmYWYtNGZlZi1iODY2LTFiNTRkZGQwODFjZi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBSVdOSllBWDRDU1ZFSDUzQSUyRjIwMjMwNzIzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDIzMDcyM1QwNjExNTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03OTU5YzA0Y2Q4YzIxM2I5MGM3OTIzZjhmNzlhMzdhYTIyOTVmZWMyNzYzMTg0MDcwNjlmNDgyZjMzNjNlM2Y0JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.u_lT2xDn8i1TLrpKVImNA8c7W7a2zkeoDFl3eI28xPE',
    },
  },
  {
    id: 'ember.pitch.structure',
    title: 'Simple Structure',
    video: { id: 846848747, position: center, scale },
  },
  {
    id: 'ember.pitch.example',
    title: 'An Example',
    video: { id: 846848687, position: center, scale },
  },
  {
    id: 'ember.pitch.succes',
    title: 'Making it Memorable',
    video: { id: 847199651, position: center, scale },
  },
  {
    id: 'ember.pitch.conclusion',
    title: 'Tie it all Together',
    video: { id: 847193255, position: center, scale },
  },
];

export const DATA = {
  slugs,
} as const;
