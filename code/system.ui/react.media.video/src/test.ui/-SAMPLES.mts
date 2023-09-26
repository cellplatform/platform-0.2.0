import { Video } from '../index.mjs';

export const SAMPLE = {
  VIMEO: {
    Tubes: Video.src(499921561),
    Running: Video.src(287903693), // https://vimeo.com/stock/clip-287903693-silhouette-woman-running-on-beach-waves-splashing-female-athlete-runner-exercising-sprinting-intense-workout-on-rough-ocean-seas

    // (White backdrop aesthetic: "Jonny Ive" → "Rowan" sample, recorded with tooling fully "in platform").
    WhiteBackdrop1: Video.src(612010014),
    WhiteBackdrop2: Video.src(727951677),
  },
  YOUTUBE: {
    AlanKay: Video.src('N9c7_8Gp7gI'),
    LocalFirst: Video.src('KrPsyr8Ig6M'),
  },
  VIDEO: {
    GroupScale: Video.src(
      'https://bafybeiesn6ayk6nukh2rbq576gk7l3e5dpycn5hzivstqjcxowvlnjgwgu.ipfs.w3s.link/group-scale.mp4',
    ),
    GmFarcaster: Video.src(
      'https://ipfs.decentralized-content.com/ipfs/bafybeidhpqhjepfpmfzqmh7n4eplgd5otrzka3ep5t6iwhp47omodxb7rm',
    ),
  },
} as const;
