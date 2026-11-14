import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { createCityScene } from "@/pixi/createCityScene";

const { app } = vi.hoisted(() => ({
  app: {
    init: vi.fn<() => Promise<void>>(),
    destroy: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    render: vi.fn(),
    canvas: {},
    stage: { addChild: vi.fn(), removeChildren: vi.fn(() => []) },
    ticker: { add: vi.fn() },
  },
}));

// Exercise scene lifecycle without allocating a WebGL context in Node.
vi.mock("pixi.js", () => ({
  Application: class {
    constructor() {
      return app;
    }
  },
  Container: class {
    position = { set: vi.fn() };
    addChild = vi.fn();
  },
  Graphics: class {},
  Text: class {},
}));
vi.mock("@/pixi/cityGeometry", () => ({
  MAP_HEIGHT: 100,
  MAP_WIDTH: 100,
  project: () => [0, 0],
  CityPen: class {
    box() {}
    ground() {}
  },
}));
vi.mock("@/pixi/cityDesign", () => ({
  cityLots: { plant: {} },
  cityStyles: { plant: {} },
  drawEnvironment: () => ({
    objects: [],
    routes: [
      [
        [0, 0],
        [100, 100],
      ],
    ],
  }),
}));
vi.mock("@/pixi/cityLandmarks", () => ({ drawDistinctLandmark: vi.fn() }));

let motion: EventTarget & { matches: boolean };
let page: EventTarget & { hidden: boolean; fonts: EventTarget };
const makeScene = () =>
  createCityScene({
    host: { appendChild: vi.fn() } as unknown as HTMLDivElement,
    places: [],
    solved: [],
    onSelect: vi.fn(),
  });

beforeEach(() => {
  vi.clearAllMocks();
  app.init.mockResolvedValue(undefined);
  motion = Object.assign(new EventTarget(), { matches: false });
  page = Object.assign(new EventTarget(), { hidden: false, fonts: new EventTarget() });
  vi.stubGlobal("window", { matchMedia: () => motion, devicePixelRatio: 1 });
  vi.stubGlobal("document", page);
});
afterEach(() => vi.unstubAllGlobals());

describe("cykl życia sceny", () => {
  it("reaguje na zmianę ograniczenia ruchu i widoczności karty", async () => {
    const scene = makeScene();
    await scene.ready;
    expect(app.start).toHaveBeenCalledTimes(1);

    motion.matches = true;
    motion.dispatchEvent(new Event("change"));
    expect(app.stop).toHaveBeenCalledTimes(1);
    expect(app.render).toHaveBeenCalledTimes(1);

    motion.matches = false;
    motion.dispatchEvent(new Event("change"));
    expect(app.start).toHaveBeenCalledTimes(2);

    page.hidden = true;
    page.dispatchEvent(new Event("visibilitychange"));
    expect(app.stop).toHaveBeenCalledTimes(2);
    page.hidden = false;
    page.dispatchEvent(new Event("visibilitychange"));
    expect(app.start).toHaveBeenCalledTimes(3);
    scene.destroy();
  });

  it("sprząta zasoby raz i usuwa obserwatory po zniszczeniu", async () => {
    const removeMotion = vi.spyOn(motion, "removeEventListener");
    const removeVisibility = vi.spyOn(page, "removeEventListener");
    const removeFonts = vi.spyOn(page.fonts, "removeEventListener");
    const scene = makeScene();
    await scene.ready;
    scene.destroy();
    scene.destroy();
    expect(app.destroy).toHaveBeenCalledTimes(1);
    expect(removeMotion).toHaveBeenCalledWith("change", expect.any(Function));
    expect(removeVisibility).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(removeFonts).toHaveBeenCalledWith("loadingdone", expect.any(Function));
    page.dispatchEvent(new Event("visibilitychange"));
    expect(app.start).toHaveBeenCalledTimes(1);
  });

  it("sprząta opóźnioną inicjalizację po odmontowaniu komponentu", async () => {
    let finish!: () => void;
    app.init.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const scene = makeScene();
    scene.destroy();
    expect(app.destroy).not.toHaveBeenCalled();
    finish();
    await scene.ready;
    expect(app.destroy).toHaveBeenCalledTimes(1);
    expect(app.start).not.toHaveBeenCalled();
    expect(app.ticker.add).not.toHaveBeenCalled();
  });
});
