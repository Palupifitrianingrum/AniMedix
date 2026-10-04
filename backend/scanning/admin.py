from django.contrib import admin

from .models import Disease, Scan, DetectionResult, MedicalRecord

admin.site.register(Disease)
admin.site.register(Scan)
admin.site.register(DetectionResult)
admin.site.register(MedicalRecord)
