import { Board } from '~/types/board';
import type { CircleItem, CustomItem, DrawItem, ImageItem, LineItem, RectangleItem, TextItem } from '~/types/item';

/**
 * Default rectangle item.
 * Requires Position, ID
 */
export const DEFAULT_RECTANGLE: RectangleItem = Object.freeze({
    isFillable: true,
    isStrokeable: true,
    size: { width: 0, height: 0 },
    borderRadius: 0,
    strokeColor: '#000000',
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeStyle: 'solid',
    version: 1,
    attachments: [],
    fillColor: '#ffffff',
    fillOpacity: 1,
    isStrokeEnabled: true,
    isFillEnabled: false,
    type: 'rectangle',
    position: { x: 0, y: 0 },
    id: '',
});

/**
 * Default diamond item
 * Requires Position, ID
 */
export const DEFAULT_DIAMOND: RectangleItem = Object.freeze({
    ...DEFAULT_RECTANGLE,
    type: 'diamond',
});

/**
 * Default circle item
 * Requires Position, ID
 */
export const DEFAULT_CIRCLE: CircleItem = Object.freeze({
    isFillable: true,
    isStrokeable: true,
    id: '',
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    strokeColor: '#000000',
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeStyle: 'solid',
    version: 1,
    attachments: [],
    fillColor: '#ffffff',
    fillOpacity: 1,
    isStrokeEnabled: true,
    isFillEnabled: false,
    type: 'circle',
});

/**
 * Default text item
 * Requires Position, ID
 */
export const DEFAULT_TEXT: TextItem = Object.freeze({
    isFillable: true,
    isStrokeable: true,
    id: '',
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    text: 'New Text',
    type: 'text',
    version: 1,
    attachments: [],
    strokeColor: '#000000',
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeStyle: 'solid',
    fillColor: '#000000',
    fillOpacity: 1,
    isStrokeEnabled: false,
    isFillEnabled: true,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Arial',
    fontEffect: 'normal',
    fontDecoration: 'none',
});

/**
 * Default line item
 * Requires Points, ID
 */
export const DEFAULT_LINE: LineItem = Object.freeze({
    isFillable: true,
    isStrokeable: true,
    points: [0, 0, 0, 0],
    isArrow: false,
    hasArrowTail: false,
    hasArrowHead: false,
    id: '',
    type: 'line',
    position: { x: 0, y: 0 },
    version: 1,
    attachments: [],
    strokeColor: '#000000',
    strokeOpacity: 1,
    strokeStyle: 'solid',
    strokeWidth: 1,
    isStrokeEnabled: true,
    fillColor: '#000000',
    fillOpacity: 1,
    isFillEnabled: true,
});

/**
 * Default arrow item
 * Requires Points, ID
 */
export const DEFAULT_ARROW: LineItem = Object.freeze({
    ...DEFAULT_LINE,
    type: 'arrow',
    isArrow: true,
    hasArrowTail: false,
    hasArrowHead: true,
});

/**
 * Default image item
 * Requires Position, ID
 */
export const DEFAULT_IMAGE: ImageItem = Object.freeze({
    id: '',
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    type: 'image',
    version: 1,
    attachments: [],
    isStrokeable: false,
    isFillable: false,
});

/**
 * Default draw item
 * Requires Points, ID
 */
export const DEFAULT_DRAW: DrawItem = Object.freeze({
    ...DEFAULT_LINE,
    type: 'draw',
    size: { width: 0, height: 0 },
});

/**
 * Default custom item
 * Requires Position, ID
 */
export const DEFAULT_CUSTOM: CustomItem = Object.freeze({
    id: '',
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    type: 'custom',
    version: 1,
    attachments: [],
    entity: 'New-Entity',
    showTooltip: false,
    displayName: {
        text: 'New-Entity',
        fontSize: 14,
        textAlign: 'left' as 'left' | 'center' | 'right',
        fontFamily: 'Arial',
        fontEffect: 'normal',
        fontDecoration: 'none' as 'none' | 'underline' | 'line-through',
    },
    lore: [],
    tooltip: {
        position: { x: 30, y: 0 },
        size: { width: 200, height: 50 },
    },
    isStrokeable: false,
    isFillable: false,
});

/**
 * Default board item
 * Requires ID
 */
export const DEFAULT_BOARD: Board = Object.freeze({
    id: '',
    name: 'New Board',
    enableGrid: true,
    snapToGrid: false,
    gridSpacing: 100,
    subGridSpacing: 20,
    snapIncrement: 5,
    showItems: false,
    theme: 'system',
    gridLineWidth: 1,
    gridLineOpacity: 0.1,
    gridSubLineWidth: 1,
    gridSubLineOpacity: 0.05,
});
