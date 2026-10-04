from django.contrib import admin

from .models import CommunityPost, CommunityComment

admin.site.register(CommunityPost)
admin.site.register(CommunityComment)
