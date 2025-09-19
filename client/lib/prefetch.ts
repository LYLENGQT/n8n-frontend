// Simple route prefetch helpers for dynamic imports

export function prefetchGenerate() {
  return import("../pages/Generate");
}

export function prefetchHistory() {
  return import("../pages/History");
}

export function prefetchLibrary() {
  return import("../pages/Library");
}

export function prefetchSettings() {
  return import("../pages/Settings");
}

export function prefetchAllIdle() {
  const schedule = (cb: () => void) => {
    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(cb);
    } else {
      setTimeout(cb, 500);
    }
  };
  schedule(() => {
    prefetchHistory();
    prefetchLibrary();
    prefetchSettings();
  });
}



