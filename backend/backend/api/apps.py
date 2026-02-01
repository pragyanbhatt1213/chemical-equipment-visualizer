from django.apps import AppConfig


from django.contrib.auth.models import User

class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        if not User.objects.filter(username="demo").exists():
            User.objects.create_user(
                username="demo",
                password="demo123"
            )
