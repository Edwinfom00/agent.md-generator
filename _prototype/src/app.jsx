/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */
/* global HeroScreen, Step01, Step02, Step03, Step04, ResultScreen */

const W = 1440;
const H = 1100;
const H_RESULT = 1020;

function App() {
  return (
    <DesignCanvas>
      <DCSection
        id="flow"
        title="agent.md generator — the brief"
        subtitle="A 4-step editorial flow that produces a production-grade AGENT.md. Powered by you, built by Edwin Fom."
      >
        <DCArtboard id="hero"   label="00 · Hero / Landing"             width={W} height={H}><HeroScreen /></DCArtboard>
        <DCArtboard id="s1"     label="01 · Identity"                   width={W} height={H}><Step01 /></DCArtboard>
        <DCArtboard id="s2"     label="02 · Tech Stack"                 width={W} height={H}><Step02 /></DCArtboard>
        <DCArtboard id="s3"     label="03 · Architecture"               width={W} height={H}><Step03 /></DCArtboard>
        <DCArtboard id="s4"     label="04 · Constraints"                width={W} height={H}><Step04 /></DCArtboard>
        <DCArtboard id="result" label="05 · Generated → download"       width={W} height={H_RESULT}><ResultScreen /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
