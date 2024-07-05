import { Inter } from "next/font/google"

import Stock from "@/components/stock"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className={`min-h-screen p-24 ${inter.className}`}>
      <Stock />
    </main>
  )
}
