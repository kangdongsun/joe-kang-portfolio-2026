/**
 * Footer (Figma component 97:2682).
 * Solid canvas-strong bar (#f0dfd0), no border, uniform 32px padding on all
 * sides, centered copyright in Body 4 (12px).
 * NOTE: the Figma copy reads "Reserverd" (typo) — corrected here to "Reserved".
 */
export default function Footer() {
  return (
    <footer className="w-full bg-[#f0dfd0] px-8 py-8">
      <div className="mx-auto flex max-w-content items-center justify-center">
        <p className="font-sans text-body-4 font-normal text-body">
          2026 Joe Kang. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
