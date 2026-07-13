export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Daily Worker'
export type CareerStatus = 'open' | 'closed' | 'filled' | 'draft'
export type QuestionType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'scale' | 'url' | 'email' | 'tel'

export type CareerQuestion = {
  id: string
  label: string
  type: QuestionType
  section: string
  required?: boolean
  options?: string[]
  helpText?: string
  placeholder?: string
}

export type CareerRole = {
  slug: string
  title: string
  department: string
  location: string
  type: JobType
  status: CareerStatus
  description: string
  summary?: string[]
  responsibilities?: string[]
  requirements: string[]
  niceToHave?: string[]
  offer?: string[]
  howToApply?: string
  closingDate: string
  roleCode: string
  extraQuestions: CareerQuestion[]
}

export const lockedCoreQuestions: CareerQuestion[] = [
  {
    id: 'availability',
    label: 'When can you start, and are you available full-time?',
    type: 'textarea',
    section: 'Availability',
    required: true,
    placeholder: 'Share your earliest start date, notice period, and preferred working arrangement.',
  },
  {
    id: 'salaryExpectation',
    label: 'What is your monthly salary expectation?',
    type: 'text',
    section: 'Availability',
    required: true,
    placeholder: 'Example: IDR 12,000,000 per month',
  },
  {
    id: 'experience',
    label: 'Tell us about your most relevant experience for this role.',
    type: 'textarea',
    section: 'Experience',
    required: true,
    placeholder: 'Include years of experience, companies/projects, and responsibilities.',
  },
  {
    id: 'motivation',
    label: 'Why do you want to join NGH Property Group?',
    type: 'textarea',
    section: 'Motivation',
    required: true,
    placeholder: 'Tell us what attracts you to NGH and this role.',
  },
  {
    id: 'toolsAiUsage',
    label: 'Which tools and AI systems do you use in your work?',
    type: 'textarea',
    section: 'Tools & AI',
    required: true,
    placeholder: 'Example: Excel, Notion, Figma, ChatGPT, Claude, automation tools, CRM, PM tools.',
  },
]

