import { useEffect, useState } from "react";

export default function CartFlyAnimation() {
  const [fly, setFly] = useState(null);

  useEffect(() => {
    const handle = (event) => {
      const target = document.querySelector("[data-cart-target]");
      const source = event.detail?.sourceRect;
      const image = event.detail?.image;
      if (!target || !source || !image) return;

      const targetRect = target.getBoundingClientRect();
      setFly({
        id: Date.now(),
        image,
        left: source.left,
        top: source.top,
        width: Math.min(source.width, 150),
        height: Math.min(source.height, 150),
        tx: targetRect.left + targetRect.width / 2,
        ty: targetRect.top + targetRect.height / 2,
      });
    };

    window.addEventListener("matchet:cart-add", handle);
    return () => window.removeEventListener("matchet:cart-add", handle);
  }, []);

  if (!fly) return null;

  return (
    <img
      key={fly.id}
      src={fly.image}
      alt=""
      className="pointer-events-none fixed z-[9999] rounded-xl object-cover shadow-[0_12px_35px_rgba(16,24,63,0.25)] matchet-cart-fly"
      style={{
        left: fly.left,
        top: fly.top,
        width: fly.width,
        height: fly.height,
        "--cart-fly-x": `${fly.tx}px`,
        "--cart-fly-start-x": `${fly.left}px`,
        "--cart-fly-y": `${fly.ty}px`,
        "--cart-fly-start-y": `${fly.top}px`,
      }}
      onAnimationEnd={() => setFly(null)}
    />
  );
}
