"use client";
import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { sculptureSilhouettes } from "@/lib/sculpture-silhouette";

/** White lettering is clipped to the moving photo footprint, not a fixed breakpoint. */
export function usePhotoContrast(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!root.current) return;
    const entries = [...root.current.querySelectorAll<HTMLElement>(
      ".cafe-title > span, .cafe-wall-note, .cafe-cascade-title, .cafe-visit-copy h2, .cafe-retail-copy h2",
    )].map(text => {
      const copy = document.createElement("div");
      copy.className = "photo-contrast-copy";
      copy.setAttribute("aria-hidden", "true");
      [...text.childNodes].forEach(node => copy.appendChild(node.cloneNode(true)));
      text.classList.add("photo-contrast-text");
      text.appendChild(copy);
      const photos = [...(text.closest("section")?.querySelectorAll<HTMLElement>(
        ".cafe-main-photo, .cafe-wall-photo, .cafe-image-crop, .cafe-front-photo",
      ) || [])];
      return { text, copy, photos };
    });
    const matrix = (element: HTMLElement) => {
      let result = new DOMMatrix();
      for (let node: HTMLElement | null = element; node && node !== root.current; node = node.parentElement) {
        const transform = getComputedStyle(node).transform;
        if (transform !== "none") result = new DOMMatrix(transform).multiply(result);
      }
      return result;
    };
    const update = () => {
      entries.forEach(({ text, copy, photos }) => {
        const bounds = text.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > innerHeight) return;
        const inverse = matrix(text).inverse();
        let path = "";
        photos.forEach(photo => {
          const box = photo.getBoundingClientRect();
          if (box.right < bounds.left || box.left > bounds.right || box.bottom < bounds.top || box.top > bounds.bottom) return;
          const transform = matrix(photo);
          const points = [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y]) => {
            const dx = x * photo.offsetWidth / 2, dy = y * photo.offsetHeight / 2;
            const vx = box.left + box.width / 2 + transform.a * dx + transform.c * dy - bounds.left - bounds.width / 2;
            const vy = box.top + box.height / 2 + transform.b * dx + transform.d * dy - bounds.top - bounds.height / 2;
            return `${(inverse.a * vx + inverse.c * vy + text.offsetWidth / 2).toFixed(2)} ${(inverse.b * vx + inverse.d * vy + text.offsetHeight / 2).toFixed(2)}`;
          });
          path += `M${points.join("L")}Z`;
        });
        copy.style.clipPath = path ? `path('${path}')` : "inset(100%)";
        // White lettering follows both the photos and the actual moving snail.
        const sculpture = text.closest("section")?.querySelector<HTMLElement>(".snail-sculpture");
        const outlines = sculpture && sculptureSilhouettes.get(sculpture);
        if (sculpture && outlines) {
          const box = sculpture.getBoundingClientRect();
          const silhouette = outlines.map(points => `M${points.map(([x,y]) => {
            const dx = box.left + x - bounds.left - bounds.width / 2;
            const dy = box.top + y - bounds.top - bounds.height / 2;
            return `${(inverse.a * dx + inverse.c * dy + text.offsetWidth / 2).toFixed(1)} ${(inverse.b * dx + inverse.d * dy + text.offsetHeight / 2).toFixed(1)}`;
          }).join("L")}Z`).join("");
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${text.offsetWidth}" height="${text.offsetHeight}"><path d="${path}" fill="white"/><path d="${silhouette}" fill="white" stroke="white" stroke-width="2"/></svg>`;
          copy.style.clipPath = "none";
          copy.style.maskImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
          copy.style.maskMode = "luminance";
        } else copy.style.maskImage = "none";
      });
    };
    gsap.ticker.add(update);
    update();
    return () => {
      gsap.ticker.remove(update);
      entries.forEach(({text,copy}) => { copy.remove(); text.classList.remove("photo-contrast-text"); });
    };
  }, [root]);
}
