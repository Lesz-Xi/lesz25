import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";
import { useDrag } from "@use-gesture/react";
import { useSpring } from "@react-spring/web";

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-9/12 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] card-shine ${
      customClass ?? ""
    } ${rest.className ?? ""}`.trim()}
  />
));
Card.displayName = "Card";

const makeSlot = (i, distX, distY, total, scaleStep) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
  scale: 1 - i * scaleStep,
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    scale: slot.scale,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  scaleStep = 0.05,
  delay = 6000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 8,
  easing = "elastic",
  children,
}) => {
  const config = useMemo(
    () =>
      easing === "elastic"
        ? {
            ease: "elastic.out(0.6,0.9)",
            durDrop: 2,
            durMove: 2,
            durReturn: 2,
            promoteOverlap: 0.9,
            returnDelay: 0.05,
          }
        : {
            ease: "power1.inOut",
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            promoteOverlap: 0.45,
            returnDelay: 0.2,
          },
    [easing]
  );

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr]);

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  // Spring animation for drag gesture
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  // Swap function - wrapped in useCallback to fix dependency warning
  const swap = useCallback(() => {
    if (order.current.length < 2) return;

    const [front, ...rest] = order.current;
    const elFront = refs[front].current;
    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(elFront, {
      y: "+=500",
      duration: config.durDrop,
      ease: config.ease,
    });

    tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
    rest.forEach((idx, i) => {
      const el = refs[idx].current;
      const slot = makeSlot(
        i,
        cardDistance,
        verticalDistance,
        refs.length,
        scaleStep
      );
      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          scale: slot.scale,
          duration: config.durMove,
          ease: config.ease,
        },
        `promote+=${i * 0.15}`
      );
    });

    const backSlot = makeSlot(
      refs.length - 1,
      cardDistance,
      verticalDistance,
      refs.length,
      scaleStep
    );
    tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
    tl.call(
      () => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      },
      undefined,
      "return"
    );
    tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
    tl.to(
      elFront,
      {
        y: backSlot.y,
        scale: backSlot.scale,
        duration: config.durReturn,
        ease: config.ease,
      },
      "return"
    );

    tl.call(() => {
      order.current = [...rest, front];
    });
  }, [refs, config, cardDistance, verticalDistance, scaleStep]);

  // Drag gesture binding
  const bind = useDrag(({ down, movement: [mx, my], velocity: [vx] }) => {
    const trigger = vx > 0.2 || Math.abs(mx) > 100; // If flick is fast enough or dragged far enough
    if (!down && trigger) {
      // Trigger card swap
      swap();
    }
    api.start({
      x: down ? mx : 0,
      y: down ? my * 0.1 : 0, // Slight vertical movement for natural feel
      immediate: down,
    });
  });

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(
        r.current,
        makeSlot(i, cardDistance, verticalDistance, total, scaleStep),
        skewAmount
      )
    );

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
  }, [
    cardDistance,
    verticalDistance,
    scaleStep,
    delay,
    pauseOnHover,
    skewAmount,
    easing,
    config,
    refs,
    swap,
  ]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child;

    const isFrontCard = order.current[0] === i;

    if (isFrontCard) {
      // Apply drag gesture and spring animation to the front card
      return cloneElement(child, {
        key: i,
        ref: refs[i],
        style: {
          width,
          height,
          transform: `translate3d(${x.get()}px, ${y.get()}px, 0px)`,
          ...(child.props.style ?? {}),
        },
        onClick: (e) => {
          child.props.onClick?.(e);
          onCardClick?.(i);
        },
        ...bind(),
      });
    }

    // Regular cards without drag functionality
    return cloneElement(child, {
      key: i,
      ref: refs[i],
      style: { width, height, ...(child.props.style ?? {}) },
      onClick: (e) => {
        child.props.onClick?.(e);
        onCardClick?.(i);
      },
    });
  });

  return (
    <div
      ref={container}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 perspective-[900px] overflow-visible max-[768px]:scale-[0.75] max-[480px]:scale-[0.55]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
