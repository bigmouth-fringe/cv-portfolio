import type { Lang } from '../content'

export interface HookExample { id: string; title: Record<Lang,string>; body: string }
export const hookExamples: HookExample[] = [
  {id:'assignment',title:{en:'Notify a new assignee',ru:'Уведомить нового исполнителя'},body:`    if (current.AssigneeId == previous?.AssigneeId)
        return;

    await automation.NotifyAssigneeAsync(
        current.Id, current.AssigneeId);`},
  {id:'status',title:{en:'Audit status transitions',ru:'Аудит смены статуса'},body:`    if (previous is null || current.Status == previous.Status)
        return;

    await automation.RecordChangeAsync(
        current.Id, "Status", previous.Status, current.Status);`},
  {id:'completion',title:{en:'Start the completion workflow',ru:'Запустить процесс завершения'},body:`    if (current.Progress != 100 || previous?.Progress == 100)
        return;

    await automation.StartWorkflowAsync(
        current.Id, "TaskCompleted");`},
  {id:'schedule',title:{en:'Recalculate a changed schedule',ru:'Пересчитать изменённый план'},body:`    if (current.Start == previous?.Start &&
        current.Finish == previous?.Finish)
        return;

    await automation.RecalculateScheduleAsync(current.ProjectId);`},
  {id:'calendar',title:{en:'Synchronize calendar dates',ru:'Синхронизировать даты с календарём'},body:`    if (previous is not null &&
        current.Finish == previous.Finish)
        return;

    await automation.SyncCalendarAsync(current.Id, current.Finish);`},
  {id:'budget',title:{en:'React to a budget increase',ru:'Отреагировать на увеличение бюджета'},body:`    if (previous is null || current.Budget <= previous.Budget)
        return;

    await automation.RequestBudgetReviewAsync(
        current.Id, previous.Budget, current.Budget);`},
  {id:'milestone',title:{en:'Publish a new milestone',ru:'Опубликовать новую веху'},body:`    if (!current.IsMilestone || previous?.IsMilestone == true)
        return;

    await automation.PublishMilestoneAsync(
        current.ProjectId, current.Id);`},
  {id:'rename',title:{en:'Refresh the search index',ru:'Обновить поисковый индекс'},body:`    if (current.Name == previous?.Name)
        return;

    await automation.IndexTaskAsync(
        current.Id, current.Name);`},
  {id:'project',title:{en:'Update both project summaries',ru:'Обновить сводки обоих проектов'},body:`    if (previous is null || current.ProjectId == previous.ProjectId)
        return;

    await automation.RefreshProjectAsync(previous.ProjectId);
    await automation.RefreshProjectAsync(current.ProjectId);`},
  {id:'priority',title:{en:'Escalate a priority change',ru:'Эскалировать повышение приоритета'},body:`    if (previous is null || (int)current.Priority <= (int)previous.Priority)
        return;

    await automation.EscalateAsync(
        current.Id, current.Priority);`},
  {id:'estimate',title:{en:'Rebalance resource capacity',ru:'Пересчитать загрузку ресурсов'},body:`    if (current.EstimatedHours == previous?.EstimatedHours)
        return;

    await automation.RebalanceCapacityAsync(
        current.ProjectId, current.AssigneeId);`},
  {id:'reopen',title:{en:'Handle a reopened task',ru:'Обработать повторное открытие задачи'},body:`    if (previous?.Progress != 100 || current.Progress == 100)
        return;

    await automation.StartWorkflowAsync(
        current.Id, "TaskReopened");`},
  {id:'archive',title:{en:'Remove an archived task from planning',ru:'Убрать архивную задачу из планирования'},body:`    if (!current.IsArchived || previous?.IsArchived == true)
        return;

    await automation.RemoveFromPlanningAsync(current.Id);`},
  {id:'restore',title:{en:'Restore a task to planning',ru:'Вернуть задачу в планирование'},body:`    if (previous?.IsArchived != true || current.IsArchived)
        return;

    await automation.RestoreToPlanningAsync(current.Id);`},
  {id:'creation',title:{en:'Initialize a new task workflow',ru:'Запустить процесс для новой задачи'},body:`    if (previous is not null)
        return;

    await automation.StartWorkflowAsync(
        current.Id, "TaskCreated");`},
  {id:'webhook',title:{en:'Send current and previous state',ru:'Отправить текущее и предыдущее состояние'},body:`    if (current.Status == previous?.Status &&
        current.Name == previous?.Name)
        return;

    await automation.SendWebhookAsync(
        "task.updated", new { Current = current, Previous = previous });`},
]

export const hookHeader = `public async Task AfterUpsert(
    ProjectTask current,
    ProjectTask? previous)
{`
export function hookCode(example: HookExample) { return `${hookHeader}\n${example.body}\n}` }
