from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create demo user for evaluation"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        if not User.objects.filter(username="demo").exists():
            User.objects.create_user(
                username="demo",
                password="demo123"
            )
            self.stdout.write(self.style.SUCCESS("Demo user created"))
        else:
            self.stdout.write("Demo user already exists")
