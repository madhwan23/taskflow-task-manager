from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "deadline", "created_by", "created_at")
    list_filter = ("status", "deadline")
    search_fields = ("title", "description")
    filter_horizontal = ("members",)
