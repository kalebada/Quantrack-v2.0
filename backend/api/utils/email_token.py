import random
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.hashers import make_password

def generate_verification_code():
    return str(random.randint(100000, 999999))


def send_verification_email(request, user):
    code = generate_verification_code()

    user.verification_code = make_password(code)
    user.verification_code_expiry = timezone.now() + timedelta(minutes=10)
    user.save()

    subject = "QuanTrack Email Verification Code"
    message = f"""
Hi {user.username},

Your QuanTrack verification code is:

{code}

This code will expire in 10 minutes.

If you did not register, please ignore this email.
"""

    user.email_user(subject, message)