"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserRole } from "@prisma/client"
import { getRoleDescription } from "@/lib/permissions"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
}

interface RoleAssignmentFormProps {
  users: User[]
}

const AVAILABLE_ROLES: UserRole[] = [
  'STUDENT',
  'INSTRUCTOR',
  'CONTENT_CREATOR',
  'MENTOR',
  'COMMUNITY_MANAGER',
  'QUALITY_ASSURANCE',
  'ANALYTICS_SPECIALIST',
  'SUPPORT_SPECIALIST',
  'ADMIN'
]

export default function RoleAssignmentForm({ users }: RoleAssignmentFormProps) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUserId) {
      setMessage({ type: 'error', text: 'يرجى اختيار مستخدم' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserId,
          role: selectedRole,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'تم تعيين الدور بنجاح!' })
        setSelectedUserId('')
        setSelectedRole('STUDENT')
        // Refresh the page to show updated data
        router.refresh()
      } else {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ في تعيين الدور' })
      }
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال بالخادم' })
    } finally {
      setLoading(false)
    }
  }

  const selectedUser = users.find(u => u.id === selectedUserId)
  const selectedRoleInfo = getRoleDescription(selectedRole)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Selection */}
      <div>
        <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          اختر المستخدم
        </label>
        <select
          id="user"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">-- اختر مستخدم --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email}) - {getRoleDescription(user.role)?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Role Selection */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          اختر الدور الجديد
        </label>
        <select
          id="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          required
        >
          {AVAILABLE_ROLES.map((role) => {
            const roleInfo = getRoleDescription(role)
            return (
              <option key={role} value={role}>
                {roleInfo?.name || role}
              </option>
            )
          })}
        </select>
      </div>

      {/* Role Description */}
      {selectedRoleInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            وصف الدور: {selectedRoleInfo.name}
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            {selectedRoleInfo.description}
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            <strong>المسؤوليات الرئيسية:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {selectedRoleInfo.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Current vs New Role Comparison */}
      {selectedUser && selectedUser.role !== selectedRole && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            مقارنة الأدوار
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-yellow-700 dark:text-yellow-300">الدور الحالي:</span>
              <p className="text-yellow-600 dark:text-yellow-400">
                {getRoleDescription(selectedUser.role)?.name}
              </p>
            </div>
            <div>
              <span className="font-medium text-yellow-700 dark:text-yellow-300">الدور الجديد:</span>
              <p className="text-yellow-600 dark:text-yellow-400">
                {selectedRoleInfo?.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !selectedUserId}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'جاري التعيين...' : 'تعيين الدور'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
    </form>
  )
}
