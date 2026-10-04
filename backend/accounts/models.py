import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("email wajib diisi")
        user = self.model(email=self.normalize_email(email), **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("role", "admin")
        user = self.create_user(email, password, **extra)
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    ROLES = [("peternak", "Peternak"), ("dokter", "Dokter"), ("admin", "Admin")]
    SCALES = [("kecil", "Kecil"), ("menengah", "Menengah"), ("besar", "Besar")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLES)
    farm_scale = models.CharField(max_length=20, choices=SCALES, blank=True)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    # akses admin Django; ponytail: tanpa PermissionsMixin, superuser = semua izin
    @property
    def is_staff(self):
        return self.is_superuser or self.role == "admin"

    @property
    def is_active(self):
        return True

    def has_perm(self, perm, obj=None):
        return self.is_staff

    def has_module_perms(self, app_label):
        return self.is_staff

    class Meta:
        db_table = "users"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(role__in=["peternak", "dokter", "admin"]),
                name="users_role_valid",
            ),
            models.CheckConstraint(
                condition=models.Q(farm_scale__in=["kecil", "menengah", "besar", ""]),
                name="users_farm_scale_valid",
            ),
        ]

    def __str__(self):
        return self.email


class VetProfile(models.Model):
    STATUS = [("pending", "Pending"), ("verified", "Verified"), ("rejected", "Rejected")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vet_profile")
    clinic = models.ForeignKey(
        "clinics.Clinic", null=True, blank=True, on_delete=models.SET_NULL, related_name="vets"
    )
    license_number = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100, blank=True)
    verification_status = models.CharField(max_length=20, choices=STATUS, default="pending")
    verification_document_url = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "vet_profiles"
