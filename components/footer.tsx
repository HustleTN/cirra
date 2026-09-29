const links = ["Technology", "Materials", "Systems", "Circularity", "Company"];

export default function Footer() {
  return (
    <footer
      className="
        border-t
        border-white/[0.1]

        bg-[#071018]

        px-5
        pb-8
        pt-12

        text-white

        sm:px-8

        lg:px-14
      "
    >
      <div className="mx-auto max-w-[1500px]">
        <div
          className="
            flex
            flex-col
            gap-10

            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <p className="text-[23px] font-semibold tracking-[0.16em]">CIRA</p>

            <p className="mt-3 max-w-[250px] text-[12px] leading-[1.6] text-white/38">
              From material to motion.
              <br />
              And back again.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-x-12
              gap-y-3

              sm:flex
              sm:gap-7
            "
          >
            {links.map((link) => (
              <a
                key={link}
                href="#"
                className="
                  text-[11px]
                  text-white/42

                  transition-colors

                  hover:text-white
                "
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div
          className="
            mt-16
            flex
            flex-col
            gap-3

            border-t
            border-white/[0.08]

            pt-6

            text-[10px]
            text-white/28

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>© 2026 CIRA</p>

          <p>Closed-loop energy systems.</p>
        </div>
      </div>
    </footer>
  );
}
