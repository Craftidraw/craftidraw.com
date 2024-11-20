import Konva from 'konva';
import type {
    CircleItem,
    CustomItem,
    DrawItem,
    ImageItem,
    Item,
    LineItem,
    RectangleItem,
    TextItem,
} from '~/types/item';

export function returnItemElement(item: Item, scalingFactor?: number) {
    if (!scalingFactor) scalingFactor = 1;
    if (item.type === 'draw') {
        const scaledPoints = (item as DrawItem).points.map((point) => point * scalingFactor);
        return new Konva.Line({
            points: scaledPoints,
            stroke: item.strokeColor,
            strokeWidth: (item.strokeWidth ?? 1) * scalingFactor,
            lineCap: 'round',
            lineJoin: 'round',
            dashEnabled: item.strokeStyle !== 'solid',
            dash:
                item.strokeStyle === 'dashed'
                    ? [15 * scalingFactor, 15 * scalingFactor]
                    : [5 * scalingFactor, 5 * scalingFactor],
        });
    } else if (item.type === 'text') {
        return new Konva.Text({
            text: (item as TextItem).text,
            fontSize: (item as TextItem).fontSize * scalingFactor,
            fontStyle: (item as TextItem).fontEffect,
            fontFamily: (item as TextItem).fontFamily,
            textDecoration: (item as TextItem).fontDecoration,
            fill: item.isFillEnabled ? item.fillColor : 'transparent',
            align: (item as TextItem).textAlign,
            stroke: item.isStokeEnabled ? item.strokeColor : 'transparent',
            x: item.x * scalingFactor,
            y: item.y * scalingFactor,
        });
    } else if (item.type === 'circle') {
        return new Konva.Ellipse({
            radiusX: ((item as CircleItem).width / 2) * scalingFactor,
            radiusY: ((item as CircleItem).height / 2) * scalingFactor,
            offsetY: -((item as CircleItem).height / 2) * scalingFactor,
            offsetX: -((item as CircleItem).width / 2) * scalingFactor,
            x: (item as CircleItem).x * scalingFactor,
            y: (item as CircleItem).y * scalingFactor,
            stroke: item.isStokeEnabled ? item.strokeColor : 'transparent',
            strokeWidth: (item.strokeWidth ?? 1) * scalingFactor,
            fill: item.isFillEnabled ? item.fillColor : 'transparent',
            dashEnabled: item.strokeStyle !== 'solid',
            dash:
                item.strokeStyle === 'dashed'
                    ? [15 * scalingFactor, 15 * scalingFactor]
                    : [5 * scalingFactor, 5 * scalingFactor],
        });
    } else if (item.type === 'rectangle') {
        return new Konva.Rect({
            width: (item as RectangleItem).width * scalingFactor,
            height: (item as RectangleItem).height * scalingFactor,
            x: (item as RectangleItem).x * scalingFactor,
            y: (item as RectangleItem).y * scalingFactor,
            stroke: item.isStokeEnabled ? item.strokeColor : 'transparent',
            strokeWidth: (item.strokeWidth ?? 1) * scalingFactor,
            fill: item.isFillEnabled ? item.fillColor : 'transparent',
            cornerRadius: (item as RectangleItem).borderRadius
                ? (item as RectangleItem).borderRadius! * scalingFactor
                : 0,
            dashEnabled: item.strokeStyle !== 'solid',
            dash:
                item.strokeStyle === 'dashed'
                    ? [15 * scalingFactor, 15 * scalingFactor]
                    : [5 * scalingFactor, 5 * scalingFactor],
        });
    } else if (item.type === 'image' || item.type === 'custom') {
        const imageItem = item as ImageItem | CustomItem;
        if (imageItem.image) {
            const image = new Image();
            image.src = imageItem.image.data;
            return new Konva.Image({
                image: image,
                x: imageItem.x * scalingFactor,
                y: imageItem.y * scalingFactor,
                width: imageItem.width * scalingFactor,
                height: imageItem.height * scalingFactor,
            });
        } else {
            return new Konva.Rect({
                x: imageItem.x * scalingFactor,
                y: imageItem.y * scalingFactor,
                width: imageItem.width * scalingFactor,
                height: imageItem.height * scalingFactor,
                fill: 'lightgray',
                stroke: 'gray',
            });
        }
    } else if (item.type === 'arrow' || item.type === 'line') {
        return new Konva.Arrow({
            points: (item as LineItem).points.map((point) => point * scalingFactor),
            stroke: item.isStokeEnabled ? item.strokeColor : 'transparent',
            strokeWidth: (item.strokeWidth ?? 1) * scalingFactor,
            fill: item.isFillEnabled ? item.fillColor : 'transparent',
            lineCap: 'round',
            lineJoin: 'round',
            dashEnabled: item.strokeStyle !== 'solid',
            dash:
                item.strokeStyle === 'dashed'
                    ? [15 * scalingFactor, 15 * scalingFactor]
                    : [5 * scalingFactor, 5 * scalingFactor],
            pointerAtBeginning: (item as LineItem).hasArrowTail,
            pointerAtEnding: (item as LineItem).hasArrowHead,
            pointerLength: 10 * scalingFactor,
            pointerWidth: 10 * scalingFactor,
        });
    } else if (item.type === 'diamond') {
        const rectItem = item as RectangleItem;
        const points = [
            (rectItem.width / 2) * scalingFactor,
            0,
            rectItem.width * scalingFactor,
            (rectItem.height / 2) * scalingFactor,
            (rectItem.width / 2) * scalingFactor,
            rectItem.height * scalingFactor,
            0,
            (rectItem.height / 2) * scalingFactor,
            (rectItem.width / 2) * scalingFactor,
            0,
        ];
        return new Konva.Line({
            x: rectItem.x * scalingFactor,
            y: rectItem.y * scalingFactor,
            points: points,
            stroke: item.isStokeEnabled ? item.strokeColor : 'transparent',
            strokeWidth: (item.strokeWidth ?? 1) * scalingFactor,
            fill: item.isFillEnabled ? item.fillColor : 'transparent',
            lineCap: 'round',
            lineJoin: 'round',
            closed: true,
            dashEnabled: item.strokeStyle !== 'solid',
            dash:
                item.strokeStyle === 'dashed'
                    ? [15 * scalingFactor, 15 * scalingFactor]
                    : [5 * scalingFactor, 5 * scalingFactor],
        });
    }
}