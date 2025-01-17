import { z } from 'zod';
import { type Item } from "~/types/item";

const PositionSchema = z.object({
    x: z.number(),
    y: z.number()
});

const SizeSchema = z.object({
    width: z.number(),
    height: z.number()
});

const LibraryImageSchema = z.object({
    id: z.number(),
    name: z.string(),
    data: z.string(),
    date: z.string(),
    size: z.number()
});

const TooltipLineSchema = z.object({
    text: z.string(),
    textAlign: z.enum(['left', 'center', 'right']).optional(),
    fontSize: z.number(),
    fontFamily: z.string().optional(),
    fontEffect: z.string().optional(),
    fontDecoration: z.enum(['none', 'underline', 'line-through']).optional()
});

const TooltipSettingsSchema = z.object({
    strokeColor: z.string().optional(),
    strokeStyle: z.string().optional(),
    strokeWidth: z.number().optional(),
    isStrokeEnabled: z.boolean().optional(),
    fillColor: z.string().optional(),
    isFillEnabled: z.boolean().optional()
});

const LibraryTooltipConfigurationSchema = z.object({
    id: z.number(),
    name: z.string(),
    settings: TooltipSettingsSchema
});

const StrokePropertiesSchema = z.object({
    strokeColor: z.string().optional(),
    strokeOpacity: z.number().optional(),
    strokeWidth: z.number().optional(),
    strokeStyle: z.string().optional(),
    isStrokeEnabled: z.boolean().optional()
});

const FillPropertiesSchema = z.object({
    fillColor: z.string().optional(),
    fillOpacity: z.number().optional(),
    isFillEnabled: z.boolean().optional()
});

const AttachmentSchema = z.object({
    connector: z.string()
});

const BaseItemSchema = z.object({
    id: z.string(),
    type: z.string(),
    position: PositionSchema,
    version: z.number(),
    isStrokeable: z.boolean(),
    isFillable: z.boolean(),
    attachments: z.array(AttachmentSchema).optional()
}).merge(StrokePropertiesSchema).merge(FillPropertiesSchema);

const RectangleSchema = BaseItemSchema.extend({
    type: z.literal('rectangle'),
    size: SizeSchema,
    borderRadius: z.number().optional()
});

const CircleSchema = BaseItemSchema.extend({
    type: z.literal('circle'),
    size: SizeSchema
});

const ImageSchema = BaseItemSchema.extend({
    type: z.literal('image'),
    size: SizeSchema,
    borderRadius: z.number().optional(),
    image: LibraryImageSchema.optional()
});

const DiamondSchema = BaseItemSchema.extend({
    type: z.literal('diamond'),
    size: SizeSchema,
    borderRadius: z.number().optional()
});

const TextSchema = BaseItemSchema.extend({
    type: z.literal('text'),
    size: SizeSchema,
    text: z.string(),
    textAlign: z.enum(['left', 'center', 'right']),
    fontSize: z.number(),
    fontFamily: z.string().optional(),
    fontEffect: z.enum(['normal', 'bold', 'italic']).optional(),
    fontDecoration: z.enum(['none', 'underline', 'line-through']).optional()
});

const LineSchema = BaseItemSchema.extend({
    type: z.literal('line'),
    points: z.array(z.number()),
    isArrow: z.boolean(),
    hasArrowTail: z.boolean().optional(),
    hasArrowHead: z.boolean().optional(),
    headConnector: z.object({ connected: z.string() }).optional(),
    tailConnector: z.object({ connected: z.string() }).optional()
});

const ArrowSchema = BaseItemSchema.extend({
    type: z.literal('arrow'),
    points: z.array(z.number()),
    isArrow: z.boolean(),
    hasArrowTail: z.boolean().optional(),
    hasArrowHead: z.boolean().optional(),
    headConnector: z.object({ connected: z.string() }).optional(),
    tailConnector: z.object({ connected: z.string() }).optional()
});

const DrawSchema = BaseItemSchema.extend({
    type: z.literal('draw'),
    size: SizeSchema,
    points: z.array(z.number())
});

