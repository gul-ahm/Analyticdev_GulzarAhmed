"use client";

// Airplane window gallery, from 21st.dev by CCgather.
// Adapted here: shadcn tokens swapped for slate, dark-mode variants dropped
// (this site is light only), and a renderDetails prop so a window opens onto a
// panel of real detail instead of a one-line caption.

import * as React from "react";

export interface WindowItem {
    src: string;
    alt?: string;
    /** Shown under the window. */
    title?: string;
    /** Second line under the title. */
    location?: string;
    caption?: string;
    /** Anything else the details panel needs. */
    detail?: unknown;
}

type GalleryDivProps = React.ComponentProps<"div">;

export interface AirplaneWindowGalleryProps extends GalleryDivProps {
    onChange?: never;
    items: WindowItem[];
    /** How many cabin windows sit in the wall, 2 to 5. */
    windows?: number;
    interval?: number;
    autoplay?: boolean;
    /** Seconds for the view to drift once across a window. 0 keeps it still. */
    drift?: number;
    shadeDuration?: number;
    firstRow?: number;
    onLookOut?: (index: number | null) => void;
    ref?: GalleryDivProps["ref"];
    activeWindow?: number | null;
    onActiveWindowChange?: (index: number | null) => void;
    /** Replaces the caption block once a window is open. */
    renderDetails?: (item: WindowItem) => React.ReactNode;
}

const WINDOW_ASPECT = 0.72;
const LABEL_SPACE_PX = 104;
const VIEW_SCALE = 1.35;
const OPEN_AT = 0.09;
const START_SHADE = 0.55;
const FLIGHT_EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

function cx(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}

function Glass({
    item,
    shade,
    shadeMs,
    viewRef,
}: {
    item: WindowItem | undefined;
    shade: number;
    shadeMs: number;
    viewRef?: (node: HTMLImageElement | null) => void;
}) {
    const [loadedSrc, setLoadedSrc] = React.useState(null as string | null);
    const loaded = item !== undefined && loadedSrc === item.src;
    // These views are preloaded, so a cached image can finish loading before
    // React attaches onLoad. Ask the element itself rather than wait for it.
    const markLoaded = (node: HTMLImageElement | null) => {
        if (node?.complete && node.naturalWidth > 0) setLoadedSrc(node.getAttribute("src"));
    };
    return (
        <span data-glass className="absolute inset-[7.5%] overflow-hidden rounded-[44%/32%] bg-slate-200 shadow-inner shadow-slate-900/35">
            {item && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    ref={(node) => {
                        viewRef?.(node);
                        markLoaded(node);
                    }}
                    src={item.src}
                    alt={item.alt ?? item.title ?? ""}
                    data-view
                    draggable={false}
                    onLoad={(event) => setLoadedSrc(event.currentTarget.getAttribute("src"))}
                    className="absolute inset-y-0 left-0 h-full max-w-none object-cover transition-opacity duration-500"
                    style={{ width: `${VIEW_SCALE * 100}%`, opacity: loaded ? 1 : 0 }}
                />
            )}
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-slate-900/20" />
            <span
                aria-hidden
                data-shade
                className="absolute inset-x-0 top-0 h-full ease-[cubic-bezier(0.45,0,0.2,1)]"
                style={{
                    transform: `translateY(${-(1 - OPEN_AT) * (1 - shade) * 100}%)`,
                    transitionProperty: "transform",
                    transitionDuration: `${shadeMs}ms`,
                }}
            >
                <span className="absolute inset-0 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" />
                <span className="absolute inset-x-0 bottom-0 h-[9%] bg-gradient-to-b from-slate-300 to-slate-400/60 shadow-sm shadow-slate-900/25">
                    <span className="absolute left-1/2 top-1/2 h-[34%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/25" />
                </span>
            </span>
        </span>
    );
}

