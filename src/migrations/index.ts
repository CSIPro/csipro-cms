import * as migration_20250920_231428 from './20250920_231428';
import * as migration_20250921_181150 from './20250921_181150';

export const migrations = [
  {
    up: migration_20250920_231428.up,
    down: migration_20250920_231428.down,
    name: '20250920_231428',
  },
  {
    up: migration_20250921_181150.up,
    down: migration_20250921_181150.down,
    name: '20250921_181150'
  },
];
