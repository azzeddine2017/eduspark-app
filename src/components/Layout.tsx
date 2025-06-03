import { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"

interface LayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
  backUrl?: string
  showFooter?: boolean
}

export default function Layout({ 
  children, 
  title, 
  showBackButton = false, 
  backUrl = "/",
  showFooter = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title={title}
        showBackButton={showBackButton}
        backUrl={backUrl}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  )
}
