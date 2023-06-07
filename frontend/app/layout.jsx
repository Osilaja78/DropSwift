import Navbar from "@/components/navbar"

export const metadata = {
  title: 'DropSwift',
  description: 'DropSwift E-commerce store.',
}
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
