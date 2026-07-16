let manifestPromise = null;

export function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch("manifest.json").then((res) => {
      if (!res.ok) throw new Error("Impossible de charger manifest.json");
      return res.json();
    });
  }
  return manifestPromise;
}
