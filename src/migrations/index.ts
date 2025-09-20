import * as migration_20250920_231428 from './20250920_231428';

export const migrations = [
  {
    up: migration_20250920_231428.up,
    down: migration_20250920_231428.down,
    name: '20250920_231428'
  },
];
