import { Container, Text } from "pixi.js";
import type { CityId } from "@/Types";
import { CityPen, drawLandmark, project } from "./cityGeometry";

const sign = (
  parent: Container,
  u: number,
  v: number,
  z: number,
  text: string,
  color: number,
  fill = 0xffedc8,
) => {
  const p = new CityPen(parent);
  const [x, y] = project(u, v, z);
  const label = new Text({
    text,
    style: {
      fontFamily: "Roboto, Arial",
      fontSize: 11,
      fontWeight: "bold",
      letterSpacing: 0.7,
      fill,
    },
  });
  label.anchor.set(0.5);
  p.g.roundRect(x - label.width / 2 - 7, y - 9, label.width + 14, 18, 3).fill(color);
  label.position.set(x, y);
  parent.addChild(label);
};
const cog = (p: CityPen, x: number, y: number, radius: number, color: number) => {
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    p.g.circle(x + Math.cos(a) * radius, y + Math.sin(a) * radius, 4).fill(color);
  }
  p.g
    .circle(x, y, radius)
    .fill(color)
    .circle(x, y, radius * 0.42)
    .fill(0x334e52);
};
const flag = (p: CityPen, u: number, v: number, z: number, color: number) => {
  const [x, y] = project(u, v, z);
  p.g
    .moveTo(x, y + 30)
    .lineTo(x, y - 10)
    .stroke({ color: 0xeee3c6, width: 2 });
  p.face(
    [
      [x + 1, y - 10],
      [x + 24, y - 5],
      [x + 19, y + 4],
      [x + 1, y + 1],
    ],
    color,
  );
};
const lightning = (p: CityPen, x: number, y: number, color = 0xffda75) =>
  p.face(
    [
      [x + 3, y - 22],
      [x - 13, y + 2],
      [x, y + 2],
      [x - 4, y + 21],
      [x + 15, y - 6],
      [x + 2, y - 6],
    ],
    color,
  );

