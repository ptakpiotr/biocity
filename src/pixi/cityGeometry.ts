import { Container, Graphics } from "pixi.js";

export const MAP_WIDTH = 1160;
export const MAP_HEIGHT = 690;
export const project = (u: number, v: number, z = 0): [number, number] => [
  580 + (u - v) * 0.68,
  110 + (u + v) * 0.34 - z,
];
export const lots: Record<string, [number, number]> = {
  hall: [260, 230],
  power: [600, 150],
  store: [620, 440],
  farm: [130, 440],
  network: [420, 440],
  factory: [420, 140],
  library: [260, 230],
  gate: [400, 650],
  wall: [95, 155],
  water: [700, 590],
};

export class CityPen {
  readonly g = new Graphics();
  private readonly colors: Record<number, number | undefined>;
  constructor(parent: Container, colors: Record<number, number | undefined> = {}) {
    this.colors = colors;
    parent.addChild(this.g);
  }
  face(points: number[][], color: number, alpha = 1) {
    this.g.poly(points.flat()).fill({ color: this.colors[color] ?? color, alpha });
  }
  ground(u: number, v: number, w: number, d: number, color: number, z = 0) {
    this.face(
      [project(u, v, z), project(u + w, v, z), project(u + w, v + d, z), project(u, v + d, z)],
      color,
    );
  }
  box(
    u: number,
    v: number,
    w: number,
    d: number,
    h: number,
    top: number,
    front: number,
    side: number,
    z = 0,
  ) {
    this.face(
      [
        project(u, v + d, z),
        project(u + w, v + d, z),
        project(u + w, v + d, z + h),
        project(u, v + d, z + h),
      ],
      front,
    );
    this.face(
      [
        project(u + w, v, z),
        project(u + w, v + d, z),
        project(u + w, v + d, z + h),
        project(u + w, v, z + h),
      ],
      side,
    );
    this.ground(u, v, w, d, top, z + h);
  }
  roof(u: number, v: number, w: number, d: number, h: number, color = 0xba6550) {
    this.face(
      [
        project(u - 5, v - 5, h),
        project(u + w / 2, v - 5, h + 26),
        project(u + w / 2, v + d + 5, h + 26),
        project(u - 5, v + d + 5, h),
      ],
      color,
    );
    this.face(
      [
        project(u + w / 2, v - 5, h + 26),
        project(u + w + 5, v - 5, h),
        project(u + w + 5, v + d + 5, h),
        project(u + w / 2, v + d + 5, h + 26),
      ],
      0x884e43,
    );
  }
  cylinder(u: number, v: number, radius: number, h: number, color: number, z = 0) {
    const [x, y] = project(u, v, z);
    this.g.rect(x - radius, y - h, radius * 2, h).fill(color);
    this.g.ellipse(x, y, radius, radius * 0.45).fill(color);
    this.g.ellipse(x, y - h, radius, radius * 0.45).fill(0xd9e7df);
    this.g.ellipse(x, y - h, radius - 4, radius * 0.45 - 3).stroke({ color: 0x658b91, width: 2 });
  }
  windows(u: number, v: number, w: number, d: number, h: number, rows = 2) {
    for (let row = 0; row < rows; row++) {
      for (let x = 10; x < w - 8; x += 20)
        this.box(u + x, v + d + 1, 9, 1, 12, 0xa7e0de, 0x93c9cd, 0x6aa1ac, h - 21 - row * 23);
      for (let y = 10; y < d - 8; y += 21)
        this.box(u + w + 1, v + y, 1, 10, 12, 0x7fb5c0, 0x7fb5c0, 0x548699, h - 21 - row * 23);
    }
  }
  tree(u: number, v: number, size = 1) {
    const [x, y] = project(u, v);
    this.g.ellipse(x + 9, y + 3, 19 * size, 7 * size).fill({ color: 0x294e43, alpha: 0.16 });
    this.g.rect(x - 2, y - 25 * size, 5, 25 * size).fill(0x84634b);
    this.g.circle(x, y - 31 * size, 16 * size).fill(0x44866b);
    this.g.circle(x - 7 * size, y - 36 * size, 12 * size).fill(0x6fa278);
    this.g.circle(x + 5 * size, y - 42 * size, 10 * size).fill(0x88b582);
  }
}

