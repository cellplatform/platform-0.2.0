import { Wrangle } from '../Wrangle.mjs';
const { toYouTube, toVimeo } = Wrangle;

export const SAMPLE = {
  VIMEO: {
    Tubes: toVimeo(499921561),
    Running: toVimeo(287903693), // https://vimeo.com/stock/clip-287903693-silhouette-woman-running-on-beach-waves-splashing-female-athlete-runner-exercising-sprinting-intense-workout-on-rough-ocean-seas
    WhiteBackdrop: toVimeo(612010014), // (White backdrop aesthetic: "Jonny Ive" → "Rowan" sample, recorded with tooling fully "in platform").
  },
  YOUTUBE: {
    AlanKay: toYouTube('N9c7_8Gp7gI'),
    LocalFirst: toYouTube('KrPsyr8Ig6M'),
  },
};
