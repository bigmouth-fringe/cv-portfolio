import type { Lang } from '../content'

export interface HookExample { id: string; title: Record<Lang,string>; body: string }

// CSharpier 1.3.0, 64 columns in a class wrapper (60 after removing its indent).
export const hookExamples: HookExample[] = [
  {
    id: "assignment",
    title: {"en": "Notify a new assignee", "ru": "Уведомить нового исполнителя"},
    body: `    if (current.AssigneeId == previous?.AssigneeId)
        return;

    await automation.NotifyAssigneeAsync(
        current.Id,
        current.AssigneeId
    );`,
  },
  {
    id: "status",
    title: {"en": "Audit status transitions", "ru": "Аудит смены статуса"},
    body: `    var sameStatus = current.Status == previous?.Status;

    if (previous is null || sameStatus)
        return;

    await automation.RecordChangeAsync(
        current.Id,
        "Status",
        previous.Status,
        current.Status
    );`,
  },
  {
    id: "completion",
    title: {"en": "Start the completion workflow", "ru": "Запустить процесс завершения"},
    body: `    var isCompleted = current.Progress == 100;
    var wasCompleted = previous?.Progress == 100;

    if (!isCompleted || wasCompleted)
        return;

    await automation.StartWorkflowAsync(
        current.Id,
        "TaskCompleted"
    );`,
  },
  {
    id: "schedule",
    title: {"en": "Recalculate a changed schedule", "ru": "Пересчитать изменённый план"},
    body: `    var sameStart = current.Start == previous?.Start;
    var sameFinish = current.Finish == previous?.Finish;

    if (sameStart && sameFinish)
        return;

    await automation.RecalculateScheduleAsync(
        current.ProjectId
    );`,
  },
  {
    id: "calendar",
    title: {"en": "Synchronize calendar dates", "ru": "Синхронизировать даты с календарём"},
    body: `    var sameFinish = current.Finish == previous?.Finish;

    if (previous is not null && sameFinish)
        return;

    await automation.SyncCalendarAsync(
        current.Id,
        current.Finish
    );`,
  },
  {
    id: "budget",
    title: {"en": "React to a budget increase", "ru": "Отреагировать на увеличение бюджета"},
    body: `    if (previous is null)
        return;

    var budgetIncreased = current.Budget > previous.Budget;

    if (!budgetIncreased)
        return;

    await automation.RequestBudgetReviewAsync(
        current.Id,
        previous.Budget,
        current.Budget
    );`,
  },
  {
    id: "milestone",
    title: {"en": "Publish a new milestone", "ru": "Опубликовать новую веху"},
    body: `    var wasMilestone = previous?.IsMilestone == true;

    if (!current.IsMilestone || wasMilestone)
        return;

    await automation.PublishMilestoneAsync(
        current.ProjectId,
        current.Id
    );`,
  },
  {
    id: "rename",
    title: {"en": "Refresh the search index", "ru": "Обновить поисковый индекс"},
    body: `    if (current.Name == previous?.Name)
        return;

    await automation.IndexTaskAsync(
        current.Id,
        current.Name
    );`,
  },
  {
    id: "project",
    title: {"en": "Update both project summaries", "ru": "Обновить сводки обоих проектов"},
    body: `    var sameProject =
        current.ProjectId == previous?.ProjectId;

    if (previous is null || sameProject)
        return;

    await automation.RefreshProjectAsync(
        previous.ProjectId
    );
    await automation.RefreshProjectAsync(current.ProjectId);`,
  },
  {
    id: "priority",
    title: {"en": "Escalate a priority change", "ru": "Эскалировать повышение приоритета"},
    body: `    if (previous is null)
        return;

    var oldPriority = (int)previous.Priority;
    var newPriority = (int)current.Priority;

    if (newPriority <= oldPriority)
        return;

    await automation.EscalateAsync(
        current.Id,
        current.Priority
    );`,
  },
  {
    id: "estimate",
    title: {"en": "Rebalance resource capacity", "ru": "Пересчитать загрузку ресурсов"},
    body: `    var sameEstimate =
        current.EstimatedHours == previous?.EstimatedHours;

    if (sameEstimate)
        return;

    await automation.RebalanceCapacityAsync(
        current.ProjectId,
        current.AssigneeId
    );`,
  },
  {
    id: "reopen",
    title: {"en": "Handle a reopened task", "ru": "Обработать повторное открытие задачи"},
    body: `    var isCompleted = current.Progress == 100;
    var wasCompleted = previous?.Progress == 100;

    if (!wasCompleted || isCompleted)
        return;

    await automation.StartWorkflowAsync(
        current.Id,
        "TaskReopened"
    );`,
  },
  {
    id: "archive",
    title: {"en": "Remove an archived task from planning", "ru": "Убрать архивную задачу из планирования"},
    body: `    var wasArchived = previous?.IsArchived == true;

    if (!current.IsArchived || wasArchived)
        return;

    await automation.RemoveFromPlanningAsync(current.Id);`,
  },
  {
    id: "restore",
    title: {"en": "Restore a task to planning", "ru": "Вернуть задачу в планирование"},
    body: `    var wasArchived = previous?.IsArchived == true;

    if (!wasArchived || current.IsArchived)
        return;

    await automation.RestoreToPlanningAsync(current.Id);`,
  },
  {
    id: "creation",
    title: {"en": "Initialize a new task workflow", "ru": "Запустить процесс для новой задачи"},
    body: `    if (previous is not null)
        return;

    await automation.StartWorkflowAsync(
        current.Id,
        "TaskCreated"
    );`,
  },
  {
    id: "webhook",
    title: {"en": "Send current and previous state", "ru": "Отправить текущее и предыдущее состояние"},
    body: `    var sameStatus = current.Status == previous?.Status;
    var sameName = current.Name == previous?.Name;

    if (sameStatus && sameName)
        return;

    var payload = new
    {
        Current = current,
        Previous = previous,
    };

    await automation.SendWebhookAsync(
        "task.updated",
        payload
    );`,
  },
]

export const hookHeader = `public async Task AfterUpsert(
    ProjectTask current,
    ProjectTask? previous
)
{`
export function hookCode(example: HookExample) { return `${hookHeader}\n${example.body}\n}` }