export const drawLandmark = (parent: Container, id: string, u: number, v: number, city: string) => {
  const plant = city === "plant";
  const colors =
    city === "animal"
      ? {
          0xba6550: 0xd88380,
          0x884e43: 0x9f5d6d,
          0x567b79: 0x557a9c,
          0x4f7776: 0x456382,
          0xe8d9b9: 0xd4e0ec,
          0xb4b49e: 0x92a8bf,
          0xe3d1ae: 0xc7d5e3,
          0xb29b7e: 0x8d9fb4,
          0xc39878: 0xc78c86,
          0x997a66: 0x946d7c,
          0x71939b: 0x557f9c,
          0xd0d8bf: 0xc2d6e4,
          0xcbd0b1: 0xb5c8db,
          0xa6b090: 0x90a9c2,
          0xc1c9b3: 0xc3d4e1,
          0x9ca995: 0xa2b6cc,
        }
      : city === "bacteria"
        ? {
            0xba6550: 0x438c87,
            0x884e43: 0x2f696d,
            0x567c81: 0x3b8a87,
            0x71939b: 0x3a8380,
            0xc39878: 0xd4a06b,
            0x997a66: 0xa37550,
            0xe5cf9f: 0xedd5a7,
            0xb5a580: 0xb6986b,
            0xcbd0b1: 0xe3c798,
            0xa6b090: 0xc7a677,
            0x7b917a: 0xa3835d,
            0xd9dbc2: 0xf0d7ad,
            0xb6bda0: 0xd4b788,
            0x879b81: 0xa28660,
            0xc1c9b3: 0xe1c69a,
            0x9ca995: 0xc2a16f,
          }
        : {};
  const p = new CityPen(parent, colors);
  const base = (w: number, d: number) => {
    p.ground(u - 13, v - 13, w + 30, d + 30, 0x718a65);
    p.ground(u - 10, v - 10, w + 24, d + 24, 0xe6dfc7);
    p.face(
      [
        project(u + 10, v + d),
        project(u + w + 35, v + d + 15),
        project(u + w + 45, v + 20),
        project(u + w, v),
      ],
      0x435c52,
      0.16,
    );
  };
  switch (id) {
    case "hall": {
      base(125, 90);
      for (let i = 0; i < 3; i++)
        p.box(
          u - i * 6,
          v + 82 + i * 8,
          125 + i * 12,
          10,
          5,
          0xeee9dc,
          0xc1b69e,
          0xa89f8c,
          10 - i * 5,
        );
      p.box(u, v, 125, 85, 66, 0xf7ecd1, 0xe8d9b9, 0xb4b49e);
      p.windows(u, v, 125, 85, 66);
      for (let i = 0; i < 5; i++)
        p.box(u + 8 + i * 25, v + 86, 9, 9, 52, 0xfff5dc, 0xf6e9ce, 0xc7bfa9);
      p.face(
        [project(u - 8, v + 98, 59), project(u + 62, v + 98, 95), project(u + 133, v + 98, 59)],
        0xf9ecd1,
      );
      p.roof(u, v, 125, 75, 67, 0x567b79);
      p.box(u + 43, v + 23, 39, 36, 60, 0xd5e4d7, 0xf1e8d0, 0xb9bba5, 75);
      p.roof(u + 40, v + 20, 45, 42, 135, 0x4f7776);
      const [cx, cy] = project(u + 62, v + 60, 112);
      p.g.circle(cx, cy, 10).fill(0xfff9e8).stroke({ color: 0x6c796a, width: 2 });
      p.g
        .moveTo(cx, cy - 6)
        .lineTo(cx, cy)
        .lineTo(cx + 5, cy + 2)
        .stroke({ color: 0x455d55, width: 2 });
      break;
    }
    case "power": {
      base(130, 100);
      p.box(u, v + 35, 120, 65, 50, 0x607c87, 0xbca88e, 0x938d7b);
      p.windows(u, v + 35, 120, 65, 50, 1);
      for (let i = 0; i < 2; i++) {
        p.cylinder(u + 30 + i * 61, v + 18, 24, 72, 0x9daeb0);
        const [x, y] = project(u + 30 + i * 61, v + 18, 72);
        p.g.ellipse(x, y, 16, 6).fill(0x476a76);
        p.box(u + 12 + i * 61, v + 65, 15, 15, 85, 0xe4d3b1, 0xc6a18a, 0x98796a, 50);
        p.box(u + 12 + i * 61, v + 65, 15, 15, 11, 0xf6ead7, 0xf6ead7, 0xc9c1b2, 109);
      }
      const [x, y] = project(u + 63, v + 102, 30);
      p.face(
        [
          [x + 2, y - 17],
          [x - 11, y + 2],
          [x, y + 2],
          [x - 4, y + 17],
          [x + 13, y - 4],
          [x + 3, y - 4],
        ],
        0xffd774,
      );
      break;
    }
    case "store": {
      base(130, 95);
      p.box(u, v, 95, 75, plant ? 67 : 40, 0xb3cace, 0xe3d1ae, 0xb29b7e);
      p.roof(u, v, 95, 75, plant ? 67 : 40, 0x6b8998);
      for (let i = 0; i < 2; i++) {
        p.box(u + 12 + i * 42, v + 76, 29, 2, 31, 0x879c9e, 0x6b8385, 0x547071);
        for (let j = 0; j < 4; j++)
          p.box(u + 13 + i * 42, v + 78, 27, 1, 1, 0xb5c1b3, 0xb5c1b3, 0xb5c1b3, 7 + j * 6);
      }
      p.cylinder(u + 120, v + 37, plant ? 27 : 18, plant ? 95 : 46, 0x7daab2, 20);
      for (let i = 0; i < 3; i++)
        p.box(u + 8 + i * 22, v + 88, 16, 15, 15, 0xd6ad74, 0xbd8c55, 0x966c45);
      break;
    }
    case "farm": {
      base(160, 105);
      for (let row = 0; row < 6; row++) {
        p.ground(u, v + row * 15, 100, 9, 0x9b7850);
        for (let col = 0; col < 9; col++) {
          const [x, y] = project(u + col * 11 + 5, v + row * 15 + 5);
          p.g.ellipse(x, y - 4, 5, 7).fill(row % 2 ? 0x74a955 : 0x528752);
          p.g
            .moveTo(x, y)
            .lineTo(x, y - 9)
            .stroke({ color: 0xb9cb75, width: 1 });
        }
      }
      p.box(u + 112, v + 30, 48, 65, 33, 0xf4d5b0, 0xc78462, 0x9e6452);
      p.roof(u + 112, v + 30, 48, 65, 33, 0xb85d46);
      p.box(u + 124, v + 96, 23, 1, 27, 0xffe4b6, 0x775c45, 0x775c45);
      break;
    }
    case "factory": {
      base(125, 85);
      p.box(u, v, 125, 85, 47, 0xd1bba0, 0xc39878, 0x997a66);
      for (let i = 0; i < 4; i++) {
        p.face(
          [
            project(u + i * 31, v, 47),
            project(u + i * 31 + 25, v, 72),
            project(u + i * 31 + 25, v + 85, 72),
            project(u + i * 31, v + 85, 47),
          ],
          0x71939b,
        );
        p.face(
          [
            project(u + i * 31 + 25, v, 72),
            project(u + i * 31 + 31, v, 47),
            project(u + i * 31 + 31, v + 85, 47),
            project(u + i * 31 + 25, v + 85, 72),
          ],
          0xd9e9dc,
        );
      }
      p.windows(u, v, 125, 85, 42, 1);
      p.box(u + 104, v + 8, 16, 17, 100, 0xd8b9a3, 0xa16c56, 0x7d5548, 45);
      break;
    }
    case "network": {
      base(140, 100);
      for (const [du, dv] of [
        [0, 0],
        [80, 0],
        [0, 65],
        [80, 65],
      ]) {
        p.box(u + du, v + dv, 50, 36, 35, 0x91b9af, 0xd0d8bf, 0x8da998);
        p.windows(u + du, v + dv, 50, 36, 35, 1);
      }
      p.box(u + 15, v + 34, 18, 35, 12, 0xe0ba73, 0xba975e, 0x94794e, 18);
      p.box(u + 95, v + 34, 18, 35, 12, 0xe0ba73, 0xba975e, 0x94794e, 18);
      p.box(u + 50, v + 12, 30, 15, 12, 0xe0ba73, 0xba975e, 0x94794e, 18);
      p.box(u + 50, v + 78, 30, 15, 12, 0xe0ba73, 0xba975e, 0x94794e, 18);
      break;
    }
    case "library": {
      base(125, 95);
      p.box(u, v, 125, 90, 65, 0xc4c9bb, 0xe5cf9f, 0xb5a580);
      p.roof(u, v, 125, 90, 65, 0x567c81);
      p.windows(u, v, 125, 90, 62);
      for (let i = 0; i < 5; i++)
        p.box(u + 11 + i * 23, v + 91, 8, 8, 48, 0xffe9be, 0xf7e6c6, 0xc1b592);
      const [x, y] = project(u + 63, v + 98, 58);
      p.face(
        [
          [x - 17, y - 7],
          [x, y - 3],
          [x, y + 11],
          [x - 17, y + 7],
        ],
        0xfff1c8,
      );
      p.face(
        [
          [x, y - 3],
          [x + 17, y - 7],
          [x + 17, y + 7],
          [x, y + 11],
        ],
        0xe4c991,
      );
      break;
    }
    case "gate": {
      for (const du of [-50, 60]) {
        p.box(u + du, v, 40, 45, 80, 0xc1c9b3, 0x9ca995, 0x758c7d);
        for (let i = 0; i < 3; i++)
          p.box(u + du + i * 15 - 2, v, 10, 45, 12, 0xd1d4bc, 0xaab59c, 0x81927d, 80);
        p.box(u + du + 15, v + 46, 8, 1, 20, 0x4b665b, 0x4b665b, 0x4b665b, 42);
      }
      p.box(u - 10, v + 8, 70, 24, 18, 0xcdd0b8, 0xaab69c, 0x829580, 58);
      for (let i = 0; i < 5; i++)
        p.box(u - 7 + i * 15, v + 33, 3, 2, 22, 0x65796b, 0x65796b, 0x65796b, 35);
      break;
    }
    case "wall": {
      p.box(u - 12, v, 30, 110, 53, 0xcbd0b1, 0xa6b090, 0x7b917a);
      for (let i = 0; i < 8; i++)
        p.box(u - 14, v + i * 15, 34, 9, 13, 0xd9dbc2, 0xb9c2a1, 0x8a9c82, 53);
      p.box(u - 22, v + 40, 50, 43, 83, 0xd9dbc2, 0xb6bda0, 0x879b81);
      for (let i = 0; i < 4; i++)
        p.box(u - 24, v + 38 + i * 13, 54, 8, 12, 0xe5e4c8, 0xb6bda0, 0x879b81, 83);
      break;
    }
    case "water": {
      base(85, 65);
      p.box(u, v, 85, 65, 5, 0xddd4b7, 0xb7b597, 0xa2a88f);
      p.ground(u + 5, v + 5, 75, 55, 0x63b7c0, 6);
      p.cylinder(u + 42, v + 32, 13, 28, 0xb4d5ce, 6);
      const [x, y] = project(u + 42, v + 32, 48);
      p.g
        .moveTo(x, y + 15)
        .quadraticCurveTo(x - 17, y - 18, x - 23, y + 22)
        .moveTo(x, y + 15)
        .quadraticCurveTo(x + 17, y - 18, x + 23, y + 22)
        .stroke({ color: 0xc3f2e7, width: 3 });
      break;
    }
  }
  return p;
};
