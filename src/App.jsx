import { motion } from 'framer-motion';
import { useViewportSize, useElementSize } from '@mantine/hooks';
import { useLayoutEffect, useMemo, useState } from 'react';

const intInRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const TEXT = 'MPQ';
const LINE_HEIGHT = 0.8;
const I = () => {
    const [stable, setStable] = useState(false);
    const [content, setContent] = useState(TEXT);
    const { width: windowWidth } = useViewportSize();
    const { ref, width: elWidth } = useElementSize();

    useLayoutEffect(() => {
        if (!elWidth || !windowWidth) return;
        if (elWidth < windowWidth) setContent((prev) => prev.concat(TEXT));
        else setStable(true);
    }, [windowWidth, elWidth]);

    const { size, fontFamily } = useMemo(() => {
        const multiplier = intInRange(2, 8);
        const size = `text-${multiplier}xl`;
        const fontFamily = 'font-sans';
        return { size, fontFamily };
    }, []);

    const { duration, x } = useMemo(() => {
        const duration = intInRange(20, 40);
        const x = [0, -elWidth];
        if (Math.random() > 0.5) x.reverse();

        return { duration, x };
    }, [elWidth]);

    const animate = stable ? 'stable' : 'initial';

    const props = {
        style: {
            lineHeight: LINE_HEIGHT,
        },
        className:
            'text-web-red uppercase font-bold italic transition-opacity whitespace-nowrap'
                .concat(' ', size)
                .concat(' ', fontFamily)
                .concat(' ', stable ? 'opacity-100' : 'opacity-0'),
        variants: {
            initial: {},
            stable: { x },
        },
        animate,
        transition: {
            x: {
                duration,
                repeat: Infinity,
                ease: 'linear',
            },
            // color: {
            //     duration: 10,
            //     repeat: Infinity,
            //     repeatType: 'reverse',
            //     ease: 'linear',
            //     delay: i * 0.5,
            // },
        },
    };

    return (
        <div className="flex justify-start">
            <motion.div ref={ref} {...props}>
                {content}
            </motion.div>
            <motion.div {...props}>{content}</motion.div>
        </div>
    );
};

const L = () => {
    const [multiplier, setMultiplier] = useState(10);
    const { height: windowHeight } = useViewportSize();
    const { ref, height: listHeight } = useElementSize();

    useLayoutEffect(() => {
        if (listHeight - 48 < windowHeight) setMultiplier((prev) => prev + 1);
    }, [listHeight, windowHeight]);

    return (
        <div ref={ref}>
            {Array.from({ length: multiplier }).map((_, i) => (
                <I key={i} i={i} />
            ))}
        </div>
    );
};

const Enter = () => {
    return (
        <div className="relative bg-white w-24 h-24 rounded-full shadow-2xl border-4 border-web-blue">
            <a
                href="/"
                className="absolute inset-0 flex items-center justify-center font-bold uppercase text-web-blue"
            >
                Enter
            </a>
        </div>
    );
};

const Reroll = ({ reroll }) => (
    <div className="relative flex items-center justify-center bg-white w-16 h-16 rounded-full shadow-2xl border-4 border-web-blue">
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
    return (
        <div key={k}>
            <div className="fixed -inset-6">
                <L />
            </div>
            <div className="fixed inset-2 flex justify-between items-end">
                <Reroll reroll={() => setK((k) => k + 1)} />
                <Enter />
            </div>
        </div>
    );
};

export default App;
