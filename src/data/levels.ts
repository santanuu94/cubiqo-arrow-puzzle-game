// ─── 100 Puzzle Levels for CUBIQO: Arrow Escape ───────────────
// Every level is mathematically verified solvable with rich dependency chains.
// Difficulty tiers:
//   Levels 1-10:   Learning phase (3×3 grids, 1-9 arrows)
//   Levels 11-20:  Beginner challenge (3×3 grids, 5-8 arrows)
//   Levels 21-35:  Intermediate (4×4 grids, 6-13 arrows)
//   Levels 36-50:  Advanced Intermediate (4×4 grids, 10-16 arrows)
//   Levels 51-70:  Advanced (5×5 grids, 10-21 arrows)
//   Levels 71-90:  Expert (5×5 grids, 16-24 arrows)
//   Levels 91-100: Master Challenge (5×5 and 6×6 grids, 21-25 arrows)

import type { LevelConfig, Direction, ArrowColor } from '../engine/types';

export const levels: LevelConfig[] = [
  {
    "id": 1,
    "gridSize": 3,
    "par": 1,
    "twoStar": 3,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "red"
      }
    ]
  },
  {
    "id": 2,
    "gridSize": 3,
    "par": 2,
    "twoStar": 4,
    "arrows": [
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "blue"
      }
    ]
  },
  {
    "id": 3,
    "gridSize": 3,
    "par": 3,
    "twoStar": 5,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "green"
      }
    ]
  },
  {
    "id": 4,
    "gridSize": 3,
    "par": 4,
    "twoStar": 6,
    "arrows": [
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "orange"
      }
    ]
  },
  {
    "id": 5,
    "gridSize": 3,
    "par": 5,
    "twoStar": 7,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "purple"
      }
    ]
  },
  {
    "id": 6,
    "gridSize": 3,
    "par": 5,
    "twoStar": 7,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "purple"
      }
    ]
  },
  {
    "id": 7,
    "gridSize": 3,
    "par": 6,
    "twoStar": 8,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "pink"
      }
    ]
  },
  {
    "id": 8,
    "gridSize": 3,
    "par": 7,
    "twoStar": 9,
    "arrows": [
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "teal"
      }
    ]
  },
  {
    "id": 9,
    "gridSize": 3,
    "par": 8,
    "twoStar": 10,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 10,
    "gridSize": 3,
    "par": 8,
    "twoStar": 10,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 11,
    "gridSize": 3,
    "par": 6,
    "twoStar": 8,
    "arrows": [
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "pink"
      }
    ]
  },
  {
    "id": 12,
    "gridSize": 3,
    "par": 6,
    "twoStar": 8,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "pink"
      }
    ]
  },
  {
    "id": 13,
    "gridSize": 3,
    "par": 6,
    "twoStar": 8,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "pink"
      }
    ]
  },
  {
    "id": 14,
    "gridSize": 3,
    "par": 7,
    "twoStar": 9,
    "arrows": [
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "teal"
      }
    ]
  },
  {
    "id": 15,
    "gridSize": 3,
    "par": 7,
    "twoStar": 9,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "teal"
      }
    ]
  },
  {
    "id": 16,
    "gridSize": 3,
    "par": 7,
    "twoStar": 9,
    "arrows": [
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "teal"
      }
    ]
  },
  {
    "id": 17,
    "gridSize": 3,
    "par": 8,
    "twoStar": 10,
    "arrows": [
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 18,
    "gridSize": 3,
    "par": 8,
    "twoStar": 10,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 19,
    "gridSize": 3,
    "par": 8,
    "twoStar": 10,
    "arrows": [
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 20,
    "gridSize": 3,
    "par": 8,
    "twoStar": 10,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 21,
    "gridSize": 4,
    "par": 6,
    "twoStar": 8,
    "arrows": [
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "pink"
      }
    ]
  },
  {
    "id": 22,
    "gridSize": 4,
    "par": 6,
    "twoStar": 8,
    "arrows": [
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "pink"
      }
    ]
  },
  {
    "id": 23,
    "gridSize": 4,
    "par": 7,
    "twoStar": 9,
    "arrows": [
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "teal"
      }
    ]
  },
  {
    "id": 24,
    "gridSize": 4,
    "par": 7,
    "twoStar": 9,
    "arrows": [
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "teal"
      }
    ]
  },
  {
    "id": 25,
    "gridSize": 4,
    "par": 8,
    "twoStar": 10,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 26,
    "gridSize": 4,
    "par": 8,
    "twoStar": 10,
    "arrows": [
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 27,
    "gridSize": 4,
    "par": 9,
    "twoStar": 11,
    "arrows": [
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "red"
      }
    ]
  },
  {
    "id": 28,
    "gridSize": 4,
    "par": 9,
    "twoStar": 11,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "red"
      }
    ]
  },
  {
    "id": 29,
    "gridSize": 4,
    "par": 10,
    "twoStar": 12,
    "arrows": [
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "blue"
      }
    ]
  },
  {
    "id": 30,
    "gridSize": 4,
    "par": 10,
    "twoStar": 12,
    "arrows": [
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "blue"
      }
    ]
  },
  {
    "id": 31,
    "gridSize": 4,
    "par": 11,
    "twoStar": 13,
    "arrows": [
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "green"
      }
    ]
  },
  {
    "id": 32,
    "gridSize": 4,
    "par": 11,
    "twoStar": 13,
    "arrows": [
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "green"
      }
    ]
  },
  {
    "id": 33,
    "gridSize": 4,
    "par": 12,
    "twoStar": 15,
    "arrows": [
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "orange"
      }
    ]
  },
  {
    "id": 34,
    "gridSize": 4,
    "par": 12,
    "twoStar": 15,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "orange"
      }
    ]
  },
  {
    "id": 35,
    "gridSize": 4,
    "par": 13,
    "twoStar": 16,
    "arrows": [
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "purple"
      }
    ]
  },
  {
    "id": 36,
    "gridSize": 4,
    "par": 10,
    "twoStar": 12,
    "arrows": [
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "blue"
      }
    ]
  },
  {
    "id": 37,
    "gridSize": 4,
    "par": 10,
    "twoStar": 12,
    "arrows": [
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "blue"
      }
    ]
  },
  {
    "id": 38,
    "gridSize": 4,
    "par": 10,
    "twoStar": 12,
    "arrows": [
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "blue"
      }
    ]
  },
  {
    "id": 39,
    "gridSize": 4,
    "par": 11,
    "twoStar": 13,
    "arrows": [
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "green"
      }
    ]
  },
  {
    "id": 40,
    "gridSize": 4,
    "par": 11,
    "twoStar": 13,
    "arrows": [
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "green"
      }
    ]
  },
  {
    "id": 41,
    "gridSize": 4,
    "par": 11,
    "twoStar": 13,
    "arrows": [
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "green"
      }
    ]
  },
  {
    "id": 42,
    "gridSize": 4,
    "par": 12,
    "twoStar": 15,
    "arrows": [
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "orange"
      }
    ]
  },
  {
    "id": 43,
    "gridSize": 4,
    "par": 12,
    "twoStar": 15,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "orange"
      }
    ]
  },
  {
    "id": 44,
    "gridSize": 4,
    "par": 12,
    "twoStar": 15,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "orange"
      }
    ]
  },
  {
    "id": 45,
    "gridSize": 4,
    "par": 13,
    "twoStar": 16,
    "arrows": [
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "purple"
      }
    ]
  },
  {
    "id": 46,
    "gridSize": 4,
    "par": 13,
    "twoStar": 16,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "purple"
      }
    ]
  },
  {
    "id": 47,
    "gridSize": 4,
    "par": 13,
    "twoStar": 16,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "purple"
      }
    ]
  },
  {
    "id": 48,
    "gridSize": 4,
    "par": 14,
    "twoStar": 17,
    "arrows": [
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "pink"
      }
    ]
  },
  {
    "id": 49,
    "gridSize": 4,
    "par": 14,
    "twoStar": 17,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "pink"
      }
    ]
  },
  {
    "id": 50,
    "gridSize": 4,
    "par": 14,
    "twoStar": 17,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "pink"
      }
    ]
  },
  {
    "id": 51,
    "gridSize": 5,
    "par": 11,
    "twoStar": 13,
    "arrows": [
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "green"
      }
    ]
  },
  {
    "id": 52,
    "gridSize": 5,
    "par": 11,
    "twoStar": 13,
    "arrows": [
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "up",
        "color": "green"
      }
    ]
  },
  {
    "id": 53,
    "gridSize": 5,
    "par": 11,
    "twoStar": 13,
    "arrows": [
      {
        "row": 4,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "left",
        "color": "green"
      }
    ]
  },
  {
    "id": 54,
    "gridSize": 5,
    "par": 12,
    "twoStar": 15,
    "arrows": [
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "orange"
      }
    ]
  },
  {
    "id": 55,
    "gridSize": 5,
    "par": 12,
    "twoStar": 15,
    "arrows": [
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "orange"
      }
    ]
  },
  {
    "id": 56,
    "gridSize": 5,
    "par": 13,
    "twoStar": 16,
    "arrows": [
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "right",
        "color": "purple"
      }
    ]
  },
  {
    "id": 57,
    "gridSize": 5,
    "par": 13,
    "twoStar": 16,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "left",
        "color": "purple"
      }
    ]
  },
  {
    "id": 58,
    "gridSize": 5,
    "par": 13,
    "twoStar": 16,
    "arrows": [
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "left",
        "color": "purple"
      }
    ]
  },
  {
    "id": 59,
    "gridSize": 5,
    "par": 14,
    "twoStar": 17,
    "arrows": [
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "pink"
      }
    ]
  },
  {
    "id": 60,
    "gridSize": 5,
    "par": 14,
    "twoStar": 17,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "left",
        "color": "pink"
      }
    ]
  },
  {
    "id": 61,
    "gridSize": 5,
    "par": 15,
    "twoStar": 18,
    "arrows": [
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "teal"
      }
    ]
  },
  {
    "id": 62,
    "gridSize": 5,
    "par": 15,
    "twoStar": 18,
    "arrows": [
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "teal"
      }
    ]
  },
  {
    "id": 63,
    "gridSize": 5,
    "par": 15,
    "twoStar": 18,
    "arrows": [
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "teal"
      }
    ]
  },
  {
    "id": 64,
    "gridSize": 5,
    "par": 16,
    "twoStar": 20,
    "arrows": [
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 65,
    "gridSize": 5,
    "par": 16,
    "twoStar": 20,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 66,
    "gridSize": 5,
    "par": 17,
    "twoStar": 21,
    "arrows": [
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "red"
      }
    ]
  },
  {
    "id": 67,
    "gridSize": 5,
    "par": 17,
    "twoStar": 21,
    "arrows": [
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "red"
      }
    ]
  },
  {
    "id": 68,
    "gridSize": 5,
    "par": 17,
    "twoStar": 21,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "red"
      }
    ]
  },
  {
    "id": 69,
    "gridSize": 5,
    "par": 18,
    "twoStar": 22,
    "arrows": [
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "blue"
      }
    ]
  },
  {
    "id": 70,
    "gridSize": 5,
    "par": 18,
    "twoStar": 22,
    "arrows": [
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "blue"
      }
    ]
  },
  {
    "id": 71,
    "gridSize": 5,
    "par": 16,
    "twoStar": 20,
    "arrows": [
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 72,
    "gridSize": 5,
    "par": 16,
    "twoStar": 20,
    "arrows": [
      {
        "row": 4,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 73,
    "gridSize": 5,
    "par": 16,
    "twoStar": 20,
    "arrows": [
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 74,
    "gridSize": 5,
    "par": 17,
    "twoStar": 21,
    "arrows": [
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "red"
      }
    ]
  },
  {
    "id": 75,
    "gridSize": 5,
    "par": 17,
    "twoStar": 21,
    "arrows": [
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "red"
      }
    ]
  },
  {
    "id": 76,
    "gridSize": 5,
    "par": 18,
    "twoStar": 22,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "up",
        "color": "blue"
      }
    ]
  },
  {
    "id": 77,
    "gridSize": 5,
    "par": 18,
    "twoStar": 22,
    "arrows": [
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "blue"
      }
    ]
  },
  {
    "id": 78,
    "gridSize": 5,
    "par": 18,
    "twoStar": 22,
    "arrows": [
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "blue"
      }
    ]
  },
  {
    "id": 79,
    "gridSize": 5,
    "par": 19,
    "twoStar": 23,
    "arrows": [
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "green"
      }
    ]
  },
  {
    "id": 80,
    "gridSize": 5,
    "par": 19,
    "twoStar": 23,
    "arrows": [
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "up",
        "color": "green"
      }
    ]
  },
  {
    "id": 81,
    "gridSize": 5,
    "par": 20,
    "twoStar": 25,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "orange"
      }
    ]
  },
  {
    "id": 82,
    "gridSize": 5,
    "par": 20,
    "twoStar": 25,
    "arrows": [
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "orange"
      }
    ]
  },
  {
    "id": 83,
    "gridSize": 5,
    "par": 20,
    "twoStar": 25,
    "arrows": [
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "orange"
      }
    ]
  },
  {
    "id": 84,
    "gridSize": 5,
    "par": 21,
    "twoStar": 26,
    "arrows": [
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "purple"
      }
    ]
  },
  {
    "id": 85,
    "gridSize": 5,
    "par": 21,
    "twoStar": 26,
    "arrows": [
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "purple"
      }
    ]
  },
  {
    "id": 86,
    "gridSize": 5,
    "par": 19,
    "twoStar": 23,
    "arrows": [
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "green"
      }
    ]
  },
  {
    "id": 87,
    "gridSize": 5,
    "par": 19,
    "twoStar": 23,
    "arrows": [
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "green"
      }
    ]
  },
  {
    "id": 88,
    "gridSize": 5,
    "par": 20,
    "twoStar": 25,
    "arrows": [
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "up",
        "color": "orange"
      }
    ]
  },
  {
    "id": 89,
    "gridSize": 5,
    "par": 20,
    "twoStar": 25,
    "arrows": [
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "orange"
      }
    ]
  },
  {
    "id": 90,
    "gridSize": 5,
    "par": 21,
    "twoStar": 26,
    "arrows": [
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "purple"
      }
    ]
  },
  {
    "id": 91,
    "gridSize": 5,
    "par": 21,
    "twoStar": 26,
    "arrows": [
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "purple"
      }
    ]
  },
  {
    "id": 92,
    "gridSize": 5,
    "par": 22,
    "twoStar": 27,
    "arrows": [
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "up",
        "color": "pink"
      }
    ]
  },
  {
    "id": 93,
    "gridSize": 5,
    "par": 22,
    "twoStar": 27,
    "arrows": [
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "left",
        "color": "pink"
      }
    ]
  },
  {
    "id": 94,
    "gridSize": 6,
    "par": 20,
    "twoStar": 25,
    "arrows": [
      {
        "row": 4,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 5,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 5,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 5,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "left",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 2,
        "col": 5,
        "direction": "up",
        "color": "orange"
      }
    ]
  },
  {
    "id": 95,
    "gridSize": 6,
    "par": 21,
    "twoStar": 26,
    "arrows": [
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 5,
        "col": 4,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 5,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 5,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 5,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 5,
        "col": 5,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 5,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 5,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "purple"
      }
    ]
  },
  {
    "id": 96,
    "gridSize": 6,
    "par": 22,
    "twoStar": 27,
    "arrows": [
      {
        "row": 5,
        "col": 1,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 5,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 1,
        "col": 5,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 3,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 5,
        "col": 0,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 5,
        "col": 3,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 0,
        "col": 5,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 5,
        "col": 5,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "up",
        "color": "pink"
      }
    ]
  },
  {
    "id": 97,
    "gridSize": 6,
    "par": 23,
    "twoStar": 28,
    "arrows": [
      {
        "row": 5,
        "col": 3,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 5,
        "col": 1,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 5,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 3,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 5,
        "col": 5,
        "direction": "left",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 5,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "right",
        "color": "teal"
      }
    ]
  },
  {
    "id": 98,
    "gridSize": 6,
    "par": 24,
    "twoStar": 30,
    "arrows": [
      {
        "row": 4,
        "col": 4,
        "direction": "down",
        "color": "red"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "up",
        "color": "green"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 5,
        "col": 0,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 5,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 5,
        "col": 1,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 5,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 4,
        "col": 5,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 5,
        "col": 5,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 5,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "down",
        "color": "yellow"
      }
    ]
  },
  {
    "id": 99,
    "gridSize": 6,
    "par": 25,
    "twoStar": 31,
    "arrows": [
      {
        "row": 2,
        "col": 4,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 3,
        "col": 5,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 3,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 1,
        "col": 5,
        "direction": "up",
        "color": "orange"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "purple"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 5,
        "col": 0,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 5,
        "col": 5,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 5,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "pink"
      },
      {
        "row": 2,
        "col": 2,
        "direction": "left",
        "color": "teal"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "right",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "right",
        "color": "blue"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "green"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "left",
        "color": "orange"
      },
      {
        "row": 4,
        "col": 2,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 1,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 5,
        "col": 4,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "up",
        "color": "red"
      }
    ]
  },
  {
    "id": 100,
    "gridSize": 6,
    "par": 26,
    "twoStar": 32,
    "arrows": [
      {
        "row": 5,
        "col": 0,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 3,
        "col": 3,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 0,
        "col": 0,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 4,
        "col": 5,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 3,
        "col": 1,
        "direction": "down",
        "color": "purple"
      },
      {
        "row": 2,
        "col": 1,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 4,
        "col": 4,
        "direction": "right",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 2,
        "direction": "up",
        "color": "yellow"
      },
      {
        "row": 0,
        "col": 5,
        "direction": "up",
        "color": "red"
      },
      {
        "row": 4,
        "col": 0,
        "direction": "down",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 0,
        "direction": "down",
        "color": "green"
      },
      {
        "row": 0,
        "col": 4,
        "direction": "right",
        "color": "orange"
      },
      {
        "row": 1,
        "col": 0,
        "direction": "up",
        "color": "purple"
      },
      {
        "row": 5,
        "col": 4,
        "direction": "down",
        "color": "pink"
      },
      {
        "row": 1,
        "col": 4,
        "direction": "up",
        "color": "teal"
      },
      {
        "row": 3,
        "col": 2,
        "direction": "left",
        "color": "yellow"
      },
      {
        "row": 2,
        "col": 5,
        "direction": "right",
        "color": "red"
      },
      {
        "row": 2,
        "col": 4,
        "direction": "up",
        "color": "blue"
      },
      {
        "row": 3,
        "col": 4,
        "direction": "left",
        "color": "green"
      },
      {
        "row": 1,
        "col": 1,
        "direction": "down",
        "color": "orange"
      },
      {
        "row": 2,
        "col": 0,
        "direction": "right",
        "color": "purple"
      },
      {
        "row": 4,
        "col": 3,
        "direction": "right",
        "color": "pink"
      },
      {
        "row": 5,
        "col": 5,
        "direction": "down",
        "color": "teal"
      },
      {
        "row": 0,
        "col": 1,
        "direction": "down",
        "color": "yellow"
      },
      {
        "row": 1,
        "col": 5,
        "direction": "left",
        "color": "red"
      },
      {
        "row": 5,
        "col": 3,
        "direction": "right",
        "color": "blue"
      }
    ]
  }
];

