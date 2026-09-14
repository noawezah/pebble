import Image from "next/image";

/** The snail is vector-traced from the supplied original PEBBLE mark. */
export default function Brand() {
  return (
    <span className="brand-lockup">
      <Image src="/images/snail.svg" alt="" width={250} height={312} />
      <span>PEBBLE</span>
    </span>
  );
}
