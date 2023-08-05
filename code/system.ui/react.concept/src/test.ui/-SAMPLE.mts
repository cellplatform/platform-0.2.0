import { Video } from './common';

export const SAMPLE = {
  Vimeo: {
    Tubes: Video.src(499921561),
    Running: Video.src(287903693), // https://vimeo.com/stock/clip-287903693-silhouette-woman-running-on-beach-waves-splashing-female-athlete-runner-exercising-sprinting-intense-workout-on-rough-ocean-seas

    // (White backdrop aesthetic: "Jonny Ive" → "Rowan" sample, recorded with tooling fully "in platform").
    WhiteBackdrop1: Video.src(612010014),
    WhiteBackdrop2: Video.src(727951677),
  },
  YouTube: {
    AlanKay: Video.src('N9c7_8Gp7gI'),
    LocalFirst: Video.src('KrPsyr8Ig6M'),
  },
  Diagrams: {
    GroupScale:
      'https://user-images.githubusercontent.com/185555/258566213-c75e78cf-a0e5-443d-888a-7fbe1682b868.png',

    ProductSystem:
      'https://user-images.githubusercontent.com/185555/258566241-90756274-3664-4670-b80b-48057c1b8c71.png',
  },
} as const;
