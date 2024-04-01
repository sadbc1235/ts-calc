import Header from "../components/header"
import "../styles/global.css"
import { Metadata } from "next"

export const metadata :Metadata = {
  title: {
    template: "%s | calc",
    default: "Home"
  },
  description: 'ts-calc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="kr">
      <body>
        <Header/>
        {children}
      </body>
    </html>
  )
}
