import type { Lang } from './content'

export interface ArchitectureGroup {
  id: string
  label: Record<Lang, string>
  kind: Record<Lang, string>
  description: Record<Lang, string>
  technologies: string[]
}
export interface ArchitectureModel {
  groups: ArchitectureGroup[]
  engineering: string[]
}

export const dotnetArchitecture: ArchitectureModel = {
  groups: [
    {
      id: 'domain', label: { en: 'Domain', ru: 'Домен' },
      kind: { en: 'Business rules', ru: 'Бизнес-правила' },
      description: { en: 'Entities, value objects, and invariants. Business rules stay independent of databases, frameworks, and transport protocols.', ru: 'Сущности, объекты-значения и инварианты. Бизнес-правила независимы от баз данных, фреймворков и протоколов передачи данных.' },
      technologies: ['C#', '.NET', 'DDD', 'Aggregate Root', 'Value Objects', 'Graph models', 'OOP', 'SOLID'],
    },
    {
      id: 'application', label: { en: 'Application', ru: 'Приложение' },
      kind: { en: 'Use cases & ports', ru: 'Сценарии и порты' },
      description: { en: 'Use cases orchestrate domain behaviour and define the ports they need. Infrastructure implements those contracts; dependencies point inward.', ru: 'Прикладные сценарии координируют доменную логику и определяют нужные порты. Инфраструктура реализует эти контракты; зависимости направлены внутрь.' },
      technologies: ['C# / .NET', 'CQRS', 'LINQ', 'Task', 'async / await', 'SDK design', 'Undo / Redo'],
    },
    {
      id: 'frontend', label: { en: 'Web UI', ru: 'Веб-интерфейс' },
      kind: { en: 'Driving adapter', ru: 'Входной адаптер' },
      description: { en: 'User interactions enter through application ports. Forms, tables, and reactive workflows belong outside the business core.', ru: 'Действия пользователя поступают через прикладные порты. Формы, таблицы и реактивные сценарии остаются за пределами бизнес-ядра.' },
      technologies: ['Angular', 'TypeScript', 'RxJS'],
    },
    {
      id: 'api', label: { en: 'API & realtime', ru: 'API и realtime' },
      kind: { en: 'Boundary adapters', ru: 'Адаптеры границы' },
      description: { en: 'HTTP and RPC endpoints translate requests into use cases. Realtime adapters deliver notifications without coupling the domain to transport.', ru: 'HTTP- и RPC-эндпоинты переводят запросы в прикладные сценарии. Realtime-адаптеры доставляют уведомления, не связывая домен с транспортом.' },
      technologies: ['ASP.NET Core', 'REST API', 'OData', 'gRPC', 'SignalR', 'WebSocket'],
    },
    {
      id: 'data', label: { en: 'Persistence', ru: 'Хранение' },
      kind: { en: 'Driven adapters', ru: 'Выходные адаптеры' },
      description: { en: 'Database and cache adapters implement application-defined contracts. Query plans, indexes, and persistence details stay outside the domain. Deep EF Core knowledge: Change Tracker, query translation, and SQL performance. Working familiarity with Dapper.', ru: 'Адаптеры БД и кеша реализуют прикладные контракты. Планы запросов, индексы и детали хранения остаются за пределами домена. Глубокое знание EF Core: Change Tracker, трансляция запросов и производительность SQL. Dapper — базовое знакомство.' },
      technologies: ['EF Core', 'PostgreSQL', 'SQL', 'Dapper', 'Npgsql', 'Redis', 'Change Tracker', 'LINQ translation', 'EXPLAIN ANALYZE', 'Indexes & locks'],
    },
    {
      id: 'messaging', label: { en: 'Messaging', ru: 'Сообщения' },
      kind: { en: 'Asynchronous adapters', ru: 'Асинхронные адаптеры' },
      description: { en: 'Consumers invoke use cases; publishers implement outbound ports. Message contracts, retries, and idempotency protect asynchronous boundaries.', ru: 'Обработчики вызывают прикладные сценарии, а отправители реализуют выходные порты. Контракты сообщений, повторы и идемпотентность защищают асинхронные границы.' },
      technologies: ['Apache Kafka', 'RabbitMQ', 'MassTransit', 'Idempotency', 'Reprocessing', 'Message contracts'],
    },
    {
      id: 'integrations', label: { en: 'Integrations', ru: 'Интеграции' },
      kind: { en: 'External & legacy adapters', ru: 'Внешние и legacy-адаптеры' },
      description: { en: 'External APIs and legacy systems connect through adapters. These examples span earlier roles; the map is not a single production deployment.', ru: 'Внешние API и legacy-системы подключаются через адаптеры. Примеры относятся в том числе к предыдущим местам работы; карта не описывает одну production-систему.' },
      technologies: ['Google Maps', 'Google Calendar', 'PandaDoc', 'Python', 'VBScript'],
    },
    {
      id: 'testing', label: { en: 'Test harness', ru: 'Тесты' },
      kind: { en: 'Driving adapter & test doubles', ru: 'Входной адаптер и тестовые двойники' },
      description: { en: 'Tests drive use cases directly and replace infrastructure at its ports. Browser automation exercises the UI boundary; performance tests check behaviour under load.', ru: 'Тесты напрямую вызывают прикладные сценарии и заменяют инфраструктуру на границах портов. Браузерные тесты проверяют UI, а performance-тесты — поведение под нагрузкой.' },
      technologies: ['xUnit', 'Moq', 'Selenium', 'Integration tests', 'Performance tests'],
    },
  ],
  engineering: ['Kubernetes', 'Git', 'Prometheus', 'Grafana', '.NET profiling', 'GC & allocations', 'Code review', 'AI-agent workflows'],
}