export const careerRoles: CareerRole[] = [
  {
    slug: 'ux-web-designer',
    title: 'UX & Web Designer',
    department: 'Design',
    location: 'Uluwatu, Bali based (Hybrid)',
    type: 'Contract',
    status: 'open',
    closingDate: '2026-08-31',
    roleCode: 'UWD',
    description:
      "We're looking for a talented UX & Web Designer to elevate our digital presence. You'll design intuitive, visually refined experiences across our corporate website, project landing pages, and investor-facing platforms.",
    summary: [
      "We're looking for a talented UX & Web Designer to elevate our digital presence. You'll be responsible for designing intuitive, visually refined experiences across our corporate website, project landing pages, and investor-facing platforms.",
      "Working closely with the CEO and marketing team, you'll transform ideas into premium digital experiences that strengthen our brand and support business growth.",
    ],
    responsibilities: [
      'Design, improve, and maintain the NGH corporate website and project landing pages.',
      'Create user flows, wireframes, prototypes, and high-fidelity UI designs.',
      'Ensure seamless, responsive experiences across desktop, tablet, and mobile devices.',
      'Design intuitive investor dashboards and client portals.',
      'Produce digital assets including email templates, presentation decks, and marketing visuals.',
      'Maintain consistency across all digital brand touchpoints.',
      'Continuously improve user experience through analytics, testing, and user feedback.',
      'Collaborate closely with developers to ensure accurate implementation of designs.',
    ],
    requirements: [
      'Minimum 3 years of experience in UX/UI or web design.',
      'Strong portfolio demonstrating high-quality digital work, with real estate, hospitality, luxury, or lifestyle brand experience as a plus.',
      'Proficiency in Figma, Adobe Creative Suite, and prototyping tools.',
      'Solid understanding of responsive design principles and user-centered design.',
      'Working knowledge of HTML/CSS, with coding ability considered an advantage, not a requirement.',
      'Experience with WordPress, Webflow, or similar CMS platforms.',
      'Excellent typography, layout, and visual design skills.',
      'Strong attention to detail and a refined aesthetic.',
      'Professional working proficiency in English.',
    ],
    niceToHave: [
      'Motion design and micro-interaction experience.',
      'Knowledge of SEO and conversion-focused web design.',
      'Experience creating investor presentations or sales materials.',
      'Familiarity with AI-powered design tools and workflows.',
    ],
    offer: [
      'Competitive freelance compensation.',
      'Flexible hybrid working arrangement.',
      'Opportunity to work directly with the leadership team.',
      "A chance to shape the digital experience of one of Bali's growing property developers.",
      'Creative freedom on premium property and investment projects.',
    ],
    howToApply: 'Send your CV, portfolio link, and a short motivation to the NGH Property Group team.',
    extraQuestions: [
      {
        id: 'portfolioHighlights',
        label: 'Share 2 to 3 portfolio examples that best match premium real estate, hospitality, luxury, or lifestyle design. What was your role in each project?',
        type: 'textarea',
        section: 'Role-specific questions',
        required: true,
      },
      {
        id: 'websiteImprovementApproach',
        label: 'If you were improving a premium property landing page, what would you review first and why?',
        type: 'textarea',
        section: 'Role-specific questions',
        required: true,
      },
    ],
  },
  {
    slug: 'operations-planning-manager',
    title: 'Operations & Planning Manager',
    department: 'Operations',
    location: 'Bali, Indonesia',
    type: 'Full-time',
    status: 'open',
    closingDate: '2026-07-20',
    roleCode: 'OPM',
    description:
      "As our Operations & Planning Manager, you'll coordinate daily operations across multiple projects, keep teams aligned, manage timelines and deadlines, and ensure execution happens at the highest standard.",
    summary: [
      "As our Operations & Planning Manager, you'll coordinate daily operations across multiple projects, keep teams aligned, manage timelines and deadlines, and ensure execution happens at the highest standard.",
      'This role is ideal for someone with experience in operations, project management, construction coordination, or real estate development who thrives in a fast-paced environment.',
    ],
    responsibilities: [
      'Plan and coordinate daily operations across multiple projects',
      'Take full ownership and accountability for deliverables',
      'Create and manage project timelines, milestones, and deadlines',
      'Motivate and lead the on-site team with a reward-based approach',
      'Coordinate between departments: construction, admin, marketing, finance',
      'Report directly to the CEO with clear progress updates',
      'Solve problems fast — execute many tasks in short time frames',
      'Maintain quality standards across all operational processes',
    ],
    requirements: [
      '3+ years experience in operations, project management, or construction coordination',
      'Strong leadership skills — you can motivate people and hold them accountable',
      'Excellent planning and organizational abilities',
      'Hands-on mentality — you get things done, not just delegate',
      'Open to Indonesian nationals — based in or willing to relocate to Bali, and fluent in English',
      'Experience with real estate or construction is a strong advantage',
    ],
    offer: [
      'Salary: IDR 6,000,000 — 9,000,000 per month based on experience',
      'Be part of a premium international real estate project',
      'Direct collaboration with the CEO and leadership team',
      'Performance-based growth and reward system',
      'Dynamic, fast-paced work environment in Bali',
    ],
    howToApply: 'Send your CV and a short motivation to the NGH Property Group team. Position starts immediately.',
    extraQuestions: [
      {
        id: 'projectControlExample',
        label: 'Describe an operation or project you planned and ran end-to-end. What was the scope, the biggest challenge, and how did you solve it?',
        type: 'textarea',
        section: 'Role-specific questions',
        required: true,
      },
      {
        id: 'budgetDelayScenario',
        label: 'A project is behind schedule or over budget. Walk us through exactly what you do.',
        type: 'textarea',
        section: 'Role-specific questions',
        required: true,
      },
    ],
  },
]

export function getCareerRole(slug: string) {
  return careerRoles.find((role) => role.slug === slug)
}

export function getOpenCareerRoles() {
  return careerRoles.filter((role) => role.status === 'open')
}

export function getRoleQuestions(role: CareerRole) {
  return [...lockedCoreQuestions, ...role.extraQuestions]
}
