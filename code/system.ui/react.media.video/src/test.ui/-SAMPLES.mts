import { Video } from '../index.mjs';

export const SAMPLE = {
  VIMEO: {
    Tubes: Video.toSrc(499921561),
    Running: Video.toSrc(287903693), // https://vimeo.com/stock/clip-287903693-silhouette-woman-running-on-beach-waves-splashing-female-athlete-runner-exercising-sprinting-intense-workout-on-rough-ocean-seas

    // (White backdrop aesthetic: "Jonny Ive" → "Rowan" sample, recorded with tooling fully "in platform").
    WhiteBackdrop1: Video.toSrc(612010014),
    WhiteBackdrop2: Video.toSrc(727951677),
  },
  YOUTUBE: {
    AlanKay: Video.toSrc('N9c7_8Gp7gI'),
    LocalFirst: Video.toSrc('KrPsyr8Ig6M'),
  },
} as const;
