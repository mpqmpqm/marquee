import { motion } from 'framer-motion';
import { useViewportSize, useElementSize } from '@mantine/hooks';
import { useLayoutEffect, useMemo, useState } from 'react';

const intInRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const degreeToRadian = (degrees) => degrees * (Math.PI / 180);

const TEXT = 'MPQ';
const LINE_HEIGHT = 0.8;
const R = -15;
const I = ({ text = '' }) => {
    const [stable, setStable] = useState(false);
    const [content, setContent] = useState(text);
    const { width: windowWidth } = useViewportSize();
    const { ref, width: elWidth } = useElementSize();

    useLayoutEffect(() => {
        if (!elWidth) return;
        const { top, height } = ref.current.getBoundingClientRect();
        const y = top + height;
        const topIntersectH = Math.ceil(y / Math.cos(degreeToRadian(90 + R)));
        const rightIntersectH = Math.ceil(
            windowWidth / Math.cos(degreeToRadian(R))
        );
        const h = Math.min(topIntersectH, rightIntersectH);
        if (elWidth < h) {
            const multiplier = Math.ceil(h / elWidth);
            setContent((prev) => prev.concat(text.repeat(multiplier)));
            setStable(false);
        } else setStable(true);
    }, [windowWidth, elWidth, ref, text]);

    const { size, fontFamily } = useMemo(() => {
        const multiplier = intInRange(2, 8);
        const size = `text-${multiplier}xl`;
        const fontFamily = 'font-sans';
        return { size, fontFamily };
    }, []);

    const { duration, x } = useMemo(() => {
        const duration = intInRange(15, 35);
        const x = [0, -elWidth];
        if (Math.random() > 0.5) x.reverse();

        return { duration, x };
    }, [elWidth]);

    const props = {
        style: {
            lineHeight: LINE_HEIGHT,
            fontFamily: 'PP Neue Montreal',
            transformOrigin: '0 100%',
        },
        className:
            'text-web-red uppercase font-semibold italic transition-opacity whitespace-nowrap tracking-tighter will-change-transform select-none'
                .concat(' ', size)
                .concat(' ', fontFamily)
                .concat(' ', stable ? 'opacity-100' : 'opacity-0'),
        variants: {
            initial: {},
            stable: { x },
        },
        animate: stable ? 'stable' : undefined,
        transition: {
            x: {
                duration,
                repeat: Infinity,
                ease: 'linear',
            },
        },
    };

    return (
        <div
            className="flex justify-start"
            style={{
                transform: `rotate(${R}deg)`,
                transformOrigin: '0 100%',
            }}
            key={content}
        >
            <motion.div ref={ref} {...props} key={content + 'i'}>
                {content}
            </motion.div>
            <motion.div {...props} key={content + 'j'}>
                {content}
            </motion.div>
        </div>
    );
};

const L = ({ text }) => {
    const [multiplier, setMultiplier] = useState(10);
    const { height: windowHeight, width: windowWidth } = useViewportSize();
    const { ref, height: listHeight } = useElementSize();

    useLayoutEffect(() => {
        const t = windowWidth * Math.tan(degreeToRadian(-R));
        const requiredHeight = windowHeight + t;
        if (listHeight < requiredHeight) setMultiplier((prev) => prev + 1);
    }, [listHeight, windowHeight, windowWidth]);

    return (
        <div ref={ref}>
            {Array.from({ length: multiplier }).map((_, i) => (
                <I key={i + text} i={i} text={text} />
            ))}
        </div>
    );
};

const Reroll = ({ reroll }) => (
    <div className="relative flex items-center justify-center w-16 h-16 bg-white border-4 rounded-full shadow-2xl border-web-blue">
        <button
            onClick={reroll}
            className="absolute inset-0 flex items-center justify-center font-bold uppercase text-web-blue"
        >
            <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect width="12" height="12" x="2" y="10" rx="2" ry="2" />
                <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" />
                <path d="M6 18h.01" />
                <path d="M10 14h.01" />
                <path d="M15 6h.01" />
                <path d="M18 9h.01" />
            </svg>
        </button>
    </div>
);

const App = () => {
    const [k, setK] = useState(0);
    const [text, setText] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('t') || TEXT;
    });
    const { height: windowHeight } = useViewportSize();

    return (
        <div className="fixed inset-0">
            <L text={text} key={text + k} />
            <div className="absolute flex items-end justify-center gap-4 inset-2">
                <Reroll reroll={() => setK((k) => k + 1)} />
                <input
                    type="text"
                    className="w-64 h-16 px-2 py-0 text-xl border-4 rounded-md border-web-blue"
                    value={text}
                    onChange={(e) => {
                        window.history.replaceState(
                            null,
                            null,
                            `?t=${e.target.value}`
                        );
                        setText(e.target.value);
                    }}
                    onBlur={() => {
                        if (window.innerHeight < windowHeight)
                            requestAnimationFrame(() => setK((k) => k + 1));
                    }}
                />
            </div>
        </div>
    );
};

export default App;
