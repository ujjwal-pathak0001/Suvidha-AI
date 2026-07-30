"""A2SL URL Configuration — REST API for React frontend"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # ── REST API endpoints ──────────────────────────────────────────────────
    path('api/auth/signup/',  views.SignupAPIView.as_view(),  name='api_signup'),
    path('api/auth/login/',   views.LoginAPIView.as_view(),   name='api_login'),
    path('api/auth/logout/',  views.LogoutAPIView.as_view(),  name='api_logout'),
    path('api/auth/user/',    views.UserAPIView.as_view(),    name='api_user'),
    path('api/convert/',      views.ConvertAPIView.as_view(), name='api_convert'),

    # ── Legacy Django template routes (kept for backwards compat) ───────────
    path('about/',     views.about_view,     name='about'),
    path('contact/',   views.contact_view,   name='contact'),
    path('login/',     views.login_view,     name='login'),
    path('logout/',    views.logout_view,    name='logout'),
    path('signup/',    views.signup_view,    name='signup'),
    path('animation/', views.animation_view, name='animation'),
    path('',           views.home_view,      name='home'),
]
