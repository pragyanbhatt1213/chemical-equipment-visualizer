from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Create admin user if not exists"

    def handle(self, *args, **kwargs):
        username = "admin"
        password = "admin123"

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email="admin@test.com",
                password=password
            )
            self.stdout.write(self.style.SUCCESS("Admin user created successfully"))
        else:
            self.stdout.write("Admin user already exists")
