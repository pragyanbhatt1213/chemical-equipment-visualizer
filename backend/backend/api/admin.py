#It lets you see, add, delete database rows visually
from django.contrib import admin
#Import the table you created
from .models import Dataset

#Show Dataset table inside admin panel
admin.site.register(Dataset)

#“I used Django Admin to inspect and manage dataset history.”