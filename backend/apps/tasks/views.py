from rest_framework import decorators, parsers, permissions, response, status, viewsets

from apps.authentication.permissions import IsAdminRole
from .models import ActivityLog, Task, TaskAttachment
from .serializers import ActivityLogSerializer, TaskAttachmentSerializer, TaskSerializer


class CanManageTask(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin_role:
            return True
        if view.action in ["retrieve", "partial_update", "update", "status"]:
            return obj.assigned_user_id == request.user.id
        return False


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filterset_fields = ("status", "priority", "project", "assigned_user")
    search_fields = ("title", "description", "project__title", "assigned_user__username")
    ordering_fields = ("created_at", "due_date", "priority", "status")

    def get_queryset(self):
        qs = Task.objects.select_related("assigned_user", "project", "created_by").prefetch_related("attachments")
        if self.request.user.is_admin_role:
            return qs
        return qs.filter(assigned_user=self.request.user)

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated(), CanManageTask()]

    def perform_create(self, serializer):
        task = serializer.save(created_by=self.request.user)
        ActivityLog.objects.create(user=self.request.user, project=task.project, task=task, action=f"assigned task {task.title}")

    def perform_update(self, serializer):
        task = serializer.save()
        ActivityLog.objects.create(user=self.request.user, project=task.project, task=task, action=f"updated task {task.title}")

    @decorators.action(detail=True, methods=["post"])
    def status(self, request, pk=None):
        task = self.get_object()
        serializer = self.get_serializer(task, data={"status": request.data.get("status")}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        ActivityLog.objects.create(user=request.user, project=task.project, task=task, action=f"changed task status to {task.status}")
        return response.Response(serializer.data)

    @decorators.action(detail=True, methods=["post"], parser_classes=[parsers.MultiPartParser, parsers.FormParser])
    def attachment(self, request, pk=None):
        task = self.get_object()
        file_obj = request.FILES.get("file")
        if not file_obj:
            return response.Response({"file": "This field is required."}, status=status.HTTP_400_BAD_REQUEST)
        attachment = TaskAttachment.objects.create(task=task, file=file_obj, uploaded_by=request.user)
        return response.Response(TaskAttachmentSerializer(attachment).data, status=status.HTTP_201_CREATED)


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    filterset_fields = ("project", "task")

    def get_queryset(self):
        qs = ActivityLog.objects.select_related("user", "project", "task")
        if self.request.user.is_admin_role:
            return qs
        return qs.filter(task__assigned_user=self.request.user)
