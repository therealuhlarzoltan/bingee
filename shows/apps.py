from django.apps import AppConfig


class ShowsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shows'

    def ready(self):
        import shows.signals