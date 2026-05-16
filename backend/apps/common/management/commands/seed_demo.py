from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.projects.models import Project
from apps.tasks.models import ActivityLog, Task


class Command(BaseCommand):
    help = "Create demo users, projects, tasks, and activity logs."

    def handle(self, *args, **options):
        User = get_user_model()
        admin, _ = User.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@example.com", "first_name": "Aarav", "last_name": "Admin", "role": User.Role.ADMIN, "job_title": "Product Lead"},
        )
        admin.set_password("Admin@12345")
        admin.role = User.Role.ADMIN
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()

        members = []
        for username, first_name, title in [
            ("neha", "Neha", "Frontend Engineer"),
            ("rahul", "Rahul", "Backend Engineer"),
            ("maya", "Maya", "QA Analyst"),
        ]:
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={"email": f"{username}@example.com", "first_name": first_name, "last_name": "Member", "role": User.Role.MEMBER, "job_title": title},
            )
            user.set_password("Member@12345")
            user.role = User.Role.MEMBER
            user.save()
            members.append(user)

        today = timezone.localdate()
        projects_data = [
            ("Website Redesign", "Refresh marketing pages and improve conversion paths.", today + timedelta(days=28), Project.Status.ACTIVE),
            ("Mobile App Launch", "Coordinate beta feedback, analytics, and release readiness.", today + timedelta(days=45), Project.Status.PLANNING),
            ("Internal Ops Portal", "Build a dashboard for task intake and team reporting.", today + timedelta(days=12), Project.Status.ACTIVE),
        ]

        for title, description, deadline, status in projects_data:
            project, _ = Project.objects.get_or_create(
                title=title,
                defaults={"description": description, "deadline": deadline, "status": status, "created_by": admin},
            )
            project.members.set(members)
            ActivityLog.objects.get_or_create(user=admin, project=project, action=f"created project {project.title}")
            for index, member in enumerate(members):
                due_date = today + timedelta(days=(index + 1) * 5)
                if title == "Internal Ops Portal" and index == 1:
                    due_date = today - timedelta(days=1)
                task, _ = Task.objects.update_or_create(
                    title=f"{title} task {index + 1}",
                    project=project,
                    defaults={
                        "description": f"Complete the {member.job_title.lower()} checklist for {title}.",
                        "priority": [Task.Priority.HIGH, Task.Priority.MEDIUM, Task.Priority.LOW][index],
                        "due_date": due_date,
                        "assigned_user": member,
                        "status": [Task.Status.IN_PROGRESS, Task.Status.TODO, Task.Status.COMPLETED][index],
                        "created_by": admin,
                    },
                )
                ActivityLog.objects.get_or_create(user=admin, project=project, task=task, action=f"assigned task {task.title}")

        self.stdout.write(self.style.SUCCESS("Demo data ready. Admin: admin / Admin@12345, Member: neha / Member@12345"))
