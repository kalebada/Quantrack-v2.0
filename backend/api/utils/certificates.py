import os
from io import BytesIO
from django.conf import settings
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
import qrcode


def generate_volunteer_certificate(volunteer, event, certificate_code):
    # File setup
    filename = f"{volunteer.user.username}_{event.name}_{event.id}.pdf"
    save_path = os.path.join(settings.MEDIA_ROOT, "certificates")
    os.makedirs(save_path, exist_ok=True)
    full_path = os.path.join(save_path, filename)

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    org = event.organization

    # ===== Background =====
    c.setFillColor(HexColor("#0d0d0d"))  # Dark background
    c.rect(0, 0, width, height, stroke=0, fill=1)

    # ===== Neon Border =====
    c.setStrokeColor(HexColor("#9b51e0"))
    c.setLineWidth(6)
    c.rect(40, 40, width - 80, height - 80)

    c.setStrokeColor(HexColor("#6c2bbf"))
    c.setLineWidth(2)
    c.rect(60, 60, width - 120, height - 120)

    # ===== Logo =====
    if org.logo and os.path.exists(org.logo.path):
        logo = ImageReader(org.logo.path)
        c.drawImage(logo, width / 2 - 40, height - 150, width=80, height=80, mask='auto')

    # ===== Title =====
    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(HexColor("#9b51e0"))
    c.drawCentredString(width / 2, height - 200, "Certificate of Participation")

    # ===== Subtitle =====
    c.setFont("Helvetica", 16)
    c.setFillColor(HexColor("#f2f2f2"))
    c.drawCentredString(width / 2, height - 230, "This certifies that")

    # ===== Recipient =====
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(HexColor("#bb86fc"))
    c.drawCentredString(width / 2, height - 270, volunteer.user.username)

    # ===== Event =====
    c.setFont("Helvetica", 14)
    c.setFillColor(HexColor("#f2f2f2"))
    c.drawCentredString(width / 2, height - 310, "has successfully completed participation in")
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(HexColor("#9b51e0"))
    c.drawCentredString(width / 2, height - 335, f"“{event.name}”")

    # ===== Details =====
    c.setFont("Helvetica", 12)
    c.setFillColor(HexColor("#cccccc"))
    c.drawCentredString(width / 2, height - 370, f"Date: {event.date.strftime('%B %d, %Y')}")
    c.drawCentredString(width / 2, height - 390, f"Service Hours: {event.service_hours}")

    # ===== Organization =====
    c.setFont("Helvetica-BoldOblique", 13)
    c.setFillColor(HexColor("#9b51e0"))
    c.drawCentredString(width / 2, 120, f"Issued by: {org.name}")

    # ===== Certificate Code =====
    c.setFont("Helvetica-Oblique", 10)
    c.setFillColor(HexColor("#888888"))
    c.drawCentredString(width / 2, 100, f"Verification Code: {certificate_code}")

    # ===== Signature Line =====
    c.setStrokeColor(HexColor("#9b51e0"))
    c.line(width / 2 - 100, 80, width / 2 + 100, 80)
    c.setFont("Helvetica", 10)
    c.setFillColor(HexColor("#cccccc"))
    c.drawCentredString(width / 2, 65, "Authorized Signature")

    # ===== QR Code =====
    verification_url = f"https://quantrack.com/verify/{certificate_code}"
    qr = qrcode.make(verification_url)
    qr_buffer = BytesIO()
    qr.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)
    qr_image = ImageReader(qr_buffer)
    c.drawImage(qr_image, width - 150, 60, width=80, height=80, mask='auto')

    # ===== Glow Effect (subtle) =====
    c.setStrokeColor(HexColor("#9b51e0"))
    c.setLineWidth(0.3)
    for offset in range(1, 6):
        c.rect(40 - offset, 40 - offset, width - 80 + offset * 2, height - 80 + offset * 2, stroke=1, fill=0)

    # ===== Footer note =====
    c.setFont("Helvetica", 8)
    c.setFillColor(HexColor("#555555"))
    c.drawCentredString(width / 2, 45, "Scan QR or visit Quantrack.com/verify to confirm authenticity.")

    # Finish
    c.showPage()
    c.save()

    with open(full_path, "wb") as f:
        f.write(buffer.getvalue())

    buffer.seek(0)
    return full_path, buffer




def generate_summary_certificate(volunteer, participations, start_date, end_date, total_hours, certificate_code):
    # File setup
    filename = f"Summary_{volunteer.user.username}_{certificate_code}.pdf"
    save_path = os.path.join(settings.MEDIA_ROOT, 'certificates')
    os.makedirs(save_path, exist_ok=True)
    full_path = os.path.join(save_path, filename)
    buffer = BytesIO()

    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Background color (matching your site’s dark theme)
    c.setFillColorRGB(0.07, 0.07, 0.1)  # Dark gray background
    c.rect(0, 0, width, height, fill=1)

    # Title section
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, height - 100, "Quantrack Volunteer Summary Certificate")

    # Subtitle
    c.setFont("Helvetica", 16)
    c.drawCentredString(width / 2, height - 130, f"Presented to {volunteer.user.username}")
    c.setFont("Helvetica-Oblique", 14)
    c.drawCentredString(width / 2, height - 160, f"For outstanding contribution between {start_date} and {end_date}")

    # Total hours
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(HexColor("#9b5de5"))  # purple accent from site
    c.drawCentredString(width / 2, height - 200, f"Total Service Hours: {total_hours}h")

    # Divider line
    c.setStrokeColor(HexColor("#9b5de5"))
    c.line(100, height - 220, width - 100, height - 220)

    # List of events
    y = height - 250
    c.setFont("Helvetica", 12)
    c.setFillColor(HexColor("#ffffff"))
    for p in participations[:6]:  # show up to 6 events
        c.drawString(120, y, f"- {p.event.name} ({p.event.organization.name}) – {p.hours_completed}h")
        y -= 20

    if len(participations) > 6:
        c.drawString(120, y, f"... and {len(participations)-6} more events")

    # QR Code (bottom-right)
    qr_url = f"https://quantrack.com/verify/{certificate_code}"
    qr_img = qrcode.make(qr_url)
    qr_buffer = BytesIO()
    qr_img.save(qr_buffer)
    qr_buffer.seek(0)
    c.drawImage(ImageReader(qr_buffer), width - 150, 40, width=100, height=100, mask='auto')

    # Certificate code
    c.setFont("Helvetica-Oblique", 10)
    c.setFillColor(HexColor("#cccccc"))
    c.drawString(50, 50, f"Certificate Code: {certificate_code}")
    c.drawString(50, 35, f"Verify at: {qr_url}")

    c.showPage()
    c.save()

    with open(full_path, 'wb') as f:
        f.write(buffer.getvalue())

    buffer.seek(0)
    return full_path, buffer