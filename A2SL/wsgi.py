"""
WSGI config for A2SL project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'A2SL.settings')

application = get_wsgi_application()

# Run collectstatic automatically on startup for cloud deployment (Render/Railway)
try:
    from django.core.management import call_command
    from django.conf import settings
    call_command('collectstatic', interactive=False)
except Exception as e:
    print(f"Auto collectstatic status: {e}")

