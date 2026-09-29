export default function Contact() {
  return (
    <section
      id="contact"
      className="
        bg-[#071018]
        px-5
        py-28
        text-white

        sm:px-8
        sm:py-36

        lg:px-14
        lg:py-44
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-[1500px]
          flex-col
          items-start
          justify-between
          gap-12

          lg:flex-row
          lg:items-end
        "
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7CB2A9]">
            Contact
          </p>

          <h2
            className="
              mt-5
              max-w-[850px]

              text-[clamp(3rem,6vw,7rem)]

              font-[450]

              leading-[0.91]

              tracking-[-0.06em]
            "
          >
            Build what comes next.
          </h2>
        </div>

        <div className="max-w-[350px]">
          <p className="text-[13px] leading-[1.65] text-white/48">
            Talk with CIRA about circular battery systems, materials and the
            next generation of electric mobility.
          </p>

          <button
            type="button"
            className="
              mt-7
              h-[46px]

              rounded-[9px]

              bg-[#7CB2A9]

              px-7

              text-[12px]
              font-semibold

              text-[#071018]

              transition-colors

              hover:bg-[#91C5BC]
            "
          >
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
}
