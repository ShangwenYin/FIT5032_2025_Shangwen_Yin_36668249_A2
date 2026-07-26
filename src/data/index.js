/**
 * MindWell Connect — Mock Data, Seed Users & Utilities
 * FIT5032 Assignment 2
 */

// ============================================================
// Seed Users
// ============================================================
export const SEED_USERS = [
  {
    id: 1, name: 'Sarah Chen', email: 'sarah@example.com',
    password: 'Password1', role: 'client',
    savedResources: [1, 3, 6],
    ratings: { 1: 4, 3: 5, 6: 4 }
  },
  {
    id: 2, name: 'Michael Torres', email: 'michael@example.com',
    password: 'Password1', role: 'client',
    savedResources: [2, 5],
    ratings: { 2: 5, 4: 3, 5: 4 }
  },
  {
    id: 3, name: 'Dr. Priya Sharma', email: 'dr.sharma@mindwell.org',
    password: 'Counsellor1', role: 'counsellor',
    savedResources: [], ratings: {},
    clients: [1, 2, 4, 5]
  },
  {
    id: 4, name: 'James Liu', email: 'james@example.com',
    password: 'Password1', role: 'client',
    savedResources: [1, 4],
    ratings: { 1: 3, 4: 5 }
  },
  {
    id: 5, name: 'Maria Rossi', email: 'maria@example.com',
    password: 'Password1', role: 'client',
    savedResources: [3, 6],
    ratings: { 3: 4, 6: 5 }
  }
]