/**
 * Deterministic, guaranteed-solvable daily challenge generator
 */
export function getDailyLevel(dateStr: string): LevelConfig {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  hash = Math.abs(hash);

  const gridSize = 4 + (hash % 2); // 4 or 5
  const arrowCount = 8 + (hash % 6); // 8-13 arrows
  const COLORS: ArrowColor[] = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'teal', 'yellow'];
  const DIRS: Direction[] = ['up', 'down', 'left', 'right'];

  let s = hash;
  function rand(): number {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >> 16) / 32768;
  }

  function getRayCells(row: number, col: number, dir: Direction, gSize: number): { r: number; c: number }[] {
    const cells: { r: number; c: number }[] = [];
    switch (dir) {
      case 'up':
        for (let r = row - 1; r >= 0; r--) cells.push({ r, c: col });
        break;
      case 'down':
        for (let r = row + 1; r < gSize; r++) cells.push({ r, c: col });
        break;
      case 'left':
        for (let c = col - 1; c >= 0; c--) cells.push({ r: row, c });
        break;
      case 'right':
        for (let c = col + 1; c < gSize; c++) cells.push({ r: row, c });
        break;
    }
    return cells;
  }

  for (let attempt = 0; attempt < 50; attempt++) {
    const allCells: { r: number; c: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        allCells.push({ r, c });
      }
    }

    for (let i = allCells.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }

    const chosenCells = allCells.slice(0, arrowCount);
    const arrows: { row: number; col: number; direction: Direction; color: ArrowColor }[] = [];
    let possible = true;

    for (let i = 0; i < arrowCount; i++) {
      const curr = chosenCells[i];
      const laterCells = new Set(chosenCells.slice(i + 1).map(c => `${c.r},${c.c}`));

      const validDirs: Direction[] = [];
      for (const dir of DIRS) {
        const ray = getRayCells(curr.r, curr.c, dir, gridSize);
        const blocked = ray.some(c => laterCells.has(`${c.r},${c.c}`));
        if (!blocked) validDirs.push(dir);
      }

      if (validDirs.length === 0) {
        possible = false;
        break;
      }

      arrows.push({
        row: curr.r,
        col: curr.c,
        direction: validDirs[Math.floor(rand() * validDirs.length)],
        color: COLORS[arrows.length % COLORS.length],
      });
    }

    if (possible && arrows.length === arrowCount) {
      return {
        id: 0,
        gridSize,
        par: arrowCount,
        twoStar: arrowCount + 3,
        arrows,
      };
    }
  }

  // Fallback simple daily level
  return {
    id: 0,
    gridSize: 3,
    par: 3,
    twoStar: 5,
    arrows: [
      { row: 0, col: 0, direction: 'up', color: 'red' },
      { row: 1, col: 1, direction: 'right', color: 'blue' },
      { row: 2, col: 2, direction: 'down', color: 'green' },
    ],
  };
}
