export function EditorialBackdrop() {
  return <div className="editorial-backdrop" aria-hidden="true">
    <div className="backdrop-grid" />
    <div className="backdrop-watermark watermark-primary">FULL STACK</div>
    <div className="backdrop-watermark watermark-secondary">PORTFOLIO · 2026 · COMPUTER ENGINEERING</div>

    <div className="backdrop-orbit orbit-top">
      <span className="orbit-ring ring-one" />
      <span className="orbit-ring ring-two" />
      <span className="orbit-ring ring-three" />
      <i className="orbit-node node-one" />
      <i className="orbit-node node-two" />
    </div>

    <div className="backdrop-orbit orbit-bottom">
      <span className="orbit-ring ring-one" />
      <span className="orbit-ring ring-two" />
      <span className="orbit-ring ring-three" />
      <i className="orbit-node node-one" />
      <i className="orbit-node node-two" />
    </div>

    <div className="backdrop-marks marks-left"><span>01</span><i /><span>05</span></div>
    <div className="backdrop-marks marks-right"><span>TH</span><i /><span>EN</span></div>
    <div className="backdrop-grain" />
  </div>
}
