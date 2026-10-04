import uuid

from django.conf import settings
from django.db import models


class Animal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="animals")
    name_or_code = models.CharField(max_length=100)
    species = models.CharField(max_length=50)
    age_group = models.CharField(max_length=50, blank=True)
    photo_url = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "animals"

    def __str__(self):
        return f"{self.name_or_code} ({self.species})"
