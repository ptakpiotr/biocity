import { Container } from "pixi.js";
import type { CityId } from "@/Types";
import { CityPen, lots, project } from "./cityGeometry";

export const cityLots: Record<CityId, Record<string, [number, number]>> = {
  plant: lots,
  animal: {
    hall: [330, 210],
    power: [120, 210],
    factory: [570, 270],
    store: [160, 460],
    network: [510, 490],
    gate: [390, 660],
    water: [340, 450],
  },
  bacteria: {
    library: [260, 190],
    factory: [570, 230],
    wall: [65, 330],
    gate: [390, 635],
    water: [510, 480],
  },
};
export const cityStyles = {
  plant: { ink: 0x48643d, accent: 0x88ac55, light: 0xffefd0, pin: 0x3f704a },
  animal: { ink: 0xacc8ed, accent: 0x5ce5e4, light: 0xe8fbff, pin: 0x5088b3 },
  bacteria: { ink: 0x825637, accent: 0x298a83, light: 0xffe8b5, pin: 0xa26c38 },
};
export type TrafficRoute = [number, number][];
export interface SceneryObject {
  depth: number;
  draw: () => void;
}

const path = (p: CityPen, points: number[][], color: number, width: number, z = 0) => {
  const [x, y] = project(points[0][0], points[0][1], z);
  p.g.moveTo(x, y);
  for (const [u, v] of points.slice(1)) {
    const [px, py] = project(u, v, z);
    p.g.lineTo(px, py);
  }
  p.g.stroke({ color, width, cap: "round", join: "round" });
};
const circleGround = (u: number, v: number, radius: number) =>
  Array.from({ length: 65 }, (_, i) =>
    project(
      u + Math.cos((i / 64) * Math.PI * 2) * radius,
      v + Math.sin((i / 64) * Math.PI * 2) * radius,
    ),
  );

