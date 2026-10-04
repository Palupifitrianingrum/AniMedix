import uuid

from django.conf import settings
from django.db import models


class EducationArticle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    content = models.TextField()
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "education_articles"

    def __str__(self):
        return self.title
