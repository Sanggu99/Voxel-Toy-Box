
import { LandmarkType, VoxelData } from '../types';

export const generateVoxels = (type: LandmarkType): VoxelData[] => {
  const voxels: VoxelData[] = [];
  let idCounter = 0;

  const addVoxel = (x: number, y: number, z: number, color: string) => {
    voxels.push({ id: `v-${idCounter++}`, x: Math.round(x), y: Math.round(y), z: Math.round(z), color });
  };

  switch (type) {
    case LandmarkType.EIFFEL_TOWER: {
      const iron = "#4b443d", lightIron = "#6d6055", deck = "#333333";
      // 1. Legs and Arches
      for (let y = 0; y <= 12; y++) {
        const spread = 14 - (y * 0.5);
        const thickness = y < 5 ? 2 : 1;
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
          for (let dx = 0; dx < thickness; dx++) {
            for (let dz = 0; dz < thickness; dz++) {
              addVoxel(sx * spread + dx, y, sz * spread + dz, iron);
            }
          }
        });
        // Decorative Arches between legs
        if (y > 5 && y < 10) {
          const archW = spread - 2;
          for (let i = -archW; i <= archW; i++) {
            if (Math.abs(i) > spread - 4) {
              addVoxel(i, y, spread, lightIron); addVoxel(i, y, -spread, lightIron);
              addVoxel(spread, y, i, lightIron); addVoxel(-spread, y, i, lightIron);
            }
          }
        }
      }
      // 2. First Platform
      for (let x = -13; x <= 13; x++) {
        for (let z = -13; z <= 13; z++) {
          if (Math.abs(x) > 9 || Math.abs(z) > 9) addVoxel(x, 12, z, deck);
        }
      }
      // 3. Middle Section
      for (let y = 13; y <= 28; y++) {
        const spread = 9 - ((y - 13) * 0.4);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
          addVoxel(sx * spread, y, sz * spread, iron);
        });
        if (y === 28) {
          for (let x = -Math.floor(spread) - 1; x <= spread + 1; x++) {
            for (let z = -Math.floor(spread) - 1; z <= spread + 1; z++) addVoxel(x, y, z, deck);
          }
        }
      }
      // 4. Upper Shaft and Spire
      for (let y = 29; y <= 55; y++) {
        const spread = Math.max(0.5, 4 - ((y - 29) * 0.15));
        const color = y > 50 ? "#cc4444" : (y % 5 === 0 ? lightIron : iron);
        addVoxel(spread, y, spread, color); addVoxel(-spread, y, spread, color);
        addVoxel(spread, y, -spread, color); addVoxel(-spread, y, -spread, color);
        if (y > 45) addVoxel(0, y, 0, color);
      }
      break;
    }

    case LandmarkType.COLOSSEUM: {
      const stone = "#d2b48c", brokenStone = "#b09a7a", interior = "#8b7355";
      const radiusX = 22, radiusZ = 18;
      for (let level = 0; level < 4; level++) {
        const h = level * 5;
        for (let angle = 0; angle < 360; angle += 1.5) {
          // Create the "broken" effect: one side is missing the top tiers
          const isBrokenZone = (angle > 140 && angle < 300);
          if (level >= 2 && isBrokenZone) continue;
          if (level === 3 && angle > 100 && angle < 340) continue;

          const rad = (angle * Math.PI) / 180;
          const x = Math.round(radiusX * Math.cos(rad));
          const z = Math.round(radiusZ * Math.sin(rad));
          
          for (let dy = 0; dy < 5; dy++) {
            const isArch = dy < 4 && angle % 12 < 7;
            if (!isArch || dy === 4) {
              addVoxel(x, h + dy, z, level === 3 ? brokenStone : stone);
            }
          }
        }
      }
      // Interior Tiers (Arena seating)
      for (let r = 8; r < 18; r++) {
        const h = (18 - r) * 0.8;
        for (let a = 0; a < 360; a += 3) {
          const rad = (a * Math.PI) / 180;
          addVoxel(r * Math.cos(rad), h, r * Math.sin(rad), interior);
        }
      }
      break;
    }

    case LandmarkType.PYRAMIDS: {
      const sand = "#e6c384", shadowSand = "#c2a36a", sphinxColor = "#d2b48c";
      // Great Pyramid
      for (let y = 0; y < 25; y++) {
        const s = 25 - y;
        for (let x = -s; x <= s; x++) {
          for (let z = -s; z <= s; z++) {
            if (Math.abs(x) === s || Math.abs(z) === s || y === 0) {
              addVoxel(x - 5, y, z - 5, (x+z) % 10 === 0 ? shadowSand : sand);
            }
          }
        }
      }
      // Smaller Pyramid
      for (let y = 0; y < 12; y++) {
        const s = 12 - y;
        for (let x = -s; x <= s; x++) {
          for (let z = -s; z <= s; z++) {
            if (Math.abs(x) === s || Math.abs(z) === s) addVoxel(x + 20, y, z + 15, sand);
          }
        }
      }
      // Sphinx
      for (let z = 15; z <= 28; z++) {
        for (let x = -13; x <= -7; x++) {
          const h = (z > 24) ? 8 : 4; // Head vs Body
          for (let y = 0; y < h; y++) {
            let color = sphinxColor;
            if (y >= 6 && z > 25 && (x === -13 || x === -7)) color = "#3b82f6"; // Nemes headcloth detail
            addVoxel(x, y, z, color);
          }
        }
      }
      break;
    }

    case LandmarkType.N_SEOUL_TOWER: {
      const concrete = "#f1f5f9", red = "#ef4444", glass = "#3b82f6", dark = "#334155";
      // Namsan Mountain Base
      for (let y = 0; y < 6; y++) {
        const r = 15 - y;
        for (let x = -r; x <= r; x++) {
          for (let z = -r; z <= r; z++) {
            if (x*x + z*z < r*r) addVoxel(x, y, z, "#3d5a3a");
          }
        }
      }
      // Main Stem
      for (let y = 6; y < 38; y++) {
        for (let x = -2; x <= 2; x++) {
          for (let z = -2; z <= 2; z++) {
            if (x*x + z*z <= 5) addVoxel(x, y, z, concrete);
          }
        }
      }
      // Observation Decks (Octagonal-ish)
      const decks = [38, 42];
      decks.forEach(dy => {
        for (let y = dy; y < dy + 4; y++) {
          const r = (y === dy + 1 || y === dy + 2) ? 8 : 6;
          for (let x = -r; x <= r; x++) {
            for (let z = -r; z <= r; z++) {
              const d = x*x + z*z;
              if (d <= r*r && d > (r-2)*(r-2)) {
                addVoxel(x, y, z, (y === dy+1 || y === dy+2) ? glass : concrete);
              } else if (d <= (r-2)*(r-2) && (y === dy || y === dy + 3)) {
                addVoxel(x, y, z, dark);
              }
            }
          }
        }
      });
      // Antenna
      for (let y = 46; y < 65; y++) {
        const color = (y % 6 < 3) ? red : concrete;
        addVoxel(0, y, 0, color);
        addVoxel(1, y, 0, color); addVoxel(-1, y, 0, color);
        addVoxel(0, y, 1, color); addVoxel(0, y, -1, color);
      }
      break;
    }

    case LandmarkType.SUNGNYEMUN: {
      const stone = "#888888", wood = "#ae443a", darkRoof = "#222222", deco = "#166534";
      // 1. Foundation with Arch
      for (let y = 0; y < 10; y++) {
        for (let x = -15; x <= 15; x++) {
          for (let z = -8; z <= 8; z++) {
            const isArch = y < 6 && Math.abs(x) < 4;
            if (!isArch) addVoxel(x, y, z, (x+y+z) % 7 === 0 ? "#777" : stone);
          }
        }
      }
      // 2. Double Tier Pavilion
      const buildPavilion = (startY: number, w: number, d: number, h: number) => {
        // Red wooden pillars and walls
        for (let y = startY; y < startY + h; y++) {
          for (let x = -w; x <= w; x++) {
            for (let z = -d; z <= d; z++) {
              if (Math.abs(x) === w || Math.abs(z) === d || (x % 4 === 0 && z % 4 === 0)) {
                addVoxel(x, y, z, wood);
              }
              if (y === startY + h - 1) addVoxel(x, y, z, deco); // Dancheong eaves
            }
          }
        }
        // Curved Roof
        const roofY = startY + h;
        for (let x = -w - 3; x <= w + 3; x++) {
          for (let z = -d - 3; z <= d + 3; z++) {
            const edgeDist = Math.max(Math.abs(x) - w, Math.abs(z) - d);
            const lift = edgeDist > 0 ? Math.floor(edgeDist * edgeDist * 0.4) : 0;
            if (edgeDist <= 3) addVoxel(x, roofY + lift, z, darkRoof);
          }
        }
      };
      buildPavilion(10, 12, 6, 5); // 1st floor
      buildPavilion(16, 10, 5, 5); // 2nd floor
      break;
    }

    case LandmarkType.EMPIRE_STATE: {
      const tan = "#dcd1c4", window = "#334155", silver = "#cbd5e1";
      const buildSection = (yS: number, yE: number, rX: number, rZ: number) => {
        for (let y = yS; y < yE; y++) {
          for (let x = -rX; x <= rX; x++) {
            for (let z = -rZ; z <= rZ; z++) {
              const isWall = Math.abs(x) === rX || Math.abs(z) === rZ;
              const isWindow = isWall && (x % 2 === 0) && (y % 2 === 0);
              if (isWall) addVoxel(x, y, z, isWindow ? window : tan);
              else if (y === yS || y === yE - 1) addVoxel(x, y, z, tan);
            }
          }
        }
      };
      buildSection(0, 8, 14, 10);   // Base
      buildSection(8, 40, 8, 6);    // Main shaft
      buildSection(40, 48, 6, 4);   // Observation tier
      // Mast/Spire
      for (let y = 48; y < 60; y++) {
        const r = y < 54 ? 2 : 1;
        for (let dx = -r; dx <= r; dx++) {
          for (let dz = -r; dz <= r; dz++) {
            if (dx*dx + dz*dz <= r*r) addVoxel(dx, y, dz, silver);
          }
        }
      }
      addVoxel(0, 60, 0, "#ef4444");
      break;
    }

    case LandmarkType.SAGRADA_FAMILIA: {
      const stone = "#b09a7a", newStone = "#d2b48c", gold = "#ffd700";
      // Central Mass
      for (let y = 0; y < 15; y++) {
        for (let x = -10; x <= 10; x++) {
          for (let z = -10; z <= 10; z++) {
            const n = Math.sin(x*0.4) * Math.cos(z*0.4);
            if (y < 10 + n * 5) addVoxel(x, y, z, stone);
          }
        }
      }
      // Four Iconic Spires
      const pos = [[-6,-6], [6,-6], [-6,6], [6,6], [0,0]];
      pos.forEach(([sx, sz], i) => {
        const maxH = i === 4 ? 55 : 42;
        for (let y = 10; y < maxH; y++) {
          const r = Math.max(1, 4 - (y-10)*0.08);
          for (let dx = -r; dx <= r; dx++) {
            for (let dz = -r; dz <= r; dz++) {
              if (dx*dx + dz*dz <= r*r) {
                const color = y > maxH - 4 ? gold : (y % 3 === 0 ? "#94a3b8" : (i === 4 ? newStone : stone));
                addVoxel(sx + dx, y, sz + dz, color);
              }
            }
          }
        }
      });
      break;
    }

    case LandmarkType.OPERA_HOUSE: {
      const shell = "#fcfcfc", base = "#57534e", glass = "#7dd3fc";
      // Massive Granite Podium
      for (let y = 0; y < 6; y++) {
        for (let x = -20; x <= 20; x++) {
          for (let z = -12; z <= 12; z++) {
            if (y < 4 || (Math.abs(x) < 18 && Math.abs(z) < 10)) addVoxel(x, y, z, base);
          }
        }
      }
      // Nested Sails
      const buildShell = (offX: number, offZ: number, scale: number, rot: number) => {
        for (let i = 0; i < scale; i++) {
          const h = (scale - i) * 1.5;
          for (let dy = 0; dy < h; dy++) {
            const z = offZ + i + (dy * 0.5);
            const xRange = Math.floor((h - dy) * 0.6);
            for (let dx = -xRange; dx <= xRange; dx++) {
              addVoxel(offX + dx, 6 + dy, z, shell);
              if (dy === 0) addVoxel(offX + dx, 6, z - 1, glass); // Front window base
            }
          }
        }
      };
      buildShell(-10, -5, 10, 0);
      buildShell(-2, -3, 12, 0);
      buildShell(8, -4, 8, 0);
      buildShell(-12, 4, 6, 0); // Smaller back shells
      break;
    }
  }

  return voxels;
};
