from rest_framework import serializers

from django.contrib.auth import get_user_model
from apps.authentication.serializers import UserSerializer
from .models import Project

User = get_user_model()


class ProjectSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), required=False)
    member_details = UserSerializer(source="members", many=True, read_only=True)
    created_by_detail = UserSerializer(source="created_by", read_only=True)
    task_count = serializers.IntegerField(read_only=True)
    completed_task_count = serializers.IntegerField(read_only=True)
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "deadline",
            "members",
            "member_details",
            "status",
            "created_by",
            "created_by_detail",
            "created_at",
            "updated_at",
            "task_count",
            "completed_task_count",
            "progress",
        )
        read_only_fields = ("id", "created_by", "created_at", "updated_at")

    def get_progress(self, obj):
        count = getattr(obj, "task_count", None)
        done = getattr(obj, "completed_task_count", None)
        if count is None:
            count = obj.tasks.count()
            done = obj.tasks.filter(status="completed").count()
        return round((done / count) * 100) if count else 0