export const drawEnvironment = (
  world: Container,
  city: CityId,
): { objects: SceneryObject[]; routes: TrafficRoute[] } => {
  const p = new CityPen(world);
  const objects: SceneryObject[] = [];
  const tree = (u: number, v: number, s = 1) =>
    objects.push({ depth: u + v, draw: () => new CityPen(world).tree(u, v, s) });
  if (city === "plant") {
    p.g.ellipse(580, 475, 465, 230).fill({ color: 0x384e32, alpha: 0.12 });
    p.box(0, 0, 840, 700, 28, 0x9fb977, 0x6c8b53, 0x567c48, -28);
    p.ground(12, 12, 815, 675, 0xaac47e);
    // Garden beds, irrigation channels and warm stone boulevards.
    p.ground(18, 553, 804, 82, 0xe1d3a8);
    p.ground(18, 562, 804, 64, 0x5ba99a);
    for (let i = 0; i < 36; i++)
      path(
        p,
        [
          [30 + i * 22, 580],
          [43 + i * 22, 580],
        ],
        0xa5d8c0,
        1,
      );
    for (const [u, v, w, d] of [
      [25, 345, 790, 40],
      [330, 25, 40, 650],
      [550, 25, 36, 640],
    ]) {
      p.ground(u - 6, v - 6, w + 12, d + 12, 0xe6dab8);
      p.ground(u, v, w, d, 0xa9a486);
      for (let k = 8; k < Math.max(w, d); k += 22)
        p.ground(
          u + (w > d ? k : 0),
          v + (d > w ? k : 0),
          w > d ? 2 : w,
          d > w ? 2 : d,
          0xc1b99a,
          1,
        );
    }
    for (const u of [325, 370, 545, 586]) p.box(u, 554, 5, 80, 12, 0xe2d6ae, 0xa39472, 0x897d62);
    for (const [u, v, w, d] of [
      [10, 12, 815, 12],
      [10, 12, 12, 663],
      [815, 12, 12, 663],
      [10, 675, 345, 12],
      [505, 675, 322, 12],
    ]) {
      p.box(u, v, w, d, 22, 0xc8ce9e, 0x92a477, 0x819768);
      for (let k = 0; k < Math.max(w, d); k += 24)
        p.box(
          u + (w > d ? k : 0),
          v + (d > w ? k : 0),
          w > d ? 12 : w,
          d > w ? 12 : d,
          7,
          0xd8d9af,
          0xa9b383,
          0x91a373,
          22,
        );
    }
    for (let i = 0; i < 15; i++) {
      tree(45 + i * 50, 45, 0.9);
      tree(790, 65 + i * 35, 0.9);
    }
    for (const [u, v] of [
      [75, 310],
      [175, 310],
      [275, 310],
      [450, 310],
      [625, 310],
      [745, 310],
      [400, 520],
      [510, 520],
    ])
      tree(u, v);
    for (let i = 0; i < 4; i++) {
      const u = 65 + i * 64;
      objects.push({
        depth: u + 75,
        draw: () => {
          const h = new CityPen(world);
          h.box(u, 75, 43, 40, 34, 0xf6e8bc, 0xf0d3a5, 0xc1ae82);
          h.windows(u, 75, 43, 40, 34, 1);
          h.roof(u, 75, 43, 40, 34, 0xb56146);
          h.tree(u + 47, 115, 0.65);
        },
      });
    }
    for (let i = 0; i < 5; i++) {
      p.ground(75 + i * 45, 245, 30, 32, 0x648b50);
      for (let j = 0; j < 5; j++) {
        const [x, y] = project(78 + i * 45 + j * 5, 266);
        p.g.circle(x, y, 3).fill(j % 2 ? 0xf0bf76 : 0xe8a6a2);
      }
    }
    return {
      objects,
      routes: [
        [
          [40, 362],
          [780, 362],
        ],
        [
          [350, 40],
          [350, 650],
        ],
      ],
    };
  }
  if (city === "animal") {
    // An oval floating city: concentric boulevards and luminous membrane.
    const edge = circleGround(420, 360, 405);
    const lower = edge.map(([x, y]) => [x, y + 28]);
    p.face(lower, 0x15283f);
    p.face(edge, 0x243c58);
    p.g.poly(edge.flat()).stroke({ color: 0x5499ba, width: 5 });
    p.g.poly(circleGround(420, 360, 392).flat()).stroke({ color: 0x4ed3d6, alpha: 0.6, width: 2 });
    const ring: TrafficRoute = Array.from({ length: 65 }, (_, i) => [
      420 + Math.cos((i / 64) * Math.PI * 2) * 315,
      360 + Math.sin((i / 64) * Math.PI * 2) * 295,
    ]);
    path(p, ring, 0x415871, 31);
    path(p, ring, 0x192c43, 23);
    path(
      p,
      [
        [125, 370],
        [710, 370],
      ],
      0x415871,
      32,
    );
    path(
      p,
      [
        [125, 370],
        [710, 370],
      ],
      0x192c43,
      24,
    );
    path(
      p,
      [
        [430, 100],
        [430, 690],
      ],
      0x415871,
      32,
    );
    path(
      p,
      [
        [430, 100],
        [430, 690],
      ],
      0x192c43,
      24,
    );
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const [x, y] = project(420 + Math.cos(a) * 380, 360 + Math.sin(a) * 380);
      p.g.circle(x, y, 3).fill(0x65f0e8);
      p.g.circle(x, y, 7).fill({ color: 0x65f0e8, alpha: 0.12 });
    }
    for (let i = 0; i < 7; i++) {
      const u = 130 + i * 78,
        v = 110;
      objects.push({
        depth: u + v,
        draw: () => {
          const h = new CityPen(world);
          const height = 40 + (i % 3) * 30;
          h.box(u, v, 40, 40, height, 0x6b91ac, 0x365471, 0x243a57);
          for (let r = 8; r < height - 5; r += 13)
            h.box(u + 4, v + 41, 32, 1, 3, 0x6ad3dd, 0x6ad3dd, 0x6ad3dd, r);
          h.box(u - 3, v - 3, 46, 46, 4, 0x98b5d4, 0x6b8da9, 0x44647e, height);
        },
      });
    }
    for (let i = 0; i < 8; i++) {
      const [x, y] = project(100 + i * 88, 390);
      p.g
        .moveTo(x, y)
        .lineTo(x, y - 26)
        .lineTo(x + 8, y - 29)
        .stroke({ color: 0x8ba8c2, width: 2 });
      p.g.circle(x + 8, y - 29, 3).fill(0xffd5b1);
    }
    return {
      objects,
      routes: [
        ring,
        [
          [140, 370],
          [700, 370],
        ],
        [
          [430, 115],
          [430, 675],
        ],
      ],
    };
  }
  // Baktria: a cut sandstone mesa, copper pipes, dunes and a central bazaar.
  const outline = [
    [100, 70],
    [660, 30],
    [840, 220],
    [750, 650],
    [170, 690],
    [0, 420],
  ];
  p.face(
    outline.map(([u, v]) => project(u, v, -32)),
    0x99663f,
  );
  p.face(
    outline.map(([u, v]) => project(u, v)),
    0xd7b27a,
  );
  p.g
    .poly(outline.map(([u, v]) => project(u, v)).flat())
    .closePath()
    .stroke({ color: 0xf5d49a, width: 5 });
  for (let i = 0; i < 7; i++)
    path(
      p,
      [
        [80 + i * 25, 150 + i * 12],
        [160 + i * 27, 135 + i * 18],
        [230 + i * 15, 160 + i * 22],
      ],
      0xc49b61,
      2,
    );
  const routes: TrafficRoute[] = [
    [
      [390, 665],
      [390, 390],
      [180, 390],
    ],
    [
      [390, 390],
      [710, 390],
    ],
    [
      [390, 390],
      [390, 120],
    ],
  ];
  for (const route of routes) {
    path(p, route, 0xb68c5a, 42);
    path(p, route, 0xebcb8c, 30);
  }
  for (let i = 0; i < 13; i++) {
    const u = 70 + i * 52,
      v = 575 + (i % 2) * 15;
    p.box(u, v, 6, 6, 13, 0xbf8854, 0x9f6b42, 0x815638);
    if (i < 12) p.box(u, v, 52, 4, 4, 0x55a39a, 0x307d77, 0x1e605f, 13);
  }
  for (let i = 0; i < 5; i++) {
    const u = 160 + i * 100,
      v = 90 + (i % 2) * 25;
    objects.push({
      depth: u + v,
      draw: () => {
        const h = new CityPen(world);
        h.box(u, v, 47, 44, 30, 0xf3d399, 0xd09a62, 0xa97a4c);
        h.box(u + 6, v + 6, 33, 30, 5, 0xdebb80, 0xa97a4c, 0x8e6341, 30);
        h.box(u + 17, v + 45, 14, 1, 22, 0x438b84, 0x438b84, 0x438b84);
        if (i % 2) h.cylinder(u + 24, v + 22, 13, 9, 0x42958b, 35);
      },
    });
  }
  // Striped market canopies, amphorae and cacti belong only to the desert city.
  for (let i = 0; i < 3; i++) {
    const u = 180 + i * 65,
      v = 450;
    objects.push({
      depth: u + v,
      draw: () => {
        const h = new CityPen(world);
        h.box(u, v, 45, 34, 20, 0xe0ad70, 0xb47e4e, 0x98633b);
        for (let k = 0; k < 5; k++)
          h.ground(u + k * 10, v - 5, 10, 48, k % 2 ? 0xf4dfad : 0x448c85, 36);
        h.cylinder(u + 47, v + 35, 7, 13, 0xae724a);
      },
    });
  }
  for (const [u, v] of [
    [95, 280],
    [720, 190],
    [730, 510],
    [200, 615],
    [90, 480],
  ]) {
    const [x, y] = project(u, v);
    p.g
      .moveTo(x, y)
      .lineTo(x, y - 27)
      .moveTo(x, y - 13)
      .lineTo(x - 9, y - 13)
      .lineTo(x - 9, y - 24)
      .moveTo(x, y - 8)
      .lineTo(x + 8, y - 8)
      .lineTo(x + 8, y - 20)
      .stroke({ color: 0x638c66, width: 6, cap: "round", join: "round" });
  }
  return { objects, routes };
};
