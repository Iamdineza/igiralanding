export const blogArticles = [
  { slug: 'right-of-way-rwanda', category: 'Traffic Rules', title: 'Understanding Right of Way in Rwanda', excerpt: 'Learn how right of way works at intersections, roundabouts and busy roads across Rwanda.', readTime: '5 min read', imageKey: 'blogFeatured' as const },
  { slug: 'traffic-rules-every-learner', category: 'Traffic Rules', title: 'The Road Rules Every Learner Should Know', excerpt: 'A clear guide to the essential rules that keep every road user safer.', readTime: '4 min read', imageKey: 'blogTrafficRules' as const },
  { slug: 'warning-road-signs', category: 'Road Signs', title: 'Understanding Warning Road Signs', excerpt: 'Recognize the signs that help you anticipate hazards before they appear.', readTime: '6 min read', imageKey: 'blogRoadSigns' as const },
  { slug: 'prepare-driving-theory-test', category: 'Driving Guide', title: 'How to Prepare for Your Driving Theory Test', excerpt: 'A practical study plan to help you learn the rules, practice consistently and arrive ready.', readTime: '7 min read', imageKey: 'blogDrivingGuide' as const },
]

export function getArticle(slug: string) { return blogArticles.find((article) => article.slug === slug) }
export const blogCategories = ['All', 'Traffic Rules', 'Road Signs', 'Driving Guide'] as const
export type BlogCategory = typeof blogCategories[number]
