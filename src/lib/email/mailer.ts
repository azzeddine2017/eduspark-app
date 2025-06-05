import nodemailer from 'nodemailer'
import { NotificationType } from '@prisma/client'
import { createNotificationFromTemplate, NotificationData } from '../notifications/templates'

// واجهة إعدادات البريد الإلكتروني
interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// واجهة خيارات البريد الإلكتروني
interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

// واجهة نتيجة الإرسال
interface SendResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * مدير البريد الإلكتروني
 */
export class EmailManager {
  private transporter: nodemailer.Transporter | null = null
  private config: EmailConfig

  constructor() {
    // إعدادات البريد الإلكتروني من متغيرات البيئة
    this.config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    }

    this.initializeTransporter()
  }

  /**
   * تهيئة ناقل البريد الإلكتروني
   */
  private initializeTransporter() {
    try {
      if (!this.config.auth.user || !this.config.auth.pass) {
        console.warn('إعدادات البريد الإلكتروني غير مكتملة')
        return
      }

      this.transporter = nodemailer.createTransporter({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: this.config.auth,
        tls: {
          rejectUnauthorized: false
        }
      })

      console.log('تم تهيئة ناقل البريد الإلكتروني بنجاح')
    } catch (error) {
      console.error('خطأ في تهيئة ناقل البريد الإلكتروني:', error)
    }
  }

  /**
   * التحقق من اتصال البريد الإلكتروني
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false
    }

    try {
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error('فشل في التحقق من اتصال البريد الإلكتروني:', error)
      return false
    }
  }

  /**
   * إرسال بريد إلكتروني
   */
  async sendEmail(options: EmailOptions): Promise<SendResult> {
    if (!this.transporter) {
      return {
        success: false,
        error: 'ناقل البريد الإلكتروني غير متاح'
      }
    }

    try {
      const mailOptions = {
        from: options.from || `"منصة فتح" <${this.config.auth.user}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html)
      }

      const result = await this.transporter.sendMail(mailOptions)

      return {
        success: true,
        messageId: result.messageId
      }
    } catch (error) {
      console.error('خطأ في إرسال البريد الإلكتروني:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      }
    }
  }

  /**
   * إرسال إشعار عبر البريد الإلكتروني باستخدام القوالب
   */
  async sendNotificationEmail(
    to: string | string[],
    type: NotificationType,
    data: NotificationData
  ): Promise<SendResult> {
    try {
      // إنشاء محتوى الإشعار من القالب
      const templateContent = createNotificationFromTemplate(type, data)

      if (!templateContent.emailSubject || !templateContent.emailBody) {
        return {
          success: false,
          error: 'قالب البريد الإلكتروني غير متاح لهذا النوع من الإشعارات'
        }
      }

      // إنشاء HTML كامل للبريد الإلكتروني
      const htmlContent = this.createEmailTemplate(
        templateContent.emailSubject,
        templateContent.emailBody,
        data
      )

      return await this.sendEmail({
        to,
        subject: templateContent.emailSubject,
        html: htmlContent
      })
    } catch (error) {
      console.error('خطأ في إرسال إشعار البريد الإلكتروني:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      }
    }
  }

  /**
   * إنشاء قالب HTML كامل للبريد الإلكتروني
   */
  private createEmailTemplate(subject: string, body: string, data: NotificationData): string {
    const currentYear = new Date().getFullYear()
    const platformUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .content p {
            margin-bottom: 15px;
            font-size: 16px;
            line-height: 1.8;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
        }
        .info-box {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .info-box h3 {
            color: #0369a1;
            margin-top: 0;
            font-size: 18px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #6b7280;
            font-size: 14px;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
            .header {
                padding: 20px !important;
            }
            .header h1 {
                font-size: 24px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- رأس البريد الإلكتروني -->
        <div class="header">
            <h1>🌟 منصة فتح للتعلّم الذكي</h1>
            <p>حيث يلتقي التعلم بالذكاء الاصطناعي</p>
        </div>

        <!-- محتوى البريد الإلكتروني -->
        <div class="content">
            ${body}
            
            ${data.actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
                <a href="${platformUrl}${data.actionUrl}" class="button">
                    عرض التفاصيل
                </a>
            </div>
            ` : ''}

            <div class="info-box">
                <h3>💡 نصائح للنجاح</h3>
                <p>• تفاعل مع المحتوى التعليمي بانتظام</p>
                <p>• استخدم المساعد الذكي لطرح الأسئلة</p>
                <p>• شارك في المناقشات مع زملائك</p>
                <p>• تابع تقدمك وحدد أهدافاً واضحة</p>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                إذا كان لديك أي أسئلة أو تحتاج للمساعدة، لا تتردد في التواصل معنا.
            </p>
        </div>

        <!-- تذييل البريد الإلكتروني -->
        <div class="footer">
            <p><strong>منصة فتح للتعلّم الذكي</strong></p>
            <p>تعليم مجاني وذكي للجميع</p>
            
            <div class="social-links">
                <a href="${platformUrl}">الموقع الرئيسي</a> |
                <a href="${platformUrl}/courses">الدورات</a> |
                <a href="${platformUrl}/support">الدعم</a>
            </div>

            <p style="font-size: 12px; margin-top: 20px;">
                © ${currentYear} منصة فتح. جميع الحقوق محفوظة.
            </p>
            
            <p style="font-size: 12px; color: #9ca3af;">
                تم إرسال هذا البريد الإلكتروني إليك لأنك مسجل في منصة فتح.
                <br>
                يمكنك <a href="${platformUrl}/settings/notifications">تعديل إعدادات الإشعارات</a> في أي وقت.
            </p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * إزالة علامات HTML من النص
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }

  /**
   * إرسال بريد إلكتروني للترحيب بالمستخدمين الجدد
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<SendResult> {
    const data: NotificationData = {
      userName,
      platformUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000'
    }

    const welcomeBody = `
      <h2>مرحباً بك ${userName}! 🎉</h2>
      <p>نحن سعداء جداً لانضمامك إلى منصة فتح للتعلّم الذكي!</p>
      
      <p>منصة فتح هي منصة تعليمية مجانية تهدف إلى فتح آفاق المعرفة للجميع باستخدام أحدث تقنيات الذكاء الاصطناعي.</p>
      
      <h3>ما يمكنك فعله الآن:</h3>
      <ul>
        <li>🎓 استكشاف الدورات التعليمية المتنوعة</li>
        <li>🤖 التفاعل مع المساعد الذكي</li>
        <li>📊 تتبع تقدمك في التعلم</li>
        <li>🏆 الحصول على شهادات الإكمال</li>
      </ul>
      
      <p>ابدأ رحلتك التعليمية الآن واكتشف عالماً جديداً من المعرفة!</p>
    `

    const htmlContent = this.createEmailTemplate(
      'مرحباً بك في منصة فتح للتعلّم الذكي! 🌟',
      welcomeBody,
      data
    )

    return await this.sendEmail({
      to: userEmail,
      subject: 'مرحباً بك في منصة فتح للتعلّم الذكي! 🌟',
      html: htmlContent
    })
  }

  /**
   * إرسال بريد إلكتروني لإعادة تعيين كلمة المرور
   */
  async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<SendResult> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
    
    const resetBody = `
      <h2>إعادة تعيين كلمة المرور 🔐</h2>
      <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في منصة فتح.</p>
      
      <p>إذا كنت قد طلبت إعادة تعيين كلمة المرور، انقر على الرابط أدناه:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">
          إعادة تعيين كلمة المرور
        </a>
      </div>
      
      <p><strong>ملاحظة مهمة:</strong></p>
      <ul>
        <li>هذا الرابط صالح لمدة 24 ساعة فقط</li>
        <li>إذا لم تطلب إعادة تعيين كلمة المرور، تجاهل هذا البريد الإلكتروني</li>
        <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
      </ul>
    `

    const htmlContent = this.createEmailTemplate(
      'إعادة تعيين كلمة المرور - منصة فتح',
      resetBody,
      { resetUrl }
    )

    return await this.sendEmail({
      to: userEmail,
      subject: 'إعادة تعيين كلمة المرور - منصة فتح',
      html: htmlContent
    })
  }
}

// إنشاء مثيل واحد من مدير البريد الإلكتروني
export const emailManager = new EmailManager()

// دوال مساعدة سريعة
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<SendResult> {
  return emailManager.sendWelcomeEmail(userEmail, userName)
}

export async function sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<SendResult> {
  return emailManager.sendPasswordResetEmail(userEmail, resetToken)
}

export async function sendNotificationEmail(
  to: string | string[],
  type: NotificationType,
  data: NotificationData
): Promise<SendResult> {
  return emailManager.sendNotificationEmail(to, type, data)
}
