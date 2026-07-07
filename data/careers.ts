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
  requirements: string[]
  closingDate: string
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
    slug: 'operations-planning-manager',
    title: 'Operations & Planning Manager',
    department: 'Operations',
    location: 'Bali, Indonesia',
    type: 'Full-time',
    status: 'open',
    closingDate: '2026-09-30',
    description:
      'Help NGH run planning, procurement, reporting, and day-to-day operational control across real estate development projects in Bali.',
    requirements: [
      'Professional experience in operations, planning, logistics, procurement, or project control.',
      'Strong spreadsheet and reporting discipline.',
      'Comfort coordinating vendors, stakeholders, and multiple deadlines.',
      'Open to working with AI-supported NGH systems and workflows.',
    ],
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
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    department: 'Technology',
    location: 'Remote / Bali',
    type: 'Full-time',
    status: 'open',
    closingDate: '2026-09-30',
    description:
      'Build and maintain NGH digital systems, AI-powered workflows, websites, and internal tooling across the property group.',
    requirements: [
      'Strong Next.js, React, TypeScript, and backend/API experience.',
      'Comfort with deployment workflows and GitHub collaboration.',
      'Experience integrating AI tools or APIs is a strong plus.',
      'Clear communication and disciplined testing habits.',
    ],
    extraQuestions: [
      {
        id: 'fullStackProject',
        label: 'Describe a full-stack project you built from scratch. What was the stack, challenge, and outcome?',
        type: 'textarea',
        section: 'Role-specific questions',
        required: true,
      },
      {
        id: 'aiWorkPastSixMonths',
        label: 'What have you done in the past 6 months involving AI, automation, agents, or LLM APIs?',
        type: 'textarea',
        section: 'Role-specific questions',
        required: true,
      },
    ],
  },
  {
    slug: 'open-application',
    title: 'Open Application',
    department: 'General',
    location: 'Bali / Remote',
    type: 'Full-time',
    status: 'open',
    closingDate: '2026-12-31',
    description:
      'Do not see the exact role yet? Introduce yourself and tell us where you can create value for NGH Property Group.',
    requirements: [
      'Relevant professional experience for the area you want to support.',
      'High ownership, clear communication, and strong follow-through.',
      'Comfort working in a fast-moving real estate and hospitality environment.',
    ],
    extraQuestions: [
      {
        id: 'roleFit',
        label: 'Which role or department do you think fits you best, and why?',
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
