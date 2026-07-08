import { useRef, useState, type PointerEvent } from 'react'
import './CompanionWidget.css'

type insights = {id:string; read:boolean};

export default function CompanionWidget({ pendingAiRequest, activityCaptureStatus, hasUnreadInsights }: { pendingAiRequest: boolean; activityCaptureStatus: string; hasUnreadInsights: insights[] }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const hasUnreadInsightsFlag = hasUnreadInsights.some((insight) => !insight.read);
    const offset = useRef({ x: 0, y: 0 });
    const [tempPosition, setTempPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);

        // First drag ever: position is still null, so measure where the
        // widget actually is on screen right now (wherever the CSS put it)
        // instead of guessing/hardcoding that location.
        const rect = e.currentTarget.getBoundingClientRect();
        const currentPosition = position ?? { x: rect.left, y: rect.top };

        setTempPosition({
            x: position?.x ?? rect.left,
            y: position?.y ?? rect.top
        });
        // Calculate the difference between click point and element top/left
        offset.current = {
        x: e.clientX - currentPosition.x,
        y: e.clientY - currentPosition.y
        };

        if (!position) {
            setPosition(currentPosition);
        }
        

        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
 
        setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
        });
    };

    const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };
    
    const widgetClassName = [
        'companion-widget',
        isHovered && 'companion-widget--hovered',
        isExpanded && 'companion-widget--expanded',
        pendingAiRequest && 'companion-widget--pending',
        (activityCaptureStatus === 'error' || activityCaptureStatus === 'permissionDenied') && 'companion-widget--error',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={widgetClassName}
            style={position ? { left: position.x, top: position.y, bottom: 'auto', right: 'auto' } : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {(position.x === tempPosition.x && position.y === tempPosition.y) ? setIsExpanded(!isExpanded) : setIsExpanded(isExpanded)}}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}>
        {hasUnreadInsightsFlag && <span className="companion-widget__badge" />}
        </div>
    );
}