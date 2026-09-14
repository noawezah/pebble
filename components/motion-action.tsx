"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import gsap from "gsap";

function useMagnetic() {
  const target = useRef<HTMLElement | null>(null);
  useEffect(
    () => () => {
      if (target.current) gsap.killTweensOf(target.current);
    },
    [],
  );
  const move = (event: PointerEvent<HTMLElement>) => {
    if (
      !window.matchMedia(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    const element = event.currentTarget;
    target.current = element;
    const rect = element.getBoundingClientRect();
    gsap.to(element, {
      x: (event.clientX - rect.left - rect.width / 2) * 0.08,
      y: (event.clientY - rect.top - rect.height / 2) * 0.18,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
  };
  const leave = () => {
    if (target.current)
      gsap.to(target.current, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1,.5)",
        overwrite: true,
      });
  };
  return { onPointerMove: move, onPointerLeave: leave, onBlur: leave };
}
function ActionContent({
  children,
  icon,
}: {
  children: ReactNode;
  icon: string;
}) {
  return (
    <>
      <span className="action-roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <span className="action-arrow" aria-hidden="true">
        <i className={`ri-${icon}`} />
        <i className={`ri-${icon}`} />
      </span>
    </>
  );
}
type ActionProps = { children: ReactNode; className?: string; icon?: string };
export function MotionLink({
  href,
  children,
  className = "primary",
  icon = "arrow-right-up-line",
  external = false,
}: ActionProps & { href: string; external?: boolean }) {
  const magnetic = useMagnetic();
  return (
    <a
      className={`button motion-action ${className}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...magnetic}
    >
      <ActionContent icon={icon}>{children}</ActionContent>
    </a>
  );
}
export function MotionButton({
  children,
  onClick,
  className = "outline",
  icon = "replay-line",
  disabled = false,
}: ActionProps & { onClick?: () => void; disabled?: boolean }) {
  const magnetic = useMagnetic();
  return (
    <button
      className={`button motion-action ${className}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...magnetic}
    >
      <ActionContent icon={icon}>{children}</ActionContent>
    </button>
  );
}
