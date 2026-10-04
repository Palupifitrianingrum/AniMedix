import uuid

from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL


class Consultation(models.Model):
    STATUS = [("menunggu", "Menunggu"), ("berlangsung", "Berlangsung"), ("selesai", "Selesai")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="consultations")
    vet = models.ForeignKey(User, on_delete=models.CASCADE, related_name="vet_consultations")
    status = models.CharField(max_length=20, choices=STATUS, default="menunggu")
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "consultations"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status__in=["menunggu", "berlangsung", "selesai"]),
                name="consultations_status_valid",
            )
        ]


class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_messages"


class Payment(models.Model):
    STATUS = [("pending", "Pending"), ("paid", "Paid"), ("expired", "Expired")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    vet_commission = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "payments"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status__in=["pending", "paid", "expired"]),
                name="payments_status_valid",
            )
        ]
