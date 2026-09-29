const stages = [
  {
    number: "01",
    title: "Material",
    body: "Recover and refine critical resources.",
  },
  {
    number: "02",
    title: "Cell",
    body: "Turn material into stored energy.",
  },
  {
    number: "03",
    title: "System",
    body: "Connect cells into intelligent architecture.",
  },
  {
    number: "04",
    title: "Motion",
    body: "Deploy energy where performance matters.",
  },
  {
    number: "05",
    title: "Return",
    body: "Bring valuable material back into the cycle.",
  },
];

export default function Circularity() {
  return (
    <section
      id="circularity"
      className="
        border-y
        border-white/[0.08]
        bg-[#0A131B]
        px-5
        py-24
        text-white

        sm:px-8
        sm:py-32

        lg:px-14
        lg:py-36
      "
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="max-w-[850px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7CB2A9]">
            The system
          </p>

          <h2
            className="
              mt-5
              text-[clamp(2.7rem,5vw,5.7rem)]
              font-[450]
              leading-[0.96]
              tracking-[-0.055em]
            "
          >
            Five forms.
            <br />
            One material story.
          </h2>
        </div>

        <div
          className="
            mt-16
            grid
            border-t
            border-white/[0.1]

            sm:grid-cols-2

            lg:mt-24
            lg:grid-cols-5
          "
        >
          {stages.map((stage, index) => (
            <div
              key={stage.number}
              className={`
                min-h-[210px]
                border-b
                border-white/[0.1]
                py-6

                sm:px-5

                lg:min-h-[280px]
                lg:border-b-0
                lg:px-6
                lg:py-7

                ${
                  index !== 0
                    ? "lg:border-l lg:border-white/[0.1]"
                    : ""
                }
              `}
            >
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7CB2A9]">
                {stage.number}
              </p>

              <h3
                className="
                  mt-16
                  text-[25px]
                  font-medium
                  tracking-[-0.04em]

                  lg:mt-24
                "
              >
                {stage.title}
              </h3>

              <p className="mt-3 max-w-[210px] text-[12px] leading-[1.55] text-white/45">
                {stage.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}