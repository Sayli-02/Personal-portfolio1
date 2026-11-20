/** Static ML lab UI rendered inside the laptop screen after the dive. */
export default function MlDashboard() {
  return (
    <div className="ml-dash" data-ml-dash>
      <header className="ml-dash__top">
        <span className="ml-dash__dot" />
        <span>sayali · model lab</span>
        <span className="ml-dash__live">LIVE</span>
      </header>

      <div className="ml-dash__grid">
        <div className="ml-dash__card">
          <p className="ml-dash__label">Fraud recall</p>
          <p className="ml-dash__value">94.5%</p>
          <svg className="ml-dash__spark" viewBox="0 0 120 36" aria-hidden="true">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points="0,28 16,24 32,26 48,18 64,20 80,10 96,14 120,4"
            />
          </svg>
        </div>

        <div className="ml-dash__card">
          <p className="ml-dash__label">Risk scores</p>
          <div className="ml-dash__bars" aria-hidden="true">
            <i style={{ height: "42%" }} />
            <i style={{ height: "68%" }} />
            <i style={{ height: "55%" }} />
            <i style={{ height: "88%" }} />
            <i style={{ height: "72%" }} />
            <i style={{ height: "94%" }} />
          </div>
        </div>

        <div className="ml-dash__card ml-dash__card--wide">
          <p className="ml-dash__label">SHAP · feature impact</p>
          <div className="ml-dash__shap">
            <div>
              <span>age</span>
              <b style={{ width: "72%" }} />
            </div>
            <div>
              <span>bp</span>
              <b style={{ width: "58%" }} />
            </div>
            <div>
              <span>chol</span>
              <b style={{ width: "81%" }} />
            </div>
            <div>
              <span>glucose</span>
              <b style={{ width: "64%" }} />
            </div>
          </div>
        </div>

        <div className="ml-dash__card">
          <p className="ml-dash__label">Confusion</p>
          <div className="ml-dash__matrix" aria-hidden="true">
            <span className="ok"> Tro</span>
            <span>1.2</span>
            <span>0.8</span>
            <span className="ok">9.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
