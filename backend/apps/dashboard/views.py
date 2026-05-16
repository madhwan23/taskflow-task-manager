from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import decorators, permissions, response, viewsets

from apps.projects.models import Project
from apps.tasks.models import ActivityLog, Task
from apps.tasks.serializers import ActivityLogSerializer


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @decorators.action(detail=False, methods=["get"])
    def stats(self, request):
        if request.user.is_admin_role:
            projects = Project.objects.all()
            tasks = Task.objects.all()
        else:
            projects = Project.objects.filter(members=request.user)
            tasks = Task.objects.filter(assigned_user=request.user)

        total_tasks = tasks.count()
        completed = tasks.filter(status=Task.Status.COMPLETED).count()
        overdue = tasks.filter(due_date__lt=timezone.localdate()).exclude(status=Task.Status.COMPLETED).count()
        by_status = tasks.values("status").annotate(count=Count("id"))
        by_priority = tasks.values("priority").annotate(count=Count("id"))
        recent = ActivityLog.objects.select_related("user").filter(
            Q(project__in=projects) | Q(task__in=tasks)
        ).distinct()[:8]

        return response.Response(
            {
                "total_projects": projects.distinct().count(),
                "total_tasks": total_tasks,
                "completed_tasks": completed,
                "overdue_tasks": overdue,
                "completion_rate": round((completed / total_tasks) * 100) if total_tasks else 0,
                "tasks_by_status": list(by_status),
                "tasks_by_priority": list(by_priority),
                "recent_activity": ActivityLogSerializer(recent, many=True).data,
            }
        )
