export const COLORS = {
  BLACK: '#000',
  WHITE: '#fff',
  DARK: '#293042', // Inky blue/black.
  CYAN: '#00C2FF',
  MAGENTA: '#FE0064',
  BLUE: '#4D7EF7',
  YELLOW: '#FFC803',
  RED: '#E21B22',
} as const;

export const DEFAULTS = {
  MD: {
    DOC: { width: 692 },
    CLASS: {
      ROOT: 'sys-md-Doc',
      BLOCK: 'sys-md-Block',
      VIDEO_DIAGRAM: 'sys-md-VideoDiagram',
      VIDEO_DIAGRAM_REFS: 'sys-md-VideoDiagram-Refs',
      TIGGER_PANEL: 'sys-md-TriggerPanel',
      SIDEBAR: 'sys-md-Sidebar',
    },
  },
  PLAYLIST: {
    preview: {
      title: 'Programme',
      image:
        'https://user-images.githubusercontent.com/185555/213319665-8128314b-5d8e-4a19-b7f5-2469f09d6690.png',
    },
  },
} as const;
