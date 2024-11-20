import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { type CircleItem, type CustomItem, type DrawItem, type Item, type RectangleItem, type TextItem } from '../../../types/item';

interface ItemSnapshotProps {
    item: Item;
}

const ItemSnapshot: React.FC<ItemSnapshotProps> = ({ item }) => {
    const [image, setImage] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage | null>(null);

    useEffect(() => {
        if (containerRef.current && !stageRef.current) {
            stageRef.current = new Konva.Stage({
                container: containerRef.current,
                width: (item as RectangleItem | TextItem | CustomItem | CircleItem).size.width,
                height: (item as RectangleItem | TextItem | CustomItem | CircleItem).size.height,
            });
            const layer = new Konva.Layer();
            stageRef.current.add(layer);
        }

        buildSnapshot();
    }, [item]);

    function buildSnapshot() {
        if (!stageRef.current) return;

        const layer: Konva.Layer = stageRef.current.findOne('Layer')!;
        layer.destroyChildren();

        if (item.type === 'draw') {
            const line = new Konva.Line({
                points: (item as DrawItem).points,
                stroke: item.strokeColor,
                strokeWidth: item.strokeWidth,
                lineCap: 'round',
                lineJoin: 'round',
                dashEnabled: item.strokeStyle !== 'solid',
                dash: item.strokeStyle === 'dashed' ? [15, 15] : [5, 5],
            });
            const rect = line.getClientRect();
            line.setAttr('width', rect.width);
            line.setAttr('height', rect.height);
            layer.add(line);
        } else if (item.type === 'text') {
            layer.add(
                new Konva.Text({
                    text: (item as TextItem).text,
                    fontSize: (item as TextItem).fontSize,
                    fontStyle: (item as TextItem).fontEffect,
                    fontFamily: (item as TextItem).fontFamily,
                    textDecoration: (item as TextItem).fontDecoration,
                    fill: item.fillColor,
                    align: (item as TextItem).textAlign,
                    stroke: item.strokeColor,
                }),
            );
        } else if (item.type === 'circle') {
            layer.add(
                new Konva.Ellipse({
                    radiusX: (item as CircleItem).size.width / 2,
                    radiusY: (item as CircleItem).size.height / 2,
                    offsetX: -((item as CircleItem).size.width / 2),
                    offsetY: -((item as CircleItem).size.height / 2),
                    stroke: item.strokeColor,
                    strokeWidth: item.strokeWidth,
                    fill: item.fillColor,
                    dashEnabled: item.strokeStyle !== 'solid',
                    dash: item.strokeStyle === 'dashed' ? [15, 15] : [5, 5],
                }),
            );
        } else if (item.type === 'rectangle') {
            layer.add(
                new Konva.Rect({
                    width: (item as CircleItem).size.width,
                    height: (item as CircleItem).size.height,
                    stroke: item.strokeColor,
                    strokeWidth: item.strokeWidth,
                    fill: item.fillColor,
                    dashEnabled: item.strokeStyle !== 'solid',
                    dash: item.strokeStyle === 'dashed' ? [15, 15] : [5, 5],
                }),
            );
        }

        layer.draw();
        if (item.type !== 'item') {
            createSnapshot();
        }
    }

    function createSnapshot() {
        if (stageRef.current) {
            const dataURL = stageRef.current.toDataURL();
            setImage(dataURL);
        }
    }

    return (
        <>
            <div ref={containerRef} style={{ width: 0, height: 0, visibility: 'hidden' }}></div>
            {image && <img src={image} alt='Item Snapshot' className='item-snapshot' />}
        </>
    );
};

export default ItemSnapshot;