export const drawDistinctLandmark = (
  parent: Container,
  id: string,
  u: number,
  v: number,
  city: CityId,
): CityPen => {
  if (city === "plant") {
    const p = drawLandmark(parent, id, u, v, city);
    switch (id) {
      case "hall": {
        flag(p, u + 61, v + 39, 166, 0x96b95c);
        for (let i = 0; i < 5; i++) {
          const [x, y] = project(u + 10 + i * 25, v + 96, 49);
          p.g
            .ellipse(x, y, 6, 9)
            .fill(0x6d9957)
            .circle(x + 2, y - 6, 3)
            .fill(0xf1b1a2);
        }
        sign(parent, u + 62, v + 100, 72, "RATUSZ", 0x496e4b);
        break;
      }
      case "power": {
        // A large wheel and striped steam chimneys distinguish energy from manufacturing.
        const [x, y] = project(u - 4, v + 92, 42);
        p.g.circle(x, y, 28).fill(0x6c5740).circle(x, y, 22).fill(0xc29b60);
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          p.g
            .moveTo(x, y)
            .lineTo(x + Math.cos(a) * 25, y + Math.sin(a) * 25)
            .stroke({ color: 0x7b613f, width: 4 });
        }
        p.g.circle(x, y, 6).fill(0xe5be7a);
        for (let i = 0; i < 2; i++) {
          const [sx, sy] = project(u + 20 + i * 61, v + 72, 146);
          for (let k = 0; k < 3; k++)
            p.g
              .ellipse(sx - 5 + k * 5, sy - k * 15, 10 + k * 3, 8 + k * 3)
              .fill({ color: 0xfff8df, alpha: 0.6 - k * 0.13 });
        }
        sign(parent, u + 70, v + 103, 53, "ENERGIA", 0x8c6a37);
        break;
      }
      case "store": {
        const [x, y] = project(u + 120, v + 37, 20);
        p.g.rect(x - 17, y - 77, 34, 60).fill({ color: 0x7bd5c4, alpha: 0.75 });
        for (let i = 0; i < 6; i++)
          p.g
            .moveTo(x + 7, y - 22 - i * 10)
            .lineTo(x + 19, y - 22 - i * 10)
            .stroke({ color: 0xe5f4d0, width: 2 });
        p.g
          .moveTo(x - 23, y + 14)
          .lineTo(x - 23, y - 95)
          .stroke({ color: 0xf4e6b7, width: 3 });
        for (let i = 0; i < 8; i++)
          p.g
            .moveTo(x - 23, y - i * 11)
            .lineTo(x - 13, y - i * 11)
            .stroke({ color: 0xf4e6b7, width: 2 });
        sign(parent, u + 44, v + 78, 52, "MAGAZYN", 0x766446);
        break;
      }
      case "farm": {
        // Glass greenhouse, windmill, tomato rows and a barn with crossed doors.
        p.box(u + 1, v - 10, 90, 35, 25, 0xb7e4c2, 0xa5d6b2, 0x72ae93);
        p.roof(u + 1, v - 10, 90, 35, 25, 0xb5e7cf);
        for (let i = 0; i < 6; i++) {
          const [x, y] = project(u + i * 17, v + 26, 25);
          p.g
            .moveTo(x, y)
            .lineTo(x, y + 22)
            .stroke({ color: 0xf1f1d1, width: 2 });
        }
        const [x, y] = project(u + 154, v + 20, 77);
        p.g
          .moveTo(x, y + 58)
          .lineTo(x, y)
          .stroke({ color: 0xdcc79c, width: 9 });
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2 + 0.5;
          p.g
            .moveTo(x, y)
            .lineTo(x + Math.cos(a) * 31, y + Math.sin(a) * 31)
            .stroke({ color: 0xf8e8bb, width: 7 });
        }
        p.g.circle(x, y, 5).fill(0xb88c54);
        const [dx, dy] = project(u + 136, v + 98, 14);
        p.g
          .moveTo(dx - 7, dy - 9)
          .lineTo(dx + 7, dy + 8)
          .moveTo(dx + 7, dy - 9)
          .lineTo(dx - 7, dy + 8)
          .stroke({ color: 0xf5d3a1, width: 2 });
        sign(parent, u + 50, v + 105, 15, "SZKLARNIE", 0x547748);
        break;
      }
      case "factory": {
        const [x, y] = project(u + 64, v + 87, 38);
        cog(p, x, y, 18, 0xf4cc79);
        p.box(u - 15, v + 92, 135, 18, 10, 0x778a77, 0x61735f, 0x465e50);
        for (let i = 0; i < 5; i++)
          p.box(u + i * 23, v + 95, 13, 11, 13, 0xe5ba75, 0xc08c4d, 0x9c7040, 10);
        sign(parent, u + 60, v + 86, 78, "FABRYKA BIAŁEK", 0x795b42);
        break;
      }
      case "network": {
        for (let i = 0; i < 3; i++) {
          const [x, y] = project(u + 32 + i * 35, v + 45, 46);
          p.g
            .moveTo(x, y + 20)
            .lineTo(x, y - 9)
            .quadraticCurveTo(x + 8, y - 20, x + 19, y - 8)
            .lineTo(x + 19, y + 18)
            .stroke({ color: 0xd0a463, width: 7 });
          p.g.circle(x + 2, y - 4, 3).fill(0xfce3a2);
        }
        sign(parent, u + 69, v + 100, 39, "TRANSPORT", 0x587760);
        break;
      }
      case "gate": {
        for (const du of [-30, 80]) flag(p, u + du, v + 20, 110, 0x83ab59);
        for (let i = 0; i < 5; i++)
          p.box(u - 6 + i * 15, v + 34, 3, 3, 48, 0x7f6e4b, 0x7f6e4b, 0x7f6e4b);
        sign(parent, u + 25, v + 35, 74, "KONTROLA", 0x657c49);
        break;
      }
      case "wall": {
        for (let i = 0; i < 9; i++) {
          const [x, y] = project(u + 18, v + 13 + i * 11, 18 + (i % 3) * 12);
          p.g.ellipse(x, y, 6, 10).fill(i % 2 ? 0x4e8048 : 0x709a50);
        }
        for (let row = 0; row < 4; row++)
          for (let col = 0; col < 3; col++)
            p.box(u - 20 + col * 16, v + 84, 14, 1, 1, 0x8a9973, 0x8a9973, 0x8a9973, 15 + row * 17);
        flag(p, u, v + 60, 109, 0x89a94e);
        break;
      }
      case "water": {
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const [x, y] = project(u + 42 + Math.cos(a) * 47, v + 32 + Math.sin(a) * 38);
          p.g
            .ellipse(x, y, 6, 4)
            .fill(0x70a562)
            .circle(x + 1, y - 3, 2)
            .fill(0xf5c2a7);
        }
        sign(parent, u + 44, v + 67, 8, "OBIEG WODY", 0x467f78);
      }
    }
    return p;
  }
  const p = new CityPen(parent);
  if (city === "animal") {
    const pad = (w: number, d: number) => {
      p.box(u - 12, v - 12, w + 24, d + 24, 5, 0x42627e, 0x274059, 0x1a3048);
      p.ground(u - 8, v - 8, w + 16, 3, 0x5cdbdb, 6);
    };
    switch (id) {
      case "hall": {
        pad(120, 105);
        p.box(u, v, 120, 90, 27, 0x5e83a2, 0x34516b, 0x253a54);
        for (let i = 0; i < 3; i++)
          p.box(
            u + 20 + i * 8,
            v + 12 + i * 6,
            75 - i * 16,
            67 - i * 13,
            40,
            0xaac8dc,
            0x608ba8,
            0x3b627f,
            27 + i * 40,
          );
        for (let i = 0; i < 8; i++)
          p.box(u + 28, v + 79, 57, 1, 3, 0x70e5e4, 0x70e5e4, 0x70e5e4, 35 + i * 12);
        const [x, y] = project(u + 61, v + 40, 170);
        p.g
          .moveTo(x, y + 25)
          .lineTo(x, y - 14)
          .stroke({ color: 0xb7e9f4, width: 2 });
        p.g.circle(x, y - 16, 5).fill(0xf1bfaa);
        flag(p, u + 100, v + 84, 56, 0x5ed9dc);
        sign(parent, u + 60, v + 94, 30, "CENTRUM DOWODZENIA", 0x28465e, 0x8de8eb);
        break;
      }
      case "power": {
        pad(135, 100);
        p.cylinder(u + 65, v + 47, 48, 32, 0x3f6078);
        p.cylinder(u + 65, v + 47, 35, 48, 0x4b97ae, 22);
        const [x, y] = project(u + 65, v + 47, 93);
        p.g.ellipse(x, y, 46, 19).stroke({ color: 0x7affec, width: 6 });
        p.g.ellipse(x, y, 18, 40).stroke({ color: 0x86cfef, width: 3 });
        lightning(p, x, y, 0xffd799);
        for (const du of [0, 120]) p.box(u + du, v + 35, 13, 35, 70, 0x9ec4d8, 0x57879f, 0x315b78);
        sign(parent, u + 66, v + 102, 20, "ELEKTROWNIA", 0x26445d, 0x99f8df);
        break;
      }
      case "factory": {
        pad(140, 90);
        p.box(u, v, 135, 80, 48, 0x749bb4, 0x496e8c, 0x29485f);
        p.box(u + 10, v + 10, 115, 60, 7, 0xaff7ed, 0x4aa9b6, 0x378a9b, 48);
        p.box(u - 13, v + 87, 155, 22, 12, 0x8fabc0, 0x4b6a82, 0x304e65);
        for (let i = 0; i < 6; i++) {
          p.box(
            u - 6 + i * 26,
            v + 90,
            15,
            15,
            11,
            [0xe1a2b8, 0xa5e0d5, 0xefce93][i % 3],
            0x9b83a3,
            0x687d99,
            12,
          );
          const [x, y] = project(u + 12 + i * 22, v + 70, 65);
          p.g
            .moveTo(x, y + 30)
            .lineTo(x - 10, y - 2)
            .lineTo(x + 12, y - 17)
            .lineTo(x + 17, y - 5)
            .stroke({ color: 0xe9a599, width: 5, join: "round" });
        }
        const [x, y] = project(u + 67, v + 82, 40);
        cog(p, x, y, 13, 0x84e9e0);
        sign(parent, u + 67, v + 15, 73, "BIOFABRYKA", 0x2c4664, 0xb8f8ef);
        break;
      }
      case "store": {
        pad(130, 90);
        for (const [du, dv, h] of [
          [20, 25, 48],
          [80, 25, 66],
          [50, 77, 34],
        ]) {
          p.cylinder(u + du, v + dv, 22, h, 0x668aaf);
          const [x, y] = project(u + du, v + dv, h);
          p.g.ellipse(x, y - 6, 22, 15).fill(0x9bd1df);
          p.g.ellipse(x, y - 10, 14, 8).fill(0xc8f8ee);
          p.g
            .moveTo(x - 14, y + 20)
            .lineTo(x + 14, y + 20)
            .stroke({ color: 0x75e6d5, width: 5 });
        }
        sign(parent, u + 65, v + 102, 12, "MAŁE MAGAZYNY", 0x294860, 0xc6e7ff);
        break;
      }
      case "network": {
        pad(140, 100);
        for (const [du, dv, h] of [
          [0, 0, 75],
          [90, 0, 60],
          [0, 70, 42],
          [90, 70, 70],
        ]) {
          p.box(u + du, v + dv, 40, 34, h, 0x96bbd2, 0x456e8d, 0x2c4f6c);
          for (let r = 10; r < h; r += 16)
            p.box(u + du + 4, v + dv + 35, 32, 1, 3, 0x6de6dc, 0x6de6dc, 0x6de6dc, r);
        }
        p.box(u + 40, v + 12, 50, 15, 12, 0xd3a2bf, 0x967695, 0x775a7e, 45);
        p.box(u + 12, v + 34, 15, 39, 12, 0xa3dce7, 0x70aabc, 0x4d849b, 30);
        p.box(u + 102, v + 34, 15, 39, 12, 0xa3dce7, 0x70aabc, 0x4d849b, 40);
        sign(parent, u + 70, v + 108, 14, "SIEĆ TRANSPORTOWA", 0x28465e, 0xb6e9ed);
        break;
      }
      case "gate": {
        pad(120, 40);
        for (const du of [-25, 95]) p.box(u + du, v, 25, 35, 98, 0xc8e5ef, 0x6293ae, 0x365a77);
        p.box(u, v, 95, 15, 13, 0xbce6ed, 0x6a9fb5, 0x416e8b, 85);
        const [x, y] = project(u + 47, v + 18, 47);
        p.g
          .roundRect(x - 25, y - 28, 50, 56, 8)
          .fill({ color: 0x77e4e2, alpha: 0.16 })
          .stroke({ color: 0x88f7e7, width: 2 });
        p.g
          .moveTo(x - 19, y)
          .lineTo(x + 19, y)
          .stroke({ color: 0xffd1b0, width: 3 });
        sign(parent, u + 47, v + 20, 101, "SKANER GRANICZNY", 0x23445c, 0xafffea);
        break;
      }
      case "water": {
        pad(95, 75);
        p.cylinder(u + 47, v + 35, 43, 10, 0x537d9d);
        const [x, y] = project(u + 47, v + 35, 12);
        p.g.ellipse(x, y, 37, 15).fill(0x49c6cf);
        p.g.ellipse(x, y - 18, 26, 10).stroke({ color: 0xa4f9f0, width: 3 });
        p.g.ellipse(x, y - 39, 14, 6).stroke({ color: 0xa4f9f0, width: 3 });
        p.g
          .moveTo(x, y)
          .lineTo(x, y - 56)
          .stroke({ color: 0xe0fffa, width: 4 });
        sign(parent, u + 47, v + 80, 9, "FONTANNA", 0x26445e, 0x99f5e8);
        break;
      }
    }
    return p;
  }
  // Sandstone and copper: every Baktria landmark has its own silhouette.
  switch (id) {
    case "library": {
      p.box(u - 10, v - 10, 145, 110, 10, 0xe8cb93, 0xbc8c58, 0x97683f);
      p.box(u, v, 125, 85, 64, 0xebcb94, 0xd4a56d, 0xae7c4c);
      for (let i = 0; i < 3; i++)
        p.box(
          u + i * 18,
          v + i * 13,
          125 - i * 36,
          85 - i * 26,
          18,
          0xf3daa6,
          0xd9b17b,
          0xae8253,
          64 + i * 18,
        );
      p.cylinder(u + 62, v + 40, 24, 12, 0x3f9a8b, 118);
      const [x, y] = project(u + 62, v + 40, 154);
      p.face(
        [
          [x - 25, y],
          [x, y + 7],
          [x, y + 37],
          [x - 25, y + 28],
        ],
        0xffeac1,
      );
      p.face(
        [
          [x, y + 7],
          [x + 25, y],
          [x + 25, y + 28],
          [x, y + 37],
        ],
        0xe4bf81,
      );
      for (let i = 0; i < 3; i++)
        p.g
          .moveTo(x - 20, y + 9 + i * 7)
          .lineTo(x - 5, y + 13 + i * 7)
          .moveTo(x + 5, y + 13 + i * 7)
          .lineTo(x + 20, y + 9 + i * 7)
          .stroke({ color: 0xb68c52, width: 1.5 });
      for (let i = 0; i < 5; i++) {
        p.box(u + 5 + i * 24, v + 86, 10, 4, 42, 0xf0d6a6, 0xf0d6a6, 0xd5ad78);
        const [sx, sy] = project(u + 10 + i * 24, v + 89, 50);
        p.g.circle(sx, sy, 5).fill(0x3c8b81);
      }
      sign(parent, u + 62, v + 88, 69, "BIBLIOTEKA DNA", 0x6b7b61);
      break;
    }
    case "factory": {
      p.box(u, v, 135, 90, 45, 0xf1ce91, 0xd29760, 0xab7248);
      for (const du of [30, 95]) {
        p.cylinder(u + du, v + 35, 29, 17, 0xb88657, 45);
        const [x, y] = project(u + du, v + 35, 64);
        p.g.ellipse(x, y - 9, 29, 20).fill(0x41968c);
        p.g.ellipse(x - 6, y - 15, 13, 8).fill(0x6fbaaa);
      }
      p.box(u + 120, v + 15, 18, 20, 112, 0xe9bb82, 0xbd8050, 0x955d37);
      for (let i = 0; i < 5; i++)
        p.box(u + 118, v + 13, 22, 24, 5, 0x448b7b, 0x448b7b, 0x2b675f, 45 + i * 13);
      const [x, y] = project(u + 61, v + 92, 34);
      cog(p, x, y, 19, 0xf4cf7c);
      p.box(u - 15, v + 96, 145, 15, 9, 0x55877b, 0x38665e, 0x254d48);
      for (let i = 0; i < 6; i++) p.cylinder(u + i * 22, v + 103, 7, 10, 0xb8764e, 9);
      sign(parent, u + 60, v + 90, 62, "FABRYKA BIAŁEK", 0x8c5e38);
      break;
    }
    case "wall": {
      p.box(u, v, 34, 128, 72, 0xf0c88c, 0xca965f, 0xa77244);
      for (let i = 0; i < 8; i++)
        p.box(u - 2, v + i * 17, 38, 9, 14, 0xffdba4, 0xd4a36b, 0xb0804f, 72);
      for (let row = 0; row < 5; row++)
        for (let col = 0; col < 4; col++)
          p.box(u + 35, v + 5 + col * 29, 1, 24, 1, 0xab794a, 0xab794a, 0xab794a, 9 + row * 13);
      p.box(u - 14, v + 35, 61, 51, 109, 0xecc68e, 0xd5a26c, 0xb58150);
      p.box(u - 18, v + 31, 69, 59, 10, 0x389184, 0x2e776e, 0x205c58, 109);
      for (const dv of [44, 65]) p.box(u + 48, v + dv, 1, 7, 27, 0x514b3e, 0x514b3e, 0x514b3e, 56);
      flag(p, u + 16, v + 59, 150, 0x338c7e);
      sign(parent, u + 47, v + 90, 99, "CYTADELA", 0x916338);
      break;
    }
    case "gate": {
      for (const du of [-48, 74]) {
        p.box(u + du, v, 40, 50, 83, 0xf3cd94, 0xd7a369, 0xb27c48);
        p.cylinder(u + du + 20, v + 25, 23, 10, 0x3b9284, 83);
        const [x, y] = project(u + du + 20, v + 25, 96);
        p.g.ellipse(x, y - 7, 23, 16).fill(0x419f8e);
      }
      p.box(u - 8, v + 4, 82, 30, 26, 0xffdca5, 0xd6aa71, 0xae8050, 62);
      for (const du of [-3, 43]) {
        p.box(u + du, v + 33, 34, 5, 58, 0x449286, 0x357d72, 0x225e58);
        for (let i = 0; i < 3; i++)
          p.box(u + du, v + 39, 34, 1, 3, 0xd9ad6d, 0xd9ad6d, 0xd9ad6d, 12 + i * 18);
      }
      sign(parent, u + 33, v + 36, 79, "BRAMA TARGOWA", 0x89603c);
      break;
    }
    case "water": {
      p.box(u - 5, v - 5, 120, 90, 8, 0xedd09a, 0xc69b63, 0xa97d4e);
      p.ground(u + 3, v + 3, 104, 73, 0x3d9f99, 9);
      for (let i = 0; i < 6; i++) p.box(u + i * 19, v - 6, 9, 12, 37, 0xf1d6a2, 0xcba16d, 0xa57f51);
      p.box(u, v - 6, 110, 12, 10, 0xd3a46b, 0xae7d4c, 0x8f603a, 37);
      p.ground(u + 3, v - 3, 103, 6, 0x62c6b2, 48);
      const [x, y] = project(u + 113, v + 34, 28);
      p.g.circle(x, y, 27).stroke({ color: 0x8d633e, width: 7 });
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5;
        p.g
          .moveTo(x, y)
          .lineTo(x + Math.cos(a) * 26, y + Math.sin(a) * 26)
          .stroke({ color: 0xb88a51, width: 4 });
      }
      p.g.circle(x, y, 6).fill(0xedd194);
      sign(parent, u + 50, v + 88, 9, "OAZA CYTOZOLU", 0x447d6e);
      break;
    }
  }
  return p;
};
