import { Application, Container, Graphics, Text } from "pixi.js";
import type { CityScene, CitySceneOptions } from "@/Types";
import { CityPen, MAP_HEIGHT, MAP_WIDTH, project } from "./cityGeometry";
import { cityLots, cityStyles, drawEnvironment } from "./cityDesign";
import { drawDistinctLandmark } from "./cityLandmarks";

export const createCityScene = (options: CitySceneOptions): CityScene => {
  const app = new Application();
  let disposed = false;
  let initialized = false;
  let places = options.places;
  let solved = options.solved;
  let selected: string | null = null;
  let animations: ((time: number) => void)[] = [];
  let time = 0;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncPlayback = () => {
    if (!initialized || disposed) return;
    if (motion.matches || document.hidden) {
      app.stop();
      if (!document.hidden) app.render();
    } else app.start();
  };
  const draw = () => {
    if (!initialized || disposed) return;
    for (const child of app.stage.removeChildren()) child.destroy({ children: true });
    animations = [];
    const city = places[0]?.cityId ?? "plant";
    const theme = cityStyles[city];
    const world = new Container();
    app.stage.addChild(world);
    const { objects, routes } = drawEnvironment(world, city);
    const markers = new Container();
    places.forEach((place, index) => {
      const [u, v] = cityLots[city][place.id];
      objects.push({
        depth: u + v + 100,
        draw: () => {
          const building = new Container();
          building.label = `building:${place.id}`;
          world.addChild(building);
          if (selected === place.id || solved.includes(place.id)) {
            const highlight = new CityPen(building);
            highlight.g
              .poly(
                [
                  project(u - 19, v - 19),
                  project(u + 145, v - 19),
                  project(u + 145, v + 118),
                  project(u - 19, v + 118),
                ].flat(),
              )
              .fill({ color: selected === place.id ? theme.accent : 0xa4e0b9, alpha: 0.17 })
              .stroke({ color: selected === place.id ? theme.accent : 0xa4e0b9, width: 2 });
          }
          const art = drawDistinctLandmark(building, place.id, u, v, city);
          building.eventMode = "static";
          building.cursor = "pointer";
          building.on("pointertap", () => options.onSelect(place.id));
          building.on("pointerenter", () => {
            art.g.alpha = 0.8;
          });
          building.on("pointerleave", () => {
            art.g.alpha = 1;
          });
          const [x, y] = project(u + 53, v + 126);
          const marker = new Graphics()
            .circle(x, y, 16)
            .fill(solved.includes(place.id) ? theme.pin : theme.light)
            .stroke({ color: theme.accent, width: 2 });
          marker.eventMode = "static";
          marker.cursor = "pointer";
          marker.on("pointertap", () => options.onSelect(place.id));
          markers.addChild(marker);
          const number = new Text({
            text: solved.includes(place.id) ? "✓" : String(index + 1).padStart(2, "0"),
            style: {
              fontFamily: "Roboto, Arial",
              fontSize: 13,
              fontWeight: "bold",
              fill: solved.includes(place.id) ? 0xffffff : 0x30444d,
            },
          });
          number.anchor.set(0.5);
          number.position.set(x, y);
          markers.addChild(number);
        },
      });
    });
    objects.sort((a, b) => a.depth - b.depth).forEach((object) => object.draw());
    for (let i = 0; i < (city === "animal" ? 7 : 4); i++) {
      const vehicle = new Container();
      vehicle.eventMode = "none";
      const p = new CityPen(vehicle);
      const color =
        city === "animal"
          ? [0x7ce3e0, 0xf1acc0, 0xb4c7ed][i % 3]
          : city === "bacteria"
            ? 0xa47547
            : 0xe1be81;
      p.box(0, 0, 22, 12, 8, color, city === "animal" ? 0x6789ad : 0xa47850, 0x56777c);
      if (city === "bacteria") p.ground(1, 0, 20, 12, 0x438d80, 17);
      else p.box(5, 1, 10, 10, 5, 0xc4e0df, 0x779a9e, 0x63848d, 8);
      world.addChild(vehicle);
      const route = routes[i % routes.length];
      const distances = route
        .slice(1)
        .map(([u, v], n) => Math.hypot(u - route[n][0], v - route[n][1]));
      const total = distances.reduce((sum, value) => sum + value, 0);
      const animate = (t: number) => {
        let distance = (t * (city === "animal" ? 36 : 18) + i * 163) % total;
        let n = 0;
        while (n < distances.length - 1 && distance > distances[n]) {
          distance -= distances[n];
          n++;
        }
        const ratio = distance / distances[n];
        const [u, v] = route[n];
        const [nu, nv] = route[n + 1];
        const [x, y] = project(
          u + (nu - u) * ratio,
          v + (nv - v) * ratio,
          city === "animal" ? 5 : 0,
        );
        vehicle.position.set(x - 580, y - 110);
      };
      animate(time);
      animations.push(animate);
    }
    world.addChild(markers);
    if (motion.matches) app.render();
  };
  const ready = app
    .init({
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
      preference: "webgl",
    })
    .then(() => {
      initialized = true;
      if (disposed) {
        app.destroy(true, { children: true });
        return;
      }
      options.host.appendChild(app.canvas);
      document.fonts.addEventListener("loadingdone", draw);
      motion.addEventListener("change", syncPlayback);
      document.addEventListener("visibilitychange", syncPlayback);
      draw();
      app.ticker.add((ticker) => {
        time += ticker.deltaMS / 1000;
        animations.forEach((animate) => animate(time));
      });
      syncPlayback();
    });
  return {
    ready,
    update(nextPlaces, nextSolved, nextSelected) {
      places = nextPlaces;
      solved = nextSolved;
      selected = nextSelected ?? null;
      draw();
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      document.fonts.removeEventListener("loadingdone", draw);
      motion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      if (initialized) app.destroy(true, { children: true });
    },
  };
};
