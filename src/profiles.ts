import { content, type Lang } from './content'
import { dotnetArchitecture, type ArchitectureModel } from './architecture'

/** Each CV owns its bilingual content, contacts, branding, and toolkit. */
export interface CVProfile {
  id: string
  label: Record<Lang, string>
  initials: string
  pageTitle: string
  downloadName: string
  photo?: string
  description: Record<Lang, string>
  email: string
  telegram?: string
  content: Record<Lang, typeof content.en>
  architecture: ArchitectureModel
  toolkit: { label: Record<Lang, string>; skills: string[] }[]
}

export const profiles: CVProfile[] = [{
  id: 'senior-dotnet',
  label: { en: 'Senior .NET Backend Engineer', ru: 'Senior .NET Backend Engineer' },
  initials: 'ar',
  pageTitle: 'Senior .NET Backend Engineer',
  downloadName: 'Alexey_Rudi_Senior_DotNet',
  photo: 'alexey-rudi.jpg',
  description: {
    en: 'Alexey Rudi — Senior .NET Backend Engineer. Enterprise SaaS, scheduling, transactions, and PostgreSQL performance.',
    ru: 'Алексей Руди — Senior .NET Backend Engineer. Корпоративные SaaS-системы, планирование, транзакции и производительность PostgreSQL.',
  },
  email: 'bigmouthfringe@gmail.com',
  telegram: 'https://t.me/bigmouthfringe',
  content,
  architecture: dotnetArchitecture,
  toolkit: [
    { label: { en: 'Backend & API', ru: 'Backend и API' }, skills: ['C#', '.NET', 'ASP.NET Core', 'REST API', 'OData', 'gRPC', 'SignalR', 'LINQ', 'async / await', 'SDK design'] },
    { label: { en: 'Architecture', ru: 'Архитектура' }, skills: ['OOP', 'SOLID', 'DDD', 'CQRS', 'Aggregate Root', 'Value Objects'] },
    { label: { en: 'Data & messaging', ru: 'Данные и сообщения' }, skills: ['SQL', 'PostgreSQL', 'EF Core', 'Dapper', 'Npgsql', 'Redis', 'Apache Kafka', 'RabbitMQ', 'MassTransit', 'Idempotency'] },
    { label: { en: 'Frontend', ru: 'Frontend' }, skills: ['Angular', 'React', 'TypeScript', 'RxJS'] },
    { label: { en: 'Testing', ru: 'Тестирование' }, skills: ['xUnit', 'NUnit', 'MSTest', 'Moq', 'Selenium', 'Integration tests', 'Performance tests'] },
    { label: { en: 'Delivery & observability', ru: 'Доставка и наблюдаемость' }, skills: ['Git', 'Kubernetes', 'Prometheus', 'Grafana', '.NET profiling', 'GC & allocations', 'Code review', 'AI-agent workflows'] },
  ],
}]

export function resolveProfile(id: string | null, available: readonly CVProfile[] = profiles): CVProfile {
  if (!available.length) throw new Error('At least one CV must be registered')
  return available.find(profile => profile.id === id) ?? available[0]
}

export function readProfileId() {
  const requested = new URLSearchParams(window.location.search).get('cv')
  if (requested !== null) return resolveProfile(requested).id
  try { return resolveProfile(localStorage.getItem('portfolio-cv')).id } catch { return profiles[0].id }
}
