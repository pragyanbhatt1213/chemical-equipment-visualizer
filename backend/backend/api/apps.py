from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Import INSIDE ready() after Django app registry is initialized
        from django.contrib.auth import get_user_model

        User = get_user_model()

        if not User.objects.filter(username="demo").exists():
            User.objects.create_user(
                username="demo",
                password="demo123"
            )