const CustomSchema = BaseItemSchema.extend({
    type: z.literal('custom'),
    size: SizeSchema,
    entity: z.string(),
    image: LibraryImageSchema.optional(),
    showTooltip: z.boolean().optional(),
    displayName: TooltipLineSchema.optional(),
    lore: z.array(TooltipLineSchema).optional(),
    tooltip: z.object({
        position: PositionSchema,
        size: SizeSchema,
        config: LibraryTooltipConfigurationSchema.optional()
    }),
});

const ItemSchema = z.discriminatedUnion('type', [
    RectangleSchema,
    CircleSchema,
    ImageSchema,
    DiamondSchema,
    TextSchema,
    LineSchema,
    ArrowSchema,
    DrawSchema,
    CustomSchema
]);
interface ValidationResult {
    status: boolean;
    item: Item | null;
    errors?: string[];
}

export const validateItem = (itemStr: string): ValidationResult => {
    try {
        const parsedItem = JSON.parse(itemStr);
        const result = ItemSchema.safeParse(parsedItem);

        if (result.success) {
            return {
                status: true,
                item: result.data as Item
            };
        }

        return {
            status: false,
            item: null,
            errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
    } catch (error) {
        return {
            status: false,
            item: null,
            errors: ['Failed to parse item JSON']
        };
    }
};

export const fixItem = (itemStr: string): Item | false => {
    try {
        const parsed = JSON.parse(itemStr);
        
        const propertyMigrations: Record<string, { path: string[], transform?: (value: any) => any }> = {
            x: { path: ['position', 'x'] },
            y: { path: ['position', 'y'] },
            width: { path: ['size', 'width'] },
            height: { path: ['size', 'height'] },
            strokeEnabled: { path: ['isStrokeEnabled'] },
            fillEnabled: { path: ['isFillEnabled'] },
        };

        const setNestedProperty = (obj: any, path: string[], value: any) => {
            const lastKey = path[path.length - 1];
            let current = obj;
            
            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (!current[key]) {
                    current[key] = {};
                }
                current = current[key];
            }
            
            current[lastKey] = value;
        };

        Object.entries(propertyMigrations).forEach(([oldKey, { path, transform }]) => {
            if (oldKey in parsed) {
                const value = transform ? transform(parsed[oldKey]) : parsed[oldKey];
                setNestedProperty(parsed, path, value);
                delete parsed[oldKey];
            }
        });

        const defaultValues = {
            version: 1,
            isStrokeable: true,
            isFillable: true,
            attachments: [],
            strokeColor: '#000000',
            strokeOpacity: 1,
            strokeWidth: 2,
            strokeStyle: 'solid',
            isStrokeEnabled: true,
            fillColor: '#ffffff',
            fillOpacity: 1,
            isFillEnabled: false,
            position: { x: 0, y: 0 },
            size: { width: 100, height: 100 }
        };

        const typeSpecificDefaults = {
            line: {
                points: [0, 0, 100, 0],
                isArrow: false
            },
            arrow: {
                points: [0, 0, 100, 0],
                isArrow: true,
                hasArrowHead: true
            },
            diamond: {
                size: { width: 100, height: 100 },
                borderRadius: 0
            },
            text: {
                text: '',
                textAlign: 'left' as const,
                fontSize: 16,
                fontFamily: 'Arial',
                fontEffect: 'normal',
                fontDecoration: 'none' as const
            },
            custom: {
                entity: '',
                showTooltip: false,
                displayName: {
                    text: '',
                    fontSize: 16,
                    textAlign: 'left' as const
                },
                lore: [],
                tooltip: {
                    position: { x: 20, y: 0 },
                    size: { width: 200, height: 50 },
                    config: undefined
                }
            }
        };

        const deepMerge = (target: any, source: any) => {
            Object.keys(source).forEach(key => {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    deepMerge(target[key], source[key]);
                } else {
                    if (target[key] === undefined || target[key] === null) {
                        target[key] = source[key];
                    }
                }
            });
            return target;
        };

        const typeDefaults = typeSpecificDefaults[parsed.type as keyof typeof typeSpecificDefaults] || {};
        const itemWithTypeDefaults = deepMerge(parsed, typeDefaults);

        const itemWithDefaults = deepMerge(itemWithTypeDefaults, defaultValues);

        const result = ItemSchema.safeParse(itemWithDefaults);
        return result.success ? result.data as Item : false;

    } catch {
        return false;
    }
};