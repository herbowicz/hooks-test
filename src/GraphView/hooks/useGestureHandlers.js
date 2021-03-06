import { useMemo } from "react";
import useSelectionRectangle from "./useSelectionRectangle";
import useD3MomentumZoom from "../../animation/useD3MomentumZoom";
import createClickRecognizer from "../../animation/gestures/createClickRecognizer";
import { getGraphCoordinatesForEvent } from "../../graph/canvasUtil";

export default (
  ref,
  { objectAtPoint, onSelect, onRectangleSelected, onBackgroundClicked }
) => {
  const clickRecognizer = useMemo(createClickRecognizer);

  const camera = useD3MomentumZoom(ref, {
    filter(e) {
      if (e.type === "mousedown" && e.button === 0) {
        if (e.ctrlKey) {
          startSelectionRectangle(e);
          return false;
        }

        const graphCoords = getGraphCoordinatesForEvent(camera, e);
        const object =
          graphCoords != null && objectAtPoint != null
            ? objectAtPoint(graphCoords)
            : null;
        if (object != null) {
          const isAdditive = e.shiftKey;
          if (onSelect != null) onSelect(object, isAdditive);
          return false;
        }
      }

      return true;
    },
    onStartZoom: clickRecognizer.begin,
    onZoom: clickRecognizer.update,
    onEndZoom: e => {
      const didClick = clickRecognizer.finalize();
      if (didClick && onBackgroundClicked != null) onBackgroundClicked();
    }
  });

  const { selectionRectangle, startSelectionRectangle } = useSelectionRectangle(
    ref,
    camera,
    { onRectangleSelected }
  );

  return { camera, selectionRectangle };
};
