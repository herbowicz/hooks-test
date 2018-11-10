import { tween } from "popmotion";
import { getX, getY } from "../graph/treeLayout";

const animateMaintainingNodeCanvasPosition = (t, camera, d) => {
  const initialcamera = camera.get();
  const z = initialcamera.zoom;
  const initialX = getX(d, 0) * z;
  const initialY = getY(d, 0) * z;
  const initialZoom = initialcamera.zoom;

  const animation = tween({ from: 0, to: 1 });
  animation
    .pipe(t => ({
      x: initialcamera.x - (getX(d, t) * z - initialX),
      y: initialcamera.y - (getY(d, t) * z - initialY),
      zoom: initialZoom
    }))
    .start(camera);
  animation.pipe(x => x).start(t);
};

export default (
  t,
  camera,
  zoomHandlers,
  treeLayout,
  { addedNodes, removedNodes }
) => {
  if (addedNodes.length === 1 && removedNodes.length === 0) {
    // Keep parent in same position on screen
    const d = treeLayout.idMap.get(addedNodes[0]).parent;
    animateMaintainingNodeCanvasPosition(t, camera, d);
  } else if (addedNodes.length !== 0 || removedNodes.length !== 0) {
    zoomHandlers.resetZoom();
  }
};