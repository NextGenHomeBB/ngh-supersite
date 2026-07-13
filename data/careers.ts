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
      'Based in or eligible to work in Indonesia.',
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
        id: 'linkedinUrl',
        label: 'LinkedIn URL',
        type: 'url',
        section: 'Personal information',
        required: false,
        placeholder: 'https://www.linkedin.com/in/your-profile',
      },
      {
        id: 'portfolioUrl',
        label: 'Portfolio URL / Behance / Dribbble',
        type: 'url',
        section: 'Personal information',
        required: true,
        placeholder: 'https://...',
      },
      {
        id: 'yearsUxWebExperience',
        label: 'How many years of professional experience do you have in UX design, web design, or related fields?',
        type: 'textarea',
        section: 'Technical experience',
        required: true,
      },
      {
        id: 'uiUxProficiency',
        label: 'Rate your proficiency in UI/UX Design, wireframes, prototyping, and user flows.',
        type: 'select',
        section: 'Technical experience',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      {
        id: 'webDesignProficiency',
        label: 'Rate your proficiency in Web Design, responsive and mobile-first.',
        type: 'select',
        section: 'Technical experience',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      {
        id: 'figmaProficiency',
        label: 'Rate your proficiency in Figma / Sketch / Adobe XD.',
        type: 'select',
        section: 'Technical experience',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      {
        id: 'htmlCssProficiency',
        label: 'Rate your proficiency in HTML / CSS / basic front-end development.',
        type: 'select',
        section: 'Technical experience',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      {
        id: 'designSystemsProficiency',
        label: 'Rate your proficiency in Design Systems & Component Libraries.',
        type: 'select',
        section: 'Technical experience',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      {
        id: 'brandVisualProficiency',
        label: 'Rate your proficiency in Brand Identity & Visual Design.',
        type: 'select',
        section: 'Technical experience',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      {
        id: 'motionProficiency',
        label: 'Rate your proficiency in Motion Design / Micro-interactions.',
        type: 'select',
        section: 'Technical experience',
        required: false,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      {
        id: 'userResearchProficiency',
        label: 'Rate your proficiency in User Research & Usability Testing.',
        type: 'select',
        section: 'Technical experience',
        required: true,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      {
        id: 'portfolioExamples',
        label: 'Share 2 to 3 examples of websites or digital products you have designed. What was your role and what tools did you use?',
        type: 'textarea',
        section: 'Technical experience',
        required: true,
      },
      {
        id: 'designProcess',
        label: 'Describe your design process from receiving a brief to delivering a final design. What steps do you follow?',
        type: 'textarea',
        section: 'Technical experience',
        required: true,
      },
      {
        id: 'realEstateHospitalityProjects',
        label: 'Have you worked on real estate, property, or hospitality-related design projects? If yes, describe the project and outcome.',
        type: 'textarea',
        section: 'UX & strategy',
        required: true,
      },
      {
        id: 'conversionDesignApproach',
        label: 'How do you approach designing for conversion, such as lead generation, investor inquiries, or booking requests?',
        type: 'textarea',
        section: 'UX & strategy',
        required: true,
      },
      {
        id: 'feedbackDataChangedDesign',
        label: 'Describe a situation where user feedback or data changed your initial design direction. What did you learn?',
        type: 'textarea',
        section: 'UX & strategy',
        required: true,
      },
      {
        id: 'aestheticsUsabilityPerformance',
        label: 'How do you balance aesthetics with usability and performance, including page speed and SEO?',
        type: 'textarea',
        section: 'UX & strategy',
        required: true,
      },
      {
        id: 'dayToDayDesignTools',
        label: 'Which design and development tools do you use day-to-day? For example Figma, Webflow, WordPress, Framer, Canva, Adobe Suite.',
        type: 'textarea',
        section: 'AI & tools',
        required: true,
      },
      {
        id: 'aiDesignToolsExample',
        label: 'Have you used AI tools such as Midjourney, DALL-E, ChatGPT, Claude, Galileo AI, or similar to improve your design work? Give a specific example.',
        type: 'textarea',
        section: 'AI & tools',
        required: true,
      },
      {
        id: 'aiDashboardsComfort',
        label: 'NGH runs on AI-driven systems, our own Imperium OS plus AI agents. How comfortable are you working with AI-powered tools and dashboards daily?',
        type: 'textarea',
        section: 'AI & tools',
        required: true,
      },
      {
        id: 'designSystemExperience',
        label: 'Have you built or maintained a design system? Describe your approach to component-based design.',
        type: 'textarea',
        section: 'AI & tools',
        required: true,
      },
      {
        id: 'aiForRealEstateDesigner',
        label: 'How do you see AI helping a UX & Web Designer in a real-estate development company?',
        type: 'textarea',
        section: 'AI & tools',
        required: true,
      },
      {
        id: 'indonesiaWorkEligibility',
        label: 'Are you eligible to work in Indonesia?',
        type: 'select',
        section: 'Work style & availability',
        required: true,
        options: ['Yes', 'No'],
      },
      {
        id: 'internationalRemoteTeams',
        label: 'Experience working with international or remote teams? How did you manage cross-timezone communication?',
        type: 'textarea',
        section: 'Work style & availability',
        required: true,
      },
      {
        id: 'realEstateHospitalityMotivation',
        label: 'Why does this position at NGH Property Group interest you? What excites you about working in real estate and hospitality design?',
        type: 'textarea',
        section: 'Work style & availability',
        required: true,
      },
      {
        id: 'deadlineParallelProjects',
        label: 'How do you handle tight deadlines and multiple design projects running in parallel?',
        type: 'textarea',
        section: 'Work style & availability',
        required: true,
      },
      {
        id: 'whyHireYou',
        label: 'In 3 to 5 sentences, why should we hire you?',
        type: 'textarea',
        section: 'Work style & availability',
        required: true,
      },
      {
        id: 'additionalInfo',
        label: "Anything else you'd like us to know about you?",
        type: 'textarea',
        section: 'Work style & availability',
        required: false,
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