// ============================================================
// Resources
// ============================================================
export const RESOURCES = [
  {
    id: 1, title: 'Understanding Anxiety: A Comprehensive Guide',
    type: 'article', category: 'Understanding Conditions',
    topic: 'Anxiety', level: 'Beginner',
    description: 'Learn what anxiety is, common symptoms, and when to seek professional help.',
    content: 'Anxiety is a natural response to stress, but when it becomes overwhelming and persistent, it may indicate an anxiety disorder. Common symptoms include excessive worry, restlessness, difficulty concentrating, irritability, muscle tension, and sleep disturbances. Cognitive Behavioural Therapy (CBT) is one of the most effective treatments. Remember: seeking help is a sign of strength, not weakness.',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
    ratings: [4, 5, 5, 4, 5, 3, 4, 5, 4, 4], downloads: 1247
  },
  {
    id: 2, title: '5 CBT Techniques for Daily Practice',
    type: 'article', category: 'Self-Help Techniques',
    topic: 'Anxiety', level: 'Intermediate',
    description: 'Practical Cognitive Behavioural Therapy techniques you can use every day.',
    content: '1. Cognitive Restructuring: Identify and challenge negative thought patterns. 2. Behavioural Activation: Schedule pleasant activities even when you don\'t feel like it. 3. Exposure Therapy: Gradually face feared situations. 4. Journaling: Track thoughts, feelings, and behaviors to identify patterns. 5. Relaxation Techniques: Practice deep breathing and progressive muscle relaxation.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    ratings: [5, 4, 4, 5, 5, 4, 3, 5, 4, 5], downloads: 892
  },
  {
    id: 3, title: 'Guided Breathing Exercise (10 min)',
    type: 'video', category: 'Mindfulness & Meditation',
    topic: 'Mindfulness', level: 'All',
    description: 'A calming 10-minute guided breathing exercise to reduce stress.',
    content: 'Find a comfortable seated position. Close your eyes gently. Begin by taking a deep breath in through your nose for 4 counts, hold for 4 counts, and exhale slowly through your mouth for 6 counts. Repeat this cycle, allowing your shoulders to drop and your jaw to relax with each exhale.',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400',
    ratings: [5, 5, 5, 4, 5, 5, 4, 5, 5, 4], downloads: 2156
  },
  {
    id: 4, title: 'Managing Panic Attacks at Work',
    type: 'article', category: 'Coping Strategies',
    topic: 'Anxiety', level: 'Advanced',
    description: 'Strategies for managing panic attacks in professional environments.',
    content: 'Panic attacks can feel overwhelming, especially at work. Early warning signs include racing heart, shortness of breath, dizziness, and feelings of detachment. The 5-4-3-2-1 grounding technique helps: identify 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Having a discrete exit strategy and a trusted colleague who knows your situation provides security.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    ratings: [4, 5, 4, 3, 4, 5, 4, 4, 5, 4], downloads: 678
  },
  {
    id: 5, title: 'Anxiety Self-Assessment Worksheet',
    type: 'worksheet', category: 'Self-Help Techniques',
    topic: 'Self-Help', level: 'All',
    description: 'A structured GAD-7 based self-assessment tool to track anxiety symptoms.',
    content: 'Over the last 2 weeks, how often have you been bothered by: 1. Feeling nervous, anxious, or on edge? 2. Not being able to stop or control worrying? 3. Worrying too much about different things? 4. Trouble relaxing? 5. Being so restless that it\'s hard to sit still? 6. Becoming easily annoyed or irritable? 7. Feeling afraid as if something awful might happen? Score each from 0 (not at all) to 3 (nearly every day). Total: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
    ratings: [4, 4, 5, 4, 5, 4, 4, 3, 5, 4], downloads: 1534
  },
  {
    id: 6, title: 'Introduction to Mindfulness Meditation',
    type: 'video', category: 'Mindfulness & Meditation',
    topic: 'Mindfulness', level: 'Beginner',
    description: 'A beginner-friendly introduction to mindfulness meditation practice.',
    content: 'Mindfulness is the practice of paying attention to the present moment without judgment. Start by finding a quiet space and sitting comfortably. Focus on your breath — the sensation of air moving in and out. When your mind wanders (which it will), gently bring it back without self-criticism. Start with 5 minutes daily. Research shows regular practice reduces anxiety, improves focus, and enhances emotional regulation.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    ratings: [5, 5, 4, 5, 5, 5, 4, 4, 5, 5], downloads: 1893
  },
  {
    id: 7, title: 'Understanding Depression and Treatment Options',
    type: 'article', category: 'Understanding Conditions',
    topic: 'Depression', level: 'Beginner',
    description: 'An overview of depression including symptoms and treatment approaches.',
    content: 'Depression is more than just feeling sad — it is a serious mental health condition affecting how you think, feel, and handle daily activities. Symptoms include persistent sadness, loss of interest, changes in appetite/sleep, fatigue, and difficulty concentrating. Treatment options include psychotherapy (CBT, interpersonal therapy), medication (SSRIs), lifestyle changes, and support groups.',
    image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400',
    ratings: [4, 5, 4, 5, 4, 5, 4, 4, 5, 4], downloads: 1032
  },
  {
    id: 8, title: 'Building Healthy Sleep Habits',
    type: 'article', category: 'Lifestyle & Wellness',
    topic: 'Sleep', level: 'All',
    description: 'Evidence-based strategies for improving sleep quality.',
    content: 'Good sleep hygiene is crucial for mental health. Key strategies: maintain a consistent sleep schedule, create a relaxing bedtime routine, keep your bedroom cool and dark, avoid screens 1 hour before bed, limit caffeine after 2 PM, and get regular exercise. If you cannot fall asleep within 20 minutes, get up and do something calming until drowsy.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
    ratings: [4, 4, 5, 4, 4, 5, 4, 5, 4, 4], downloads: 756
  },
  {
    id: 9, title: 'Progressive Muscle Relaxation Guide',
    type: 'video', category: 'Mindfulness & Meditation',
    topic: 'Stress Management', level: 'All',
    description: 'Learn progressive muscle relaxation to reduce physical tension and stress.',
    content: 'Progressive Muscle Relaxation involves systematically tensing then relaxing different muscle groups. Start with your feet: tense for 5 seconds, release and notice relaxation for 10 seconds. Work up through calves, thighs, abdomen, chest, arms, hands, neck, and face. This practice helps you recognize the difference between tension and relaxation.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400',
    ratings: [5, 4, 5, 4, 5, 4, 5, 5, 4, 5], downloads: 921
  },
  {
    id: 10, title: 'Thought Record Worksheet (CBT)',
    type: 'worksheet', category: 'Self-Help Techniques',
    topic: 'Self-Help', level: 'Intermediate',
    description: 'A CBT thought record to identify and reframe negative automatic thoughts.',
    content: 'Step 1: Identify the Situation — What happened? Step 2: Identify Your Mood — What did you feel? Rate 0-100. Step 3: Automatic Thoughts — What went through your mind? Step 4: Evidence For — What facts support this thought? Step 5: Evidence Against — What facts contradict it? Step 6: Balanced Thought — A more realistic perspective. Step 7: Re-rate Your Mood.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400',
    ratings: [5, 4, 5, 4, 5, 4, 4, 5, 4, 5], downloads: 1104
  },
  {
    id: 11, title: 'Supporting a Loved One with Mental Health Challenges',
    type: 'article', category: 'Family & Relationships',
    topic: 'Relationships', level: 'All',
    description: 'Practical guidance for family and friends on providing effective support.',
    content: 'Supporting someone with mental health challenges requires patience, empathy, and self-care. Listen without judgment, validate their feelings, avoid unsolicited advice. Educate yourself about their condition. Encourage professional help without being pushy. Know crisis warning signs and have emergency numbers ready. Remember: maintain your own support network and practice self-care.',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400',
    ratings: [5, 5, 4, 5, 5, 4, 5, 5, 4, 5], downloads: 845
  },
  {
    id: 12, title: 'Nutrition and Mental Health: The Gut-Brain Connection',
    type: 'article', category: 'Lifestyle & Wellness',
    topic: 'Wellness', level: 'Intermediate',
    description: 'Explore how nutrition affects mental health through the gut-brain axis.',
    content: 'The gut-brain axis is a bidirectional communication system between your digestive tract and brain. A healthy gut microbiome positively influences mood, anxiety, and cognitive function. Foods rich in omega-3 (salmon, walnuts), probiotics (yogurt, kimchi), and antioxidants (berries, dark chocolate) support brain health. Highly processed foods and excessive sugar are linked to increased depression risk.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    ratings: [4, 4, 5, 4, 4, 5, 4, 4, 5, 4], downloads: 632
  }
]

