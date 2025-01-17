import { Line } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';

interface AnimatedConnectorProps {
    points: number[];
    stroke?: string;
    strokeWidth?: number;
    dashOffset?: number;
}

const AnimatedConnector = ({ points, stroke = '#50b498', strokeWidth = 1, dashOffset = 0 }: AnimatedConnectorProps) => {
    const [offset, setOffset] = useState(dashOffset);
    const animationRef = useRef<Konva.Animation | null>(null);

    useEffect(() => {
        const animation = new Konva.Animation((frame) => {
            if (!frame) return;
            setOffset((prev) => (prev + frame.timeDiff / 50) % 20);
            return true;
        });
        animationRef.current = animation;
        animation.start();

        return () => {
            animation.stop();
        };
    }, []);

    return (
        <Line
            points={points}
            stroke={stroke}
            strokeWidth={strokeWidth}
            dash={[5, 5]}
            opacity={0.5}
            dashOffset={offset}
        />
    );
};

export default AnimatedConnector;
