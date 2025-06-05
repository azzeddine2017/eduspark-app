import { ReactNode } from "react"
import Link from "next/link"
import Header from "./Header"
import Footer from "./Footer"
import { ArrowLeft, Home, ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PublicPageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  showBackButton?: boolean
  backUrl?: string
  headerProps?: {
    title?: string
    showBackButton?: boolean
    backUrl?: string
  }
}

export default function PublicPageLayout({
  children,
  title,
  description,
  breadcrumbs = [],
  showBackButton = true,
  backUrl = "/",
  headerProps
}: PublicPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title={headerProps?.title}
        showBackButton={headerProps?.showBackButton}
        backUrl={headerProps?.backUrl}
      />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="bg-surface border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <nav className="flex items-center space-x-2 space-x-reverse text-sm">
                <Link
                  href="/"
                  className="flex items-center text-textSecondary hover:text-primary transition-colors arabic-text"
                >
                  <Home className="w-4 h-4 ml-1" />
                  الرئيسية
                </Link>
                
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-textSecondary mx-2" />
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-textSecondary hover:text-primary transition-colors arabic-text"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-high-contrast arabic-text font-medium">
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Page Header */}
        {(title || description) && (
          <div className="bg-gradient-to-r from-primary to-secondary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                {title && (
                  <h1 className="text-4xl font-bold arabic-text mb-4">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-lg opacity-90 arabic-text max-w-3xl mx-auto">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>

        {/* Back to Home Button */}
        {showBackButton && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="text-center">
              <Link
                href={backUrl}
                className="inline-flex items-center text-primary hover:text-primary-dark transition-colors arabic-text"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

// مكون مساعد لإنشاء صفحة عامة بسيطة
interface SimplePublicPageProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  children: ReactNode
  className?: string
}

export function SimplePublicPage({
  title,
  description,
  breadcrumbs = [],
  children,
  className = ""
}: SimplePublicPageProps) {
  return (
    <PublicPageLayout
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
    >
      <div className={`prose prose-lg max-w-none arabic-text ${className}`}>
        {children}
      </div>
    </PublicPageLayout>
  )
}

// مكون مساعد لإنشاء صفحة مع بطاقات
interface CardPageProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function CardPage({
  title,
  description,
  breadcrumbs = [],
  children,
  maxWidth = 'lg'
}: CardPageProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <PublicPageLayout
      breadcrumbs={breadcrumbs}
    >
      <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-high-contrast arabic-text mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-medium-contrast arabic-text max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </PublicPageLayout>
  )
}

// مكون مساعد لإنشاء صفحة مع شبكة
interface GridPageProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

export function GridPage({
  title,
  description,
  breadcrumbs = [],
  children,
  columns = 3,
  gap = 'md'
}: GridPageProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  return (
    <PublicPageLayout
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
    >
      <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]}`}>
        {children}
      </div>
    </PublicPageLayout>
  )
}

// مكون مساعد لإنشاء قسم في الصفحة
interface PageSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  background?: 'default' | 'surface' | 'gradient'
  padding?: 'sm' | 'md' | 'lg'
}

export function PageSection({
  title,
  description,
  children,
  className = "",
  background = 'default',
  padding = 'md'
}: PageSectionProps) {
  const backgroundClasses = {
    default: '',
    surface: 'bg-surface',
    gradient: 'bg-gradient-to-r from-primary to-secondary text-white'
  }

  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  }

  return (
    <section className={`${backgroundClasses[background]} ${paddingClasses[padding]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-3xl font-bold arabic-text mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg arabic-text max-w-3xl mx-auto opacity-90">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

// تصدير جميع المكونات
export { type BreadcrumbItem }