export function AirplaneWindowGallery({
    items,
    windows = 2,
    interval = 3200,
    autoplay = false,
    drift = 18,
    shadeDuration = 650,
    firstRow = 12,
    onLookOut,
    activeWindow,
    onActiveWindowChange,
    renderDetails,
    ref,
    className,
    style,
    ...rest
}: AirplaneWindowGalleryProps) {
    const count = Math.max(2, Math.min(5, Math.round(windows)));
    const total = items.length;
    const [slots, setSlots] = React.useState(() => Array.from({ length: count }, (_, k) => (total > 0 ? k % total : 0)));
    const [shades, setShades] = React.useState(() => Array.from({ length: count }, () => START_SHADE));
    const [localLookingAt, setLookingAt] = React.useState(null as number | null);
    const requestedWindow = activeWindow === undefined ? localLookingAt : activeWindow !== null && Number.isInteger(activeWindow) && activeWindow >= 0 && activeWindow < count ? activeWindow : null;
    // Retain the scene while a controlled null plays the journey back to the seat.
    const [retainedWindow, setRetainedWindow] = React.useState(requestedWindow);
    const lookingAt = requestedWindow ?? retainedWindow;
    const [flight, setFlight] = React.useState("entering");
    const [reducedMotion, setReducedMotion] = React.useState(false);
    const cursor = React.useRef(count);
    const slotsRef = React.useRef(slots);
    slotsRef.current = slots;
    const turn = React.useRef(0);
    const windowRefs = React.useRef([] as (HTMLButtonElement | null)[]);
    const viewRefs = React.useRef([] as (HTMLImageElement | null)[]);
    const lookRef = React.useRef(null as HTMLDivElement | null);
    const lookViewRef = React.useRef(null as HTMLImageElement | null);
    const maskRef = React.useRef(null as HTMLDivElement | null);
    const captionRef = React.useRef(null as HTMLDivElement | null);
    const animations = React.useRef([] as Animation[]);
    const frameFlight = React.useRef(null as Animation | null);
    const finishReturn = React.useRef(null as (() => void) | null);
    const closing = React.useRef(false);
    const shadeMs = reducedMotion ? 0 : shadeDuration;

    React.useEffect(() => {
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onMotion = () => setReducedMotion(motion.matches);
        onMotion();
        motion.addEventListener("change", onMotion);
        return () => motion.removeEventListener("change", onMotion);
    }, []);

    React.useEffect(() => {
        setSlots(Array.from({ length: count }, (_, k) => (total > 0 ? k % total : 0)));
        setShades(Array.from({ length: count }, () => START_SHADE));
        cursor.current = count;
        turn.current = 0;
        const timers = Array.from({ length: count }, (_, k) =>
            window.setTimeout(() => setShades((prev) => prev.map((value, i) => (i === k ? 0 : value))), 150 + k * 170),
        );
        return () => timers.forEach((timer) => window.clearTimeout(timer));
    }, [count, total]);

    React.useEffect(() => {
        for (const item of items) {
            const image = new Image();
            image.decoding = "async";
            image.src = item.src;
        }
    }, [items]);

    React.useEffect(() => {
        if (!autoplay || reducedMotion || lookingAt !== null || total <= count) return;
        const timers: number[] = [];
        const cycle = window.setInterval(() => {
            const k = turn.current % count;
            turn.current += 1;
            setShades((prev) => prev.map((value, i) => (i === k ? 1 : value)));
            timers.push(
                window.setTimeout(() => {
                    const showing = slotsRef.current;
                    let next = cursor.current % total;
                    for (let guard = 0; guard < total && showing.includes(next); guard++) next = (next + 1) % total;
                    cursor.current = next + 1;
                    setSlots((prev) => prev.map((value, i) => (i === k ? next : value)));
                    timers.push(window.setTimeout(() => setShades((prev) => prev.map((value, i) => (i === k ? 0 : value))), 90));
                }, shadeDuration + 110),
            );
        }, interval);
        return () => {
            window.clearInterval(cycle);
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, [autoplay, reducedMotion, lookingAt, total, count, interval, shadeDuration]);

    React.useEffect(() => {
        if (reducedMotion || drift <= 0) {
            for (const view of viewRefs.current) view?.getAnimations().forEach((animation) => animation.cancel());
            for (const view of viewRefs.current) if (view) view.style.transform = `translateX(${-((1 - 1 / VIEW_SCALE) / 2) * 100}%)`;
            return;
        }
        const pan = -(1 - 1 / VIEW_SCALE) * 100;
        const animations = viewRefs.current.map((view, k) =>
            view?.animate([{ transform: "translateX(0%)" }, { transform: `translateX(${pan}%)` }], {
                duration: drift * 1000,
                iterations: Infinity,
                direction: "alternate",
                easing: "ease-in-out",
                delay: -((k * 0.37 + 0.2) % 1) * drift * 1000,
            }),
        );
        return () => animations.forEach((animation) => animation?.cancel());
    }, [drift, reducedMotion, count]);

    const cancelFlight = React.useCallback(() => {
        for (const animation of animations.current) {
            animation.onfinish = null;
            animation.cancel();
        }
        animations.current = [];
        frameFlight.current?.cancel();
        frameFlight.current = null;
    }, []);

    const windowCrop = React.useCallback((index: number) => {
        const source = viewRefs.current[index];
        const glass = source?.parentElement?.getBoundingClientRect();
        const stage = lookRef.current?.getBoundingClientRect();
        if (!source || !glass || !stage || !stage.width || !glass.width) return null;
        const image = source.getBoundingClientRect();
        const naturalWidth = source.naturalWidth || image.width;
        const naturalHeight = source.naturalHeight || image.height;
        // Match the painted object-cover image, not just the 135%-wide img element.
        const smallCover = Math.max(image.width / naturalWidth, image.height / naturalHeight);
        const fullCover = Math.max(stage.width / naturalWidth, stage.height / naturalHeight);
        const scale = smallCover / fullCover;
        const x = glass.left - stage.left + glass.width / 2;
        const y = glass.top - stage.top + glass.height / 2;
        const tx = image.left - stage.left + image.width / 2 - (x + (stage.width / 2 - x) * scale);
        const ty = image.top - stage.top + image.height / 2 - (y + (stage.height / 2 - y) * scale);
        const root = lookRef.current?.parentElement;
        const radius = root ? getComputedStyle(root).borderRadius : "28px";
        return {
            // Resolve the window's radii against the glass, not the larger stage.
            clip: `inset(${glass.top - stage.top}px ${stage.right - glass.right}px ${stage.bottom - glass.bottom}px ${glass.left - stage.left}px round ${glass.width * 0.46}px / ${glass.height * 0.34}px)`,
            fullClip: `inset(0px 0px 0px 0px round ${radius})`,
            origin: `${x}px ${y}px`,
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            frame: `translate(${stage.width / 2 - x}px, ${stage.height / 2 - y}px) scale(${Math.max(stage.width / glass.width, stage.height / glass.height) * 1.8})`,
        };
    }, []);

    React.useLayoutEffect(() => {
        if (requestedWindow !== null) setRetainedWindow(requestedWindow);
    }, [requestedWindow]);

    React.useLayoutEffect(() => {
        if (lookingAt === null) return;
        if (reducedMotion && closing.current) {
            finishReturn.current?.();
            return;
        }
        const mask = maskRef.current;
        const view = lookViewRef.current;
        const crop = windowCrop(lookingAt);
        if (!mask || !view || !crop) return;
        closing.current = false;
        lookRef.current?.focus({ preventScroll: true });
        mask.style.clipPath = crop.fullClip;
        view.style.transformOrigin = crop.origin;
        const duration = reducedMotion ? 0 : 650;
        if (duration === 0) {
            setFlight("vista");
            return cancelFlight;
        }
        setFlight("entering");
        const clip = mask.animate([{ clipPath: crop.clip }, { clipPath: crop.fullClip }], { duration, easing: FLIGHT_EASING, fill: "both" });
        const zoom = view.animate([{ transform: crop.transform }, { transform: "translate(0px, 0px) scale(1)" }], { duration, easing: FLIGHT_EASING, fill: "both" });
        const fade = mask.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: "both" });
        const caption = captionRef.current?.animate([{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0px)" }], { delay: 300, duration: 350, easing: FLIGHT_EASING, fill: "both" });
        // The existing frame follows behind the view and passes beyond the stage.
        const frame = windowRefs.current[lookingAt];
        if (frame) frameFlight.current = frame.animate([
            { transform: getComputedStyle(frame).transform, opacity: 1, offset: 0 },
            { transform: getComputedStyle(frame).transform, opacity: 1, offset: 120 / duration, easing: FLIGHT_EASING },
            { transform: crop.frame, opacity: 0, offset: 1 },
        ], { duration, fill: "both" });
        animations.current = [clip, zoom, fade, ...(caption ? [caption] : [])];
        zoom.onfinish = () => {
            if (closing.current) return;
            clip.cancel(); zoom.cancel(); fade.cancel(); caption?.cancel();
            setFlight("vista");
        };
        return cancelFlight;
    }, [lookingAt, reducedMotion, windowCrop, cancelFlight]);

    React.useEffect(() => {
        if (lookingAt === null || flight !== "vista" || reducedMotion || drift <= 0) return;
        const view = lookViewRef.current;
        if (!view) return;
        const ambient = view.animate([
            { transform: "translate(0%, 0%) scale(1)" },
            { transform: "translate(-0.5%, 0%) scale(1.02)", offset: 0.5 },
            { transform: "translate(0.5%, 0%) scale(1.04)" },
        ], { duration: Math.max(32, drift) * 1000, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
        view.style.transformOrigin = "50% 50%";
        animations.current.push(ambient);
        return () => ambient.cancel();
    }, [lookingAt, flight, reducedMotion, drift]);

    const setShade = (k: number, value: number) =>
        setShades((prev) => prev.map((current, i) => (i === k ? value : current)));

    // A closed shade lifts on the first click. Looking out is the second one.
    const lookOut = (k: number) => {
        if (lookingAt !== null) return;
        if ((shades[k] ?? 1) > 0) {
            setShade(k, 0);
            return;
        }
        setLookingAt(k);
        onActiveWindowChange?.(k);
        onLookOut?.(slots[k] ?? null);
    };

    const sitBack = React.useCallback(() => {
        if (lookingAt === null || closing.current) return;
        const k = lookingAt;
        const finish = () => {
            cancelFlight();
            closing.current = false;
            finishReturn.current = null;
            setRetainedWindow(null);
            setLookingAt(null);
            onActiveWindowChange?.(null);
            onLookOut?.(null);
            windowRefs.current[k]?.focus({ preventScroll: true });
        };
        const mask = maskRef.current;
        const view = lookViewRef.current;
        if (!mask || !view || reducedMotion) { finish(); return; }
        const currentClip = getComputedStyle(mask).clipPath;
        const currentTransform = new DOMMatrixReadOnly(getComputedStyle(view).transform);
        const origin = getComputedStyle(view).transformOrigin.split(" ").map(Number.parseFloat);
        const captionOpacity = captionRef.current ? getComputedStyle(captionRef.current).opacity : "0";
        // Restore the hidden cabin frame before measuring its current position.
        cancelFlight();
        const crop = windowCrop(k);
        if (!crop) { finish(); return; }
        const nextOrigin = crop.origin.split(" ").map(Number.parseFloat);
        // Rebase the current transform from the ambient center to the window center.
        const tx = currentTransform.m41 + (1 - currentTransform.m11) * ((origin[0] ?? 0) - (nextOrigin[0] ?? 0));
        const ty = currentTransform.m42 + (1 - currentTransform.m22) * ((origin[1] ?? 0) - (nextOrigin[1] ?? 0));
        view.style.transformOrigin = crop.origin;
        closing.current = true;
        finishReturn.current = finish;
        setFlight("returning");
        const clip = mask.animate([{ clipPath: currentClip }, { clipPath: crop.clip }], { duration: 480, easing: FLIGHT_EASING, fill: "both" });
        const zoom = view.animate([{ transform: `translate(${tx}px, ${ty}px) scale(${currentTransform.m11})` }, { transform: crop.transform }], { duration: 480, easing: FLIGHT_EASING, fill: "both" });
        const fade = mask.animate([{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { duration: 480, fill: "both" });
        const caption = captionRef.current?.animate([{ opacity: captionOpacity }, { opacity: 0 }], { duration: 160, fill: "both" });
        const frame = windowRefs.current[k];
        if (frame) frameFlight.current = frame.animate([{ transform: crop.frame, opacity: 0 }, { transform: getComputedStyle(frame).transform, opacity: 1 }], { duration: 480, easing: FLIGHT_EASING });
        animations.current = [clip, zoom, fade, ...(caption ? [caption] : [])];
        zoom.onfinish = finish;
    }, [lookingAt, onLookOut, onActiveWindowChange, reducedMotion, windowCrop, cancelFlight]);

    React.useLayoutEffect(() => {
        if (requestedWindow === null && retainedWindow !== null) sitBack();
    }, [requestedWindow, retainedWindow, sitBack]);

    React.useEffect(() => {
        if (lookingAt === null) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") sitBack();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lookingAt, sitBack]);

    const width = `min(${Math.min(36, 72 / count)}cqw, calc((100cqh - ${LABEL_SPACE_PX}px) * ${WINDOW_ASPECT}))`;
    const looked = lookingAt === null ? undefined : items[slots[lookingAt] ?? 0];

    return (
        <div
            ref={ref}
            data-slot="airplane-window-gallery"
            data-looking={lookingAt ?? undefined}
            data-autoplay={autoplay}
            className={cx(
                "relative isolate w-full overflow-hidden rounded-[28px] bg-white text-slate-900 ring-1 ring-slate-200",
                "bg-gradient-to-b from-slate-300 via-slate-100 to-slate-300",
                className,
            )}
            style={{ aspectRatio: "3 / 2", ...style }}
            {...rest}
        >
            <div aria-hidden className="absolute inset-x-0 top-0 h-[10%] bg-gradient-to-b from-slate-100 to-slate-300 shadow-md shadow-slate-900/15">
                <div className="absolute inset-x-0 bottom-0 h-px bg-slate-900/10" />
                <div className="absolute inset-x-0 bottom-[22%] flex justify-evenly">
                    {Array.from({ length: count }, (_, k) => (
                        <span key={k} className="h-1.5 w-1.5 rounded-full bg-white shadow-md shadow-white/65" />
                    ))}
                </div>
            </div>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[8%] bg-gradient-to-b from-slate-100 to-slate-300 shadow-inner shadow-slate-900/10" />

            <div
                role="list"
                className={cx(
                    "absolute inset-x-[4%] top-[11%] bottom-[8%] flex items-center justify-evenly transition-[opacity,filter] duration-500 motion-reduce:transition-none",
                    lookingAt !== null && flight !== "returning" && "opacity-40 blur-[1.5px]",
                )}
                style={{ containerType: "size", transitionDelay: lookingAt !== null && flight !== "returning" && !reducedMotion ? "120ms" : "0ms" }}
            >
                {Array.from({ length: count }, (_, k) => {
                    const item = items[slots[k] ?? 0];
                    const shade = shades[k] ?? 1;
                    const isClosed = shade > 0;
                    return (
                        <div key={k} role="listitem" className="flex flex-col items-center gap-2" style={{ width }}>
                            <span data-seat className="font-mono text-[11px] tracking-wider text-slate-500">
                                {firstRow + k}A
                            </span>
                            <button
                                ref={(node) => {
                                    windowRefs.current[k] = node;
                                }}
                                type="button"
                                data-window={k}
                                data-item={slots[k]}
                                data-closed={isClosed || undefined}
                                aria-label={
                                    isClosed
                                        ? `Lift the shade on window ${firstRow + k}A`
                                        : `Look out of window ${firstRow + k}A${item?.title ? `: ${item.title}${item.location ? `, ${item.location}` : ""}` : ""}`
                                }
                                onClick={() => lookOut(k)}
                                className={cx(
                                    "group relative w-full rounded-[46%/34%] outline-none transition-transform duration-300 hover:-translate-y-0.5",
                                    "bg-gradient-to-br from-white to-slate-300 shadow-lg shadow-slate-900/25 ring-1 ring-white/70",
                                    "focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                )}
                                style={{ aspectRatio: String(WINDOW_ASPECT) }}
                            >
                                <span aria-hidden className="absolute inset-[3.5%] rounded-[45%/33%] shadow-inner shadow-slate-900/30" />
                                {lookingAt === null && (
                                    <span
                                        aria-hidden
                                        data-hint
                                        className="pointer-events-none absolute bottom-[12%] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:bg-slate-900"
                                    >
                                        {isClosed ? "Click to open" : "Click for details"}
                                    </span>
                                )}
                                <Glass
                                    item={item}
                                    shade={shade}
                                    shadeMs={shadeMs}
                                    viewRef={(node) => {
                                        viewRefs.current[k] = node;
                                    }}
                                />
                            </button>
                            <span
                                data-place
                                className="flex min-h-10 flex-col items-center whitespace-nowrap text-center leading-tight transition-opacity duration-300"
                                style={{ opacity: isClosed ? 0.35 : 1 }}
                            >
                                <span className="text-sm font-medium text-slate-800">{item?.title ?? ""}</span>
                                {item?.location && <span className="mt-0.5 text-[11px] text-slate-500">{item.location}</span>}
                            </span>
                            <button
                                type="button"
                                data-shade-toggle={k}
                                aria-pressed={isClosed}
                                aria-label={`${isClosed ? "Lift" : "Close"} the shade on window ${firstRow + k}A`}
                                onClick={() => setShade(k, isClosed ? 0 : 1)}
                                className="rounded-sm font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                            >
                                {isClosed ? "Lift shade" : "Close shade"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {lookingAt !== null && (
                <div
                    ref={lookRef}
                    data-lookout
                    data-flight={flight}
                    data-item={slots[lookingAt]}
                    role="dialog"
                    aria-modal="false"
                    aria-label={looked?.title ?? "Window view"}
                    tabIndex={-1}
                    className="absolute inset-0 z-20 cursor-zoom-out outline-none"
                    onClick={sitBack}
                >
                    <div ref={maskRef} data-vista-mask className="absolute inset-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {looked && <img ref={lookViewRef} data-vista src={looked.src} alt={looked.alt ?? looked.title ?? ""} draggable={false} className="absolute inset-0 h-full w-full max-w-none overflow-visible object-cover" />}
                    </div>

                    <div
                        ref={captionRef}
                        data-vista-caption
                        className="absolute inset-x-0 bottom-0 max-h-[82%] cursor-default overflow-y-auto bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-950/0 px-[6%] pb-[6%] pt-[14%] text-white"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {renderDetails && looked ? (
                            renderDetails(looked)
                        ) : (
                            <>
                                {(looked?.title || looked?.location) && (
                                    <p className="text-lg font-semibold tracking-tight sm:text-2xl">
                                        {looked?.title}
                                        {looked?.location && <span className="font-normal text-white/90"> · {looked.location}</span>}
                                    </p>
                                )}
                                {looked?.caption && <p className="mt-1 text-xs leading-relaxed text-white/90">{looked.caption}</p>}
                                <p className="mt-3 text-[10px] uppercase tracking-[.16em] text-white/70">Click anywhere to sit back.</p>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        data-sit-back
                        onClick={(event) => {
                            event.stopPropagation();
                            sitBack();
                        }}
                        className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-slate-900/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default AirplaneWindowGallery;
