from django.db.models import Count, Q
from rest_framework import permissions, viewsets

from apps.authentication.permissions import IsAdminRole
from apps.tasks.models import ActivityLog
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    filterset_fields = ("status", "members")
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "deadline", "title")

    def get_queryset(self):
        qs = Project.objects.select_related("created_by").prefetch_related("members").annotate(
            task_count=Count("tasks", distinct=True),
            completed_task_count=Count("tasks", filter=Q(tasks__status="completed"), distinct=True),
        )
        if self.request.user.is_admin_role:
            return qs
        return qs.filter(members=self.request.user).distinct()

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        project = serializer.save(created_by=self.request.user)
        ActivityLog.objects.create(user=self.request.user, project=project, action=f"created project {project.title}")

    def perform_update(self, serializer):
        project = serializer.save()
        ActivityLog.objects.create(user=self.request.user, project=project, action=f"updated project {project.title}")
