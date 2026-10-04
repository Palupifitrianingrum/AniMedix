import uuid

from django.conf import settings
from django.db import models


class Disease(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    recommendation = models.TextField(blank=True)
    severity_level = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "diseases"

    def __str__(self):
        return self.name


class Scan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="scans")
    animal = models.ForeignKey("livestock.Animal", on_delete=models.CASCADE, related_name="scans")
    image_url = models.TextField()
    scanned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "scans"


class DetectionResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scan = models.ForeignKey(Scan, on_delete=models.CASCADE, related_name="results")
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name="detections")
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "detection_results"


class MedicalRecord(models.Model):
    STATUS = [("aktif", "Aktif"), ("sembuh", "Sembuh"), ("dalam_perawatan", "Dalam perawatan")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    animal = models.ForeignKey("livestock.Animal", on_delete=models.CASCADE, related_name="medical_records")
    disease = models.ForeignKey(Disease, null=True, blank=True, on_delete=models.SET_NULL)
    detection_result = models.ForeignKey(DetectionResult, null=True, blank=True, on_delete=models.SET_NULL)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "medical_records"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status__in=["aktif", "sembuh", "dalam_perawatan"]),
                name="medical_records_status_valid",
            )
        ]
