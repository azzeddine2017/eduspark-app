# مخطط قاعدة البيانات المفصل لمشروع EduSpark (Prisma Schema)

هذا المستند يقدم مخطط Prisma المفصل لقاعدة البيانات لمشروع "منصة التعلّم الذكي EduSpark"، بناءً على المتطلبات الأولية والمخطط الأولي المقترح. يشمل هذا المخطط تعريف النماذج (Models)، الحقول (Fields)، أنواع البيانات (Data Types)، العلاقات (Relations)، والقيود (Constraints) اللازمة.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  STUDENT
  ADMIN
}

model User {
  id                String              @id @default(cuid())
  name              String?
  email             String              @unique
  password          String              // Hashed password
  role              Role                @default(STUDENT)
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  authoredCourses   Course[]            @relation("AuthorCourses")
  enrollments       Enrollment[]
  llmInteractions   LLMInteractionLog[]
}

model Course {
  id          String       @id @default(cuid())
  title       String
  description String?
  published   Boolean      @default(false)
  authorId    String
  author      User         @relation("AuthorCourses", fields: [authorId], references: [id])
  lessons     Lesson[]
  enrollments Enrollment[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([authorId])
}

model Lesson {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text // Can store rich text (e.g., JSON stringified HTML or Markdown)
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id])
  order     Int      @default(0) // Order of the lesson within the course
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  llmInteractionLogs LLMInteractionLog[]

  @@unique([courseId, order]) // Ensure unique order within a course
  @@index([courseId])
}

model Enrollment {
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  courseId   String
  course     Course   @relation(fields: [courseId], references: [id])
  enrolledAt DateTime @default(now())
  progress   Json?    // Can store progress details, e.g., { "completedLessons": ["lessonId1", "lessonId2"] }

  @@id([userId, courseId]) // Composite primary key
  @@index([userId])
  @@index([courseId])
}

model LLMInteractionLog {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  prompt    String    @db.Text
  response  String    @db.Text
  lessonId  String?
  lesson    Lesson?   @relation(fields: [lessonId], references: [id])
  timestamp DateTime  @default(now())
  cost      Float?    // Optional: Store cost if API provides it

  @@index([userId])
  @@index([lessonId])
}

// Future models (optional, can be added later)
// model Quiz {
//   id        String   @id @default(cuid())
//   title     String
//   lessonId  String
//   lesson    Lesson   @relation(fields: [lessonId], references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   questions Question[]
// }

// model Question {
//   id      String   @id @default(cuid())
//   quizId  String
//   quiz    Quiz     @relation(fields: [quizId], references: [id])
//   text    String   @db.Text
//   type    String   // e.g., "multiple-choice", "true-false", "text"
//   options Json?    // For multiple-choice: ["Option A", "Option B"]
//   answer  String   @db.Text // Correct answer
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

// model Answer {
//   id          String   @id @default(cuid())
//   questionId  String
//   question    Question @relation(fields: [questionId], references: [id])
//   userId      String
//   user        User     @relation(fields: [userId], references: [id])
//   submittedAnswer String @db.Text
//   isCorrect   Boolean?
//   feedback    String?  @db.Text // LLM generated feedback
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt
// }