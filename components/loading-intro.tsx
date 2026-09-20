"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingIntro({ locale }: { locale: "en" | "ro" }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current!;
    const site = document.querySelector<HTMLElement>(".cafe");
    const mark = document.querySelector<HTMLElement>(".cafe-header .brand-lockup img");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    let stopped = false;
    let dispose = () => {};
    let timeline: gsap.core.Timeline | undefined;
    let frame = 0;
    const previousOverflow = document.documentElement.style.overflow;
    const previousInert = site?.inert ?? false;
    const previousOpacity = mark?.style.opacity ?? "";
    const finish = () => {
      if (stopped) return;
      stopped = true;
      controller.abort();
      timeline?.kill();
      cancelAnimationFrame(frame);
      dispose();
      element.hidden = true;
      document.documentElement.style.overflow = previousOverflow;
      if (site) site.inert = previousInert;
      if (mark) mark.style.opacity = previousOpacity;
    };
    // Deep links and reduced-motion visits go straight to the page.
    if (!mark || !site || reduced.matches || location.hash || scrollY > 40) {
      finish();
      return;
    }
    element.hidden = false;
    site.inert = true;
    mark.style.opacity = "0";
    document.documentElement.style.overflow = "hidden";
    const timeout = window.setTimeout(finish, 8500);
    reduced.addEventListener("change", finish);

    async function start() {
      const [THREE, { SVGLoader }, { mergeVertices }, { RoomEnvironment }, source] = await Promise.all([
        import("three"),
        import("three/addons/loaders/SVGLoader.js"),
        import("three/addons/utils/BufferGeometryUtils.js"),
        import("three/addons/environments/RoomEnvironment.js"),
        fetch("/images/snail-sculpture.svg", { signal: controller.signal }).then(r => {
          if (!r.ok) throw new Error("Logo unavailable");
          return r.text();
        }),
      ]);
      if (stopped) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-innerWidth / 2, innerWidth / 2, innerHeight / 2, -innerHeight / 2, 1, 3000);
      camera.position.z = 1500;
      const environment = new RoomEnvironment();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environmentMap = pmrem.fromScene(environment, 0.04);
      scene.environment = environmentMap.texture;
      environment.dispose();
      pmrem.dispose();

      // Procedural mineral bands keep the onyx finish continuous across the three pieces.
      const stone = document.createElement("canvas");
      stone.width = stone.height = 512;
      const ctx = stone.getContext("2d")!;
      const pixels = ctx.createImageData(512, 512);
      for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
        const band = y * 0.058 + Math.sin(x * 0.011) * 3 + Math.sin(x * 0.026 + y * 0.008) * 1.2;
        const vein = Math.pow((Math.sin(band) + 1) / 2, 16);
        const tone = 18 + Math.sin(band * 0.4) * 5 + vein * 28;
        const i = (y * 512 + x) * 4;
        pixels.data[i] = tone + 5;
        pixels.data[i + 1] = tone + 7;
        pixels.data[i + 2] = tone;
        pixels.data[i + 3] = 255;
      }
      ctx.putImageData(pixels, 0, 0);
      const texture = new THREE.CanvasTexture(stone);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.MeshPhysicalMaterial({
        map: texture, color: 0x181818, roughness: 0.36, metalness: 0,
        clearcoat: 0.08, clearcoatRoughness: 0.2,
        transparent: true, opacity: 0.9, depthWrite: false,
        side: THREE.FrontSide, envMapIntensity: 0.12,
      });
      const logo = new THREE.Group();
      scene.add(logo);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x76766e, 2));
      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(-300, 450, 650);
      scene.add(light);
      const geometries: InstanceType<typeof THREE.BufferGeometry>[] = [];
      const parts: { mesh: InstanceType<typeof THREE.Mesh>; home: InstanceType<typeof THREE.Vector3>; direction: number[] }[] = [];
      const directions: Record<string, number[]> = { body: [0.85, 0.7], shell: [-0.9, 0.2], pebble: [0.4, -0.85] };
      for (const path of new SVGLoader().parse(source).paths) {
        for (const shape of path.toShapes()) {
          const raw = new THREE.ExtrudeGeometry(shape, { depth: 22, bevelEnabled: true, bevelThickness: 6, bevelSize: 2, bevelSegments: 12, curveSegments: 40 });
          raw.deleteAttribute("normal");
          raw.deleteAttribute("uv");
          const geometry = mergeVertices(raw, 0.0001);
          raw.dispose();
          geometry.computeVertexNormals();
          const positions = geometry.getAttribute("position");
          const uv = new Float32Array(positions.count * 2);
          for (let i = 0; i < positions.count; i++) { uv[i * 2] = positions.getX(i) / 250; uv[i * 2 + 1] = positions.getY(i) / 312; }
          geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
          geometry.translate(-125, -156, -14);
          geometry.scale(1, -1, 1);
          geometry.computeBoundingBox();
          const home = geometry.boundingBox!.getCenter(new THREE.Vector3());
          geometry.translate(-home.x, -home.y, -home.z);
          const mesh = new THREE.Mesh(geometry, material);
          const name = (path.userData?.node as Element | undefined)?.id || "body";
          logo.add(mesh);
          geometries.push(geometry);
          parts.push({ mesh, home, direction: directions[name] });
        }
      }
      element.querySelector(".intro-stage")!.appendChild(renderer.domElement);
      const motion = { assembly: 0, flight: 0, fade: 0 };
      const resize = () => {
        renderer.setSize(innerWidth, innerHeight);
        camera.left = -innerWidth / 2; camera.right = innerWidth / 2;
        camera.top = innerHeight / 2; camera.bottom = -innerHeight / 2;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);
      dispose = () => {
        window.removeEventListener("resize", resize);
        geometries.forEach(g => g.dispose()); material.dispose(); texture.dispose();
        environmentMap.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
      const draw = () => {
        if (stopped) return;
        const size = Math.min(innerWidth * 0.58, innerHeight * 0.46, 350) / 312;
        const target = mark!.getBoundingClientRect();
        const scale = THREE.MathUtils.lerp(size, target.height / 312, motion.flight);
        logo.scale.setScalar(scale);
        logo.position.set((target.left + target.width / 2 - innerWidth / 2) * motion.flight, (innerHeight / 2 - target.top - target.height / 2) * motion.flight, 0);
        logo.rotation.y = (1 - motion.flight) * -0.18 * motion.assembly;
        const spread = 1 - motion.assembly;
        parts.forEach(({ mesh, home, direction }, i) => {
          mesh.position.set(home.x + direction[0] * innerWidth * 0.62 / size * spread, home.y + direction[1] * innerHeight * 0.64 / size * spread, home.z);
          mesh.rotation.set(spread * (i + 1) * Math.PI, spread * Math.PI * (i % 2 ? -2 : 2), spread * (i % 2 ? -1 : 1) * Math.PI);
          mesh.scale.setScalar(1 + spread * 1.1);
        });
        material.opacity = 0.9 * (1 - motion.fade);
        mark!.style.opacity = String(motion.fade);
        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      draw();
      element.dataset.phase = "assembling";
      timeline = gsap.timeline();
      timeline.to(motion, { assembly: 1, duration: 2.1, ease: "power3.out" });
      // Wait for the hero and fonts as well as the assembly, with a bounded fallback.
      const hero = document.querySelector<HTMLImageElement>(".cafe-main-photo img");
      await Promise.all([
        timeline.then(),
        Promise.race([
          Promise.all([document.fonts.ready, hero?.decode().catch(() => {})]),
          new Promise(resolve => window.setTimeout(resolve, 3000)),
        ]),
      ]);
      if (stopped) return;
      element.dataset.phase = "docking";
      timeline = gsap.timeline({ onComplete: finish });
      timeline.to(element.querySelector(".intro-backdrop"), { opacity: 0, duration: 1.15 }, 0.15)
        .to(motion, { flight: 1, duration: 1.55, ease: "power3.inOut" }, 0.15)
        .to(motion, { fade: 1, duration: 0.28, ease: "power1.inOut" }, 1.53);
    }
    start().catch(finish);
    return () => {
      clearTimeout(timeout);
      reduced.removeEventListener("change", finish);
      finish();
    };
  }, []);

  return (
    <div className="cafe-intro" ref={host} aria-label={locale === "ro" ? "Bine ai venit la PEBBLE" : "Welcome to PEBBLE"}>
      <div className="intro-backdrop" />
      <div className="intro-stage" aria-hidden="true" />
      <noscript><style>{`.cafe-intro { display: none !important; }`}</style></noscript>
    </div>
  );
}