// ============================================================
// Data Initialisation
// ============================================================
export function initialiseData() {
  if (!localStorage.getItem('mindwell_users')) {
    localStorage.setItem('mindwell_users', JSON.stringify(SEED_USERS))
  }
  if (!localStorage.getItem('mindwell_ratings')) {
    const ratings = {}
    RESOURCES.forEach(r => { ratings[r.id] = [...r.ratings] })
    localStorage.setItem('mindwell_ratings', JSON.stringify(ratings))
  }
}

// ============================================================
// Utility Functions
// ============================================================
export function getUsers() {
  return JSON.parse(localStorage.getItem('mindwell_users') || '[]')
}

export function saveUsers(users) {
  localStorage.setItem('mindwell_users', JSON.stringify(users))
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('mindwell_currentUser') || 'null')
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('mindwell_currentUser', JSON.stringify(user))
  } else {
    localStorage.removeItem('mindwell_currentUser')
  }
}

export function getRatings() {
  return JSON.parse(localStorage.getItem('mindwell_ratings') || '{}')
}

export function saveRatings(ratings) {
  localStorage.setItem('mindwell_ratings', JSON.stringify(ratings))
}

export function calculateAverage(ratings) {
  if (!ratings || ratings.length === 0) return 0
  const sum = ratings.reduce((a, b) => a + b, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isStrongPassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
}
