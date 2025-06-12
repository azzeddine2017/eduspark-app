import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  console.log('🔐 إنشاء حساب المدير...')

  try {
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // إنشاء حساب المدير
    const admin = await prisma.user.upsert({
      where: { email: 'admin@fateh.edu' },
      update: {},
      create: {
        email: 'admin@fateh.edu',
        name: 'مدير المنصة',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        phone: '+966500000000',
        location: 'الرياض، المملكة العربية السعودية',
        bio: 'مدير عام منصة فتح التعليمية الموزعة',
        occupation: 'مدير منصة تعليمية'
      }
    })

    console.log('✅ تم إنشاء حساب المدير بنجاح!')
    console.log('📧 البريد الإلكتروني: admin@fateh.edu')
    console.log('🔑 كلمة المرور: admin123')
    console.log('👤 الاسم:', admin.name)
    console.log('🆔 المعرف:', admin.id)

  } catch (error) {
    console.error('❌ خطأ في إنشاء حساب المدير:', error)
    throw error
  }
}

// تشغيل السكريبت
createAdmin()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
