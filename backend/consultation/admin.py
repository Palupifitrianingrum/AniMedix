from django.contrib import admin

from .models import Consultation, ChatMessage, Payment

admin.site.register(Consultation)
admin.site.register(ChatMessage)
admin.site.register(Payment)
