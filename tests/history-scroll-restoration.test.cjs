const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { EventEmitter } = require("node:events");
const { runInNewContext } = require("node:vm");

// Exercise the real hook with deterministic browser and router events. Both
// event orders occur depending on whether Next awaits middleware on Back.
const createHarness = () => {
  const events = new EventEmitter();
  const inputs = new EventEmitter();
  const frames = new Map();
  const timers = new Map();
  const observers = [];
  let sequence = 0;
  let cleanup;
  const document = { documentElement: { scrollHeight: 3000 }, body: {} };
  const window = {
    history: { state: { key: "home" } },
    location: { href: "/home" },
    scrollX: 0,
    scrollY: 1300,
    innerHeight: 844,
    requestAnimationFrame: (fn) => {
      const id = ++sequence;
      frames.set(id, fn);
      return id;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    setTimeout: (fn) => {
      const id = ++sequence;
      timers.set(id, fn);
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    addEventListener: (type, fn) => inputs.on(type, fn),
    removeEventListener: (type, fn) => inputs.off(type, fn),
    scrollTo: ({ left, top }) => {
      window.scrollX = left;
      window.scrollY = top;
    },
  };
  class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }
    observe() {
      this.connected = true;
    }
    disconnect() {
      this.connected = false;
    }
  }
  const source = readFileSync(
    resolve(
      __dirname,
      "../src/api-manage/hooks/custom-hooks/useHistoryScrollRestoration.js"
    ),
    "utf8"
  )
    .replace(/^import .*;\r?$/gm, "")
    .replace(
      "export default useHistoryScrollRestoration;",
      "useHistoryScrollRestoration();"
    );
  runInNewContext(source, {
    window,
    document,
    ResizeObserver,
    useEffect: (fn) => {
      cleanup = fn();
    },
    useRouter: () => ({ events }),
  });
  return {
    window,
    events,
    inputs,
    timers,
    forward() {
      events.emit("routeChangeStart");
      window.history.state.key = "store";
      window.scrollY = 0;
      events.emit("routeChangeComplete");
    },
    back(popFirst) {
      window.history.state.key = "home";
      if (popFirst) inputs.emit("popstate");
      events.emit("routeChangeStart");
      if (!popFirst) inputs.emit("popstate");
      events.emit("routeChangeComplete");
    },
    resize(height) {
      document.documentElement.scrollHeight = height;
      observers
        .filter((observer) => observer.connected)
        .forEach((observer) => observer.callback());
    },
    flushFrames() {
      for (let count = 0; frames.size && count < 10; count++) {
        const batch = [...frames.values()];
        frames.clear();
        batch.forEach((fn) => fn());
      }
    },
    finish() {
      const batch = [...timers.values()];
      timers.clear();
      batch.forEach((fn) => fn());
    },
    cleanup: () => cleanup(),
  };
};

for (const popFirst of [true, false]) {
  test(`Back restores the saved entry when popstate fires ${
    popFirst ? "before" : "after"
  } routeChangeStart`, () => {
    const h = createHarness();
    h.forward();
    h.back(popFirst);
    h.flushFrames();
    assert.equal(h.window.scrollY, 1300);
    h.finish();
    h.cleanup();
    assert.equal(h.timers.size, 0);
    assert.equal(h.events.listenerCount("routeChangeComplete"), 0);
    assert.equal(h.inputs.listenerCount("popstate"), 0);
  });
}

test("Back waits for delayed lists and maintains the position during subsequent layout changes", () => {
  const h = createHarness();
  h.forward();
  h.resize(500);
  h.back(true);
  h.flushFrames();
  assert.equal(h.window.scrollY, 0);
  h.resize(3000);
  h.flushFrames();
  assert.equal(h.window.scrollY, 1300);
  h.window.scrollY = 1900;
  h.resize(3600);
  h.flushFrames();
  assert.equal(h.window.scrollY, 1300);
  h.finish();
  h.cleanup();
});

test("New user scrolling cancels restoration, including its timeout", () => {
  const h = createHarness();
  h.forward();
  h.resize(500);
  h.back(true);
  h.flushFrames();
  h.inputs.emit("wheel");
  h.window.scrollY = 200;
  h.resize(3000);
  h.flushFrames();
  h.finish();
  assert.equal(h.window.scrollY, 200);
  assert.equal(h.timers.size, 0);
  h.cleanup();
});

test("Input during navigation cancels a pending Back target before the screen commits", () => {
  const h = createHarness();
  h.forward();
  h.window.history.state.key = "home";
  h.inputs.emit("popstate");
  h.events.emit("routeChangeStart");
  h.inputs.emit("wheel");
  h.window.scrollY = 200;
  h.events.emit("routeChangeComplete");
  h.flushFrames();
  h.finish();
  assert.equal(h.window.scrollY, 200);
  h.cleanup();
  assert.equal(h.inputs.listenerCount("wheel"), 0);
});
