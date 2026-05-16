from django.contrib import admin

from .models import ActivityLog, Task, TaskAttachment


class TaskAttachmentInline(admin.TabularInline):
    model = TaskAttachment
    extra = 0


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "project", "assigned_user", "priority", "status", "due_date")
    list_filter = ("priority", "status", "due_date")
    search_fields = ("title", "description")
    inlines = [TaskAttachmentInline]


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ("action", "user", "project", "task", "created_at")
    list_filter = ("created_at",)
