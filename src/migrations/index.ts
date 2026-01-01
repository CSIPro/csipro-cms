import * as migration_20250920_231428 from './20250920_231428';
import * as migration_20250921_181150 from './20250921_181150';
import * as migration_20250921_195216 from './20250921_195216';
import * as migration_20250927_232216 from './20250927_232216';
import * as migration_20251107_032057_carreras_y_miembros from './20251107_032057_carreras_y_miembros';
import * as migration_20251108_062819_multiple_roles from './20251108_062819_multiple_roles';
import * as migration_20251225_053422 from './20251225_053422';
import * as migration_20251225_230916_member_resume from './20251225_230916_member_resume';
import * as migration_20251227_204700 from './20251227_204700';
import * as migration_20260101_213958_media_processing from './20260101_213958_media_processing';

export const migrations = [
  {
    up: migration_20250920_231428.up,
    down: migration_20250920_231428.down,
    name: '20250920_231428',
  },
  {
    up: migration_20250921_181150.up,
    down: migration_20250921_181150.down,
    name: '20250921_181150',
  },
  {
    up: migration_20250921_195216.up,
    down: migration_20250921_195216.down,
    name: '20250921_195216',
  },
  {
    up: migration_20250927_232216.up,
    down: migration_20250927_232216.down,
    name: '20250927_232216',
  },
  {
    up: migration_20251107_032057_carreras_y_miembros.up,
    down: migration_20251107_032057_carreras_y_miembros.down,
    name: '20251107_032057_carreras_y_miembros',
  },
  {
    up: migration_20251108_062819_multiple_roles.up,
    down: migration_20251108_062819_multiple_roles.down,
    name: '20251108_062819_multiple_roles',
  },
  {
    up: migration_20251225_053422.up,
    down: migration_20251225_053422.down,
    name: '20251225_053422',
  },
  {
    up: migration_20251225_230916_member_resume.up,
    down: migration_20251225_230916_member_resume.down,
    name: '20251225_230916_member_resume',
  },
  {
    up: migration_20251227_204700.up,
    down: migration_20251227_204700.down,
    name: '20251227_204700',
  },
  {
    up: migration_20260101_213958_media_processing.up,
    down: migration_20260101_213958_media_processing.down,
    name: '20260101_213958_media_processing'
  },
];
