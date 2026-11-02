import { content, type Lang } from './content'
import { dotnetArchitecture, type ArchitectureModel } from './architecture'

/** Each CV owns its bilingual content, contacts, branding, and toolkit. */
export interface CVProfile {
  id: string
  label: Record<Lang, string>
  initials: string
  pageTitle: string
  description: Record<Lang, string>
  email: string
  telegram?: string
  content: Record<Lang, typeof content.en>
  architecture: ArchitectureModel
  toolkit: { label: Record<Lang, string>; skills: string[] }[]
}

export const profiles: CVProfile[] = [{
  id: 'senior-dotnet',
  label: { en: 'Senior .NET / Tech Lead', ru: 'Senior .NET / Техлид' },
  initials: 'ar',
  pageTitle: 'Senior .NET',
  description: {
    en: 'Alexey Rudi — Senior C#/.NET Developer and hands-on Tech Lead. Enterprise systems, complex domain logic, and performance engineering.',
    ru: 'Алексей Руди — Senior C#/.NET-разработчик и hands-on Tech Lead. Enterprise-системы, сложная бизнес-логика и оптимизация производительности.',
  },
  email: 'bigmouthfringe@gmail.com',
  telegram: 'https://t.me/bigmouthfringe',
  content,
  architecture: dotnetArchitecture,
  toolkit: [
    { label: { en: 'Backend', ru: 'Backend' }, skills: ['C# / .NET', 'ASP.NET Core', 'EF Core', 'REST / gRPC', 'DDD / CQRS'] },
    { label: { en: 'Data & messaging', ru: 'Данные и сообщения' }, skills: ['PostgreSQL', 'Redis', 'Kafka', 'RabbitMQ', 'MassTransit'] },
    { label: { en: 'Frontend & quality', ru: 'Frontend и качество' }, skills: ['Angular / RxJS', 'TypeScript', 'xUnit / Moq', 'Prometheus / Grafana', 'Git / Kubernetes'] },
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
