export default function About() {
  return (
    <section
      id="about"
      className="
        bg-[#071018]
        px-5
        py-24
        text-white

        sm:px-8
        sm:py-32

        lg:px-14
        lg:py-40
      "
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#7CB2A9]
              "
            >
              About CIRA
            </p>

            <p className="mt-4 max-w-[270px] text-[13px] leading-[1.65] text-white/45">
              A new approach to energy built around continuity,
              recovery and intelligent reuse.
            </p>
          </div>

          <div>
            <h2
              className="
                max-w-[980px]
                text-[clamp(2.7rem,5vw,6rem)]
                font-[450]
                leading-[0.96]
                tracking-[-0.055em]
              "
            >
              Energy should not have a one-way lifecycle.
            </h2>

            <div
              className="
                mt-12
                grid
                gap-8
                border-t
                border-white/[0.1]
                pt-8

                sm:grid-cols-3

                lg:mt-16
              "
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#7CB2A9]">
                  Recover
                </p>

                <p className="mt-3 max-w-[260px] text-[13px] leading-[1.6] text-white/50">
                  Valuable materials are brought back into the
                  energy system instead of reaching a dead end.
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#7CB2A9]">
                  Engineer
                </p>

                <p className="mt-3 max-w-[260px] text-[13px] leading-[1.6] text-white/50">
                  Materials become cells and systems designed for
                  demanding electric applications.
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#7CB2A9]">
                  Return
                </p>

                <p className="mt-3 max-w-[260px] text-[13px] leading-[1.6] text-white/50">
                  At the end of one cycle, the material journey
                  begins again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}