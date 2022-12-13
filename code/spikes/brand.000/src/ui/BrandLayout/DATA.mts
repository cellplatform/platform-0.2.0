const URLS = {
  TRAIL_TRIBE: {
    SKETCH_1:
      'https://user-images.githubusercontent.com/185555/205549096-48cd9707-bca1-4561-aa68-8df60e61f37f.jpg',
    SKETCH_2:
      'https://user-images.githubusercontent.com/185555/205729992-44c68a14-db0f-4c5b-b511-6b6774030166.jpg',
    SHARP_DARK:
      'https://user-images.githubusercontent.com/185555/205815437-fddd3691-1a5b-4113-8bdc-68944e4e153e.png',
  },

  SHEET: {
    SKETCH_1:
      'https://user-images.githubusercontent.com/185555/206967117-b41246ef-99ad-4e25-863f-736da479fd53.png',
    SKETCH_2:
      'https://user-images.githubusercontent.com/185555/206967130-6be8c0b9-ecee-493a-b1ee-508925c66523.png',
  },
};

export const SAMPLE_DATA = {
  URLS,

  tempDeriveMedia() {
    const url = new URL(location.href);

    let left = 'URLS.TRAIL_TRIBE.SKETCH_1;';
    let right = 'URLS.TRAIL_TRIBE.SKETCH_2;';

    left = URLS.TRAIL_TRIBE.SKETCH_1;
    right = URLS.TRAIL_TRIBE.SKETCH_2;

    left = URLS.SHEET.SKETCH_1;
    right = URLS.SHEET.SKETCH_2;

    return { left, right };
  },
};
