"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  className?: string
  showConfirmation?: boolean
  redirectTo?: string
}

export default function LogoutButton({ 
  className = "w-full btn btn-outline flex items-center justify-center text-error hover:bg-error hover:text-white",
  showConfirmation = true,
  redirectTo = "/"
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSignOut = async () => {
    if (showConfirmation && !showConfirm) {
      setShowConfirm(true)
      return
    }

    setIsLoading(true)
    try {
      await signOut({ 
        callbackUrl: redirectTo,
        redirect: true 
      })
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error)
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    handleSignOut()
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-surface rounded-lg p-6 max-w-md mx-4 shadow-xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-warning bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">
              تأكيد تسجيل الخروج
            </h3>
            <p className="text-medium-contrast arabic-text mb-6">
              هل أنت متأكد من أنك تريد تسجيل الخروج من حسابك؟
            </p>
            <div className="flex space-x-3 space-x-reverse">
              <button
                onClick={handleCancel}
                className="flex-1 btn btn-outline"
                disabled={isLoading}
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 btn btn-primary bg-error hover:bg-error-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    جاري الخروج...
                  </div>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل الخروج
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignOut}
      className={className}
      disabled={isLoading}
      title="تسجيل الخروج"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-2"></div>
          جاري الخروج...
        </div>
      ) : (
        <>
          <LogOut className="w-4 h-4 ml-2" />
          تسجيل الخروج
        </>
      )}
    </button>
  )
}
