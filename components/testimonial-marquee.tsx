'use client'

import { Icon } from '@iconify/react'

const reviews = [
  { name: 'Aline M.', username: '@aline', body: 'The practice questions made the road signs finally click. I felt much calmer walking into my theory test.', profile: 'https://cdn.21st.dev/assets/mirror/b5/b539abc60701ab9cbcd73f9241d13a14a09582a4fd06c65784cb5567d77a2e0e.webp' },
  { name: 'Eric N.', username: '@ericn', body: 'I could study in short sessions after work and track what I still needed to improve.', profile: 'https://cdn.21st.dev/assets/mirror/2b/2bc5f22fa3400c61a2161d14e3dce5a0804badebfc1b3d9cbe844feaa3b72180.webp' },
  { name: 'Sandrine U.', username: '@sandrineu', body: 'Clear, practical and made for Rwanda. It feels much easier than studying from scattered notes.', profile: 'https://cdn.21st.dev/assets/mirror/e1/e1e172821860559f890ef5ef7c14cc66a6c1ec001f3bbeb6dddd349c0081dd6b.webp' },
  { name: 'Jean P.', username: '@jeanp', body: 'The mock tests helped me understand the pace and gave me confidence before exam day.', profile: 'https://cdn.21st.dev/assets/mirror/61/61fda783ca2662349458bad61a434038016f05d6a14bd7c5a314f48c8ee8be03.webp' },
  { name: 'Diane K.', username: '@dianek', body: 'Everything is simple to follow, and I can practice whenever I have a few spare minutes.', profile: 'https://cdn.21st.dev/assets/mirror/c5/c5ee2e124ea7334450d30a46607f793534f567e97d4b708cda110a06aeed4953.webp' },
  { name: 'Patrick R.', username: '@patrickr', body: 'A much clearer way to prepare for the driving theory test. I recommend it to every learner.', profile: 'https://cdn.21st.dev/assets/mirror/2b/2bc5f22fa3400c61a2161d14e3dce5a0804badebfc1b3d9cbe844feaa3b72180.webp' },
]

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return <article className="marquee-review-card"><div className="marquee-review-person"><img src={review.profile} alt="" width="32" height="32" loading="lazy" /><div><p>{review.name}</p><span>{review.username}</span></div></div><p className="marquee-review-body">“{review.body}”</p></article>
}

function ReviewRow({ items, reverse = false }: { items: typeof reviews; reverse?: boolean }) {
  const loop = [...items, ...items]
  return <div className={`testimonial-marquee-row ${reverse ? 'reverse' : ''}`}><div className="testimonial-marquee-track">{loop.map((review, index) => <ReviewCard review={review} key={`${review.username}-${index}`} />)}</div></div>
}

export function TestimonialMarquee() {
  return <div className="testimonial-marquee" aria-label="Learner testimonials"><ReviewRow items={reviews.slice(0, 3)} /><ReviewRow items={reviews.slice(3)} reverse /><div className="testimonial-marquee-fade left" aria-hidden="true" /><div className="testimonial-marquee-fade right" aria-hidden="true" /></div>
}

export function TestimonialHeading() {
  return <><Icon icon="solar:chat-round-like-bold-duotone" width="24" height="24" aria-hidden="true" /><span className="pill">FROM THE ROAD</span><h2 id="testimonials-title">A little more confidence, from people like you.</h2><p>Real preparation feels better when you know you are not doing it alone.</p></>
}
