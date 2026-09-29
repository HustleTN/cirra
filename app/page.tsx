import { Manrope } from "next/font/google";

import Header from "@/components/header";
import About from "@/components/about";
import Circularity from "@/components/circularity";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <main className={`${manrope.className} bg-[#071018] overflow-x-clip`}>
      <Header />
    </main>
  );
}
