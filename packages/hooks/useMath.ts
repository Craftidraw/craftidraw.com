export const useMath = () => {
    const calculateAngle = (p1: { x: number; y: number }, p2: { x: number; y: number }): number =>
        Math.atan2(p2.y - p1.y, p2.x - p1.x);

    const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number =>
        Math.hypot(p2.x - p1.x, p2.y - p1.y);

    const applyOffset = (point: { x: number; y: number }, angle: number, offset: number) => ({
        x: point.x + offset * Math.cos(angle),
        y: point.y + offset * Math.sin(angle),
    });

    const getIntersection = (
        lineStart1: { x: number; y: number },
        lineEnd1: { x: number; y: number },
        lineStart2: { x: number; y: number },
        lineEnd2: { x: number; y: number },
    ) => {
        const A1 = lineEnd1.y - lineStart1.y;
        const B1 = lineStart1.x - lineEnd1.x;
        const C1 = A1 * lineStart1.x + B1 * lineStart1.y;
        const A2 = lineEnd2.y - lineStart2.y;
        const B2 = lineStart2.x - lineEnd2.x;
        const C2 = A2 * lineStart2.x + B2 * lineStart2.y;
        const det = A1 * B2 - A2 * B1;

        if (det === 0) return null;

        const x = (B2 * C1 - B1 * C2) / det;
        const y = (A1 * C2 - A2 * C1) / det;

        if (
            x >= Math.min(lineStart1.x, lineEnd1.x) &&
            x <= Math.max(lineStart1.x, lineEnd1.x) &&
            y >= Math.min(lineStart1.y, lineEnd1.y) &&
            y <= Math.max(lineStart1.y, lineEnd1.y)
        ) {
            return { x, y };
        }

        return null;
    };

    function hasIntersection(
        r1: { x: number; width: number; y: number; height: number },
        r2: { x: number; width: number; y: number; height: number },
    ) {
        return !(
            r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y
        );
    }

    // to: the shape being moved
    // origin: the other anchor that creates the line, not attached
    function getRectConnectorPoints(
        to: { x: number; y: number; width: number; height: number },
        origin: { x: number; y: number },
    ) {
        const OFFSET = 7;

        // Calculate the center of the shape
        const centerX = to.x + to.width / 2;
        const centerY = to.y + to.height / 2;

        // Calculate the angle between the origin and the center of the shape
        const angle = Math.atan2(centerY - origin.y, centerX - origin.x);

        // Calculate the potential intersection points
        const intersections = [
            { x: to.x, y: origin.y + (to.x - origin.x) * Math.tan(angle) }, // Left edge
            { x: to.x + to.width, y: origin.y + (to.x + to.width - origin.x) * Math.tan(angle) }, // Right edge
            { x: origin.x + (to.y - origin.y) / Math.tan(angle), y: to.y }, // Top edge
            { x: origin.x + (to.y + to.height - origin.y) / Math.tan(angle), y: to.y + to.height }, // Bottom edge
        ];

        // Find the closest valid intersection point
        let closestPoint = null;
        let minDistance = Infinity;

        for (const point of intersections) {
            if (point.x >= to.x && point.x <= to.x + to.width && point.y >= to.y && point.y <= to.y + to.height) {
                const distance = Math.sqrt(Math.pow(point.x - origin.x, 2) + Math.pow(point.y - origin.y, 2));
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = point;
                }
            }
        }

        // Apply offset to the closest point
        if (closestPoint) {
            const offsetX = OFFSET * Math.cos(angle);
            const offsetY = OFFSET * Math.sin(angle);
            closestPoint.x -= offsetX;
            closestPoint.y -= offsetY;
        }

        return [closestPoint?.x, closestPoint?.y];
    }

    function getEllipseConnectorPoints(
        to: { x: number; y: number; width: number; height: number },
        origin: { x: number; y: number },
    ) {
        const OFFSET = 7;

        // Calculate the center and radii of the ellipse
        const centerX = to.x + to.width / 2;
        const centerY = to.y + to.height / 2;
        const radiusX = to.width / 2;
        const radiusY = to.height / 2;

        // Calculate the angle between the origin and the center of the ellipse
        const angle = Math.atan2(origin.y - centerY, origin.x - centerX);

        // Calculate the intersection point on the ellipse
        const intersectionX = centerX + radiusX * Math.cos(angle);
        const intersectionY = centerY + radiusY * Math.sin(angle);

        // Apply offset to the intersection point
        const offsetX = OFFSET * Math.cos(angle);
        const offsetY = OFFSET * Math.sin(angle);
        const connectorPoint = {
            x: intersectionX + offsetX,
            y: intersectionY + offsetY,
        };

        return [connectorPoint.x, connectorPoint.y];
    }

    function getDiamondConnectorPoints(
        to: { x: number; y: number; width: number; height: number },
        origin: { x: number; y: number },
    ) {
        const { x, y, width, height } = to;
        const OFFSET = -7;

        // Calculate the center of the rhombus
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        // Define the vertices of the rhombus
        const vertices = [
            { x: centerX, y: y }, // Top vertex
            { x: x + width, y: centerY }, // Right vertex
            { x: centerX, y: y + height }, // Bottom vertex
            { x: x, y: centerY }, // Left vertex
        ];

        // Function to find the intersection of the line from origin to center with an edge
        function getIntersection(p1: { x: number; y: number }, p2: { x: number; y: number }) {
            const A1 = centerY - origin.y;
            const B1 = origin.x - centerX;
            const C1 = A1 * origin.x + B1 * origin.y;

            const A2 = p2.y - p1.y;
            const B2 = p1.x - p2.x;
            const C2 = A2 * p1.x + B2 * p1.y;

            const det = A1 * B2 - A2 * B1;
            if (det === 0) {
                return null; // Lines are parallel
            } else {
                const x = (B2 * C1 - B1 * C2) / det;
                const y = (A1 * C2 - A2 * C1) / det;

                // Check if the intersection point lies on the segment
                if (
                    Math.min(p1.x, p2.x) <= x &&
                    x <= Math.max(p1.x, p2.x) &&
                    Math.min(p1.y, p2.y) <= y &&
                    y <= Math.max(p1.y, p2.y)
                ) {
                    return { x, y };
                }
                return null;
            }
        }

        // Check all edges of the rhombus and find the closest intersection
        let closestPoint = null;
        let minDistance = Infinity;

        for (let i = 0; i < vertices.length; i++) {
            const next = (i + 1) % vertices.length;
            const intersection = getIntersection(vertices[i], vertices[next]);

            if (intersection) {
                const distance = Math.hypot(intersection.x - origin.x, intersection.y - origin.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = intersection;
                }
            }
        }

        if (closestPoint) {
            const angle = Math.atan2(closestPoint.y - origin.y, closestPoint.x - origin.x);
            closestPoint.x += OFFSET * Math.cos(angle);
            closestPoint.y += OFFSET * Math.sin(angle);
        }

        return closestPoint ? [closestPoint.x, closestPoint.y] : [centerX, centerY];
    }

    return {
        calculateAngle,
        calculateDistance,
        applyOffset,
        getRectConnectorPoints,
        getEllipseConnectorPoints,
        getDiamondConnectorPoints,
        hasIntersection,
        getIntersection
    };
};
