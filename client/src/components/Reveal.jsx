import { useRef, useEffect, useState } from 'react';

/**
 * Scroll-triggered reveal wrapper.
 * Fades in + slides up when the element enters the viewport.
 *
 * Props:
 *  - delay: stagger delay in ms (default 0)
 *  - duration: animation duration in ms (default 600)
 *  - distance: translate-y distance in px (default 24)
 *  - once: only animate once (default true)
 *  - className: extra classes on the wrapper div
 *  - as: HTML tag to render (default 'div')
 */
export default function Reveal({
    children,
    delay = 0,
    duration = 600,
    distance = 24,
    once = true,
    className = '',
    as: Tag = 'div',
    ...rest
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [once]);

    return (
        <Tag
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
                transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
                willChange: 'opacity, transform',
            }}
            {...rest}
        >
            {children}
        </Tag>
    );
}
