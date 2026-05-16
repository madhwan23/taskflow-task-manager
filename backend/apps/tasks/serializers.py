from django.core.mail import send_mail
from rest_framework import serializers

from apps.authentication.serializers import UserSerializer
from apps.projects.models import Project
from apps.projects.serializers import ProjectSerializer
from .models import ActivityLog, Task, TaskAttachment


class TaskAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskAttachment
        fields = ("id", "file", "uploaded_by", "uploaded_at")
        read_only_fields = ("id", "uploaded_by", "uploaded_at")


class TaskSerializer(serializers.ModelSerializer):
    assigned_user_detail = UserSerializer(source="assigned_user", read_only=True)
    project_detail = ProjectSerializer(source="project", read_only=True)
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "description",
            "priority",
            "due_date",
            "assigned_user",
            "assigned_user_detail",
            "project",
            "project_detail",
            "status",
            "created_by",
            "created_at",
            "updated_at",
            "attachments",
            "is_overdue",
        )
        read_only_fields = ("id", "created_by", "created_at", "updated_at")

    def validate(self, attrs):
        project = attrs.get("project") or getattr(self.instance, "project", None)
        assigned_user = attrs.get("assigned_user") or getattr(self.instance, "assigned_user", None)
        if project and assigned_user and not project.members.filter(id=assigned_user.id).exists():
            raise serializers.ValidationError("Assigned user must be a member of the project.")
        return attrs

    def create(self, validated_data):
        task = super().create(validated_data)
        if task.assigned_user.email:
            send_mail(
                "New task assigned",
                f"You were assigned '{task.title}' in project '{task.project.title}'.",
                None,
                [task.assigned_user.email],
                fail_silently=True,
            )
        return task


class ActivityLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ActivityLog
        fields = ("id", "user", "project", "task", "action", "created_at")
