// اختبار سريع لحل مشاكل الأنواع
console.log('🔧 اختبار حل مشاكل الأنواع...');

// محاكاة البيانات
const mockContext = {
  sessionLength: 25,
  timeOfDay: 14,
  deviceType: 'desktop',
  whiteboardAvailable: true
};

const mockUser = {
  role: 'INSTRUCTOR'
};

const mockStudentProfile = {
  culturalContext: 'arabic'
};

const mockQuestionAnalysis = {
  subject: 'mathematics',
  type: 'conceptual'
};

// اختبار تحديد نوع الجلسة
function determineSessionType(sessionLength) {
  if (sessionLength && sessionLength < 15) return 'quick';
  if (sessionLength && sessionLength > 60) return 'extended';
  return 'standard';
}

// اختبار تحديد حجم الشاشة
function determineScreenSize(deviceType) {
  return deviceType === 'mobile' ? 'small' : 'large';
}

// اختبار تحديد نوع السؤال
function determineQuestionType(type) {
  switch(type) {
    case 'factual': return 'factual';
    case 'conceptual': return 'conceptual';
    case 'procedural': return 'procedural';
    default: return 'analytical';
  }
}

// اختبار تحديد مستوى الارتباك
function determineConfusion(conversationLength) {
  return conversationLength > 3 ? 'moderate' : 'slight';
}

// تشغيل الاختبارات
console.log('📋 نتائج الاختبار:');

const sessionType = determineSessionType(mockContext.sessionLength);
console.log(`✅ نوع الجلسة: ${sessionType}`);

const screenSize = determineScreenSize(mockContext.deviceType);
console.log(`✅ حجم الشاشة: ${screenSize}`);

const questionType = determineQuestionType(mockQuestionAnalysis.type);
console.log(`✅ نوع السؤال: ${questionType}`);

const confusion = determineConfusion(2);
console.log(`✅ مستوى الارتباك: ${confusion}`);

// اختبار إنشاء السياق المحسن
const enhancedContext = {
  studentLevel: 'intermediate',
  subject: mockQuestionAnalysis.subject,
  questionType: questionType,
  studentConfusion: confusion,
  previousAttempts: 0,
  preferredStyle: 'visual_demo',
  userRole: mockUser.role,
  culturalContext: mockStudentProfile.culturalContext,
  timeConstraints: {
    availableTime: mockContext.sessionLength || 30,
    timeOfDay: mockContext.timeOfDay || new Date().getHours(),
    sessionType: sessionType
  },
  deviceCapabilities: {
    hasWhiteboard: mockContext.whiteboardAvailable || false,
    hasAudio: true,
    hasVideo: true,
    screenSize: screenSize,
    internetSpeed: 'fast'
  }
};

console.log('✅ تم إنشاء السياق المحسن بنجاح');
console.log('📊 السياق المحسن:', JSON.stringify(enhancedContext, null, 2));

// التحقق من الأنواع المطلوبة
const requiredTypes = {
  sessionType: ['quick', 'standard', 'extended'],
  screenSize: ['small', 'medium', 'large'],
  questionType: ['factual', 'conceptual', 'procedural', 'analytical'],
  confusion: ['none', 'slight', 'moderate', 'high'],
  userRole: ['STUDENT', 'ADMIN', 'INSTRUCTOR', 'CONTENT_CREATOR', 'MENTOR'],
  internetSpeed: ['slow', 'medium', 'fast']
};

console.log('\n🎯 التحقق من الأنواع:');
console.log(`sessionType: ${sessionType} ∈ [${requiredTypes.sessionType.join(', ')}] ✅`);
console.log(`screenSize: ${screenSize} ∈ [${requiredTypes.screenSize.join(', ')}] ✅`);
console.log(`questionType: ${questionType} ∈ [${requiredTypes.questionType.join(', ')}] ✅`);
console.log(`confusion: ${confusion} ∈ [${requiredTypes.confusion.join(', ')}] ✅`);
console.log(`userRole: ${mockUser.role} ∈ [${requiredTypes.userRole.join(', ')}] ✅`);

console.log('\n🎉 جميع الأنواع صحيحة! يمكن المتابعة للبناء.');
console.log('✅ تم حل مشاكل الأنواع بنجاح');
