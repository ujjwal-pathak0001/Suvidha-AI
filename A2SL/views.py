from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.staticfiles import finders

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token


# ─── NLP Processing Helper ───────────────────────────────────────────────────

STOP_WORDS = set([
    "mightn't", 're', 'wasn', 'wouldn', 'be', 'has', 'that', 'does',
    'shouldn', 'do', "you've", 'off', 'for', "didn't", 'm', 'ain', 'haven',
    "weren't", 'are', "she's", "wasn't", 'its', "haven't", "wouldn't", 'don',
    'weren', 's', "you'd", "don't", 'doesn', "hadn't", 'is', 'was', "that'll",
    "should've", 'a', 'then', 'the', 'mustn', 'i', 'nor', 'as', "it's",
    "needn't", 'd', 'am', 'have', 'hasn', 'o', "aren't", "you'll", "couldn't",
    "you're", "mustn't", 'didn', "doesn't", 'll', 'an', 'hadn', 'whom', 'y',
    "hasn't", 'itself', 'couldn', 'needn', "shan't", 'isn', 'been', 'such',
    'shan', "shouldn't", 'aren', 'being', 'were', 'did', 'ma', 't', 'having',
    'mightn', 've', "isn't", "won't"
])


def process_text_to_signs(text):
    """
    Core NLP pipeline: tokenize → POS-tag → tense detection → 
    stopword removal → lemmatization → map to available sign videos.
    Returns list of sign words/letters to animate.
    """
    text_lower = text.lower()
    words = word_tokenize(text)

    tagged = nltk.pos_tag(words)
    tense = {}
    tense["future"] = len([w for w in tagged if w[1] == "MD"])
    tense["present"] = len([w for w in tagged if w[1] in ["VBP", "VBZ", "VBG"]])
    tense["past"] = len([w for w in tagged if w[1] in ["VBD", "VBN"]])
    tense["present_continuous"] = len([w for w in tagged if w[1] in ["VBG"]])

    lr = WordNetLemmatizer()
    filtered_text = []
    for w, p in zip(words, tagged):
        if w not in STOP_WORDS:
            if p[1] in ['VBG', 'VBD', 'VBZ', 'VBN', 'NN']:
                filtered_text.append(lr.lemmatize(w, pos='v'))
            elif p[1] in ['JJ', 'JJR', 'JJS', 'RBR', 'RBS']:
                filtered_text.append(lr.lemmatize(w, pos='a'))
            else:
                filtered_text.append(lr.lemmatize(w))

    words = filtered_text
    temp = []
    for w in words:
        if w == 'I':
            temp.append('Me')
        else:
            temp.append(w)
    words = temp

    probable_tense = max(tense, key=tense.get)
    if probable_tense == "past" and tense["past"] >= 1:
        words = ["Before"] + words
    elif probable_tense == "future" and tense["future"] >= 1:
        if "Will" not in words:
            words = ["Will"] + words
    elif probable_tense == "present" and tense["present_continuous"] >= 1:
        words = ["Now"] + words

    # Map to available video files (case-insensitive for Linux)
    final_words = []
    for w in words:
        candidates = [w.capitalize(), w.upper(), w, w.lower()]
        found = None
        for cand in candidates:
            if finders.find(cand + ".mp4"):
                found = cand
                break
        if found:
            final_words.append(found)
        else:
            for c in w:
                c_upper = c.upper()
                if finders.find(c_upper + ".mp4"):
                    final_words.append(c_upper)
                else:
                    final_words.append(c)

    return final_words


# ─── REST API Views ──────────────────────────────────────────────────────────

class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password1 = request.data.get('password1', '')
        password2 = request.data.get('password2', '')

        if not username or not password1 or not password2:
            return Response(
                {'error': 'Username and both password fields are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if password1 != password2:
            return Response(
                {'error': 'Passwords do not match.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(password1) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already taken. Please choose another.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(username=username, password=password1)
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {'token': token.key, 'username': user.username, 'id': user.id},
            status=status.HTTP_201_CREATED
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        from django.contrib.auth import authenticate
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {'error': 'Invalid username or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {'token': token.key, 'username': user.username, 'id': user.id},
            status=status.HTTP_200_OK
        )


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class UserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined.isoformat(),
        })


class ConvertAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        text = request.data.get('sen', '').strip()
        if not text:
            return Response(
                {'error': 'Please provide text to convert.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            words = process_text_to_signs(text)
            return Response({'words': words, 'text': text}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Processing error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ─── Legacy Django Template Views (unchanged) ────────────────────────────────

def home_view(request):
    return render(request, 'home.html')

def about_view(request):
    return render(request, 'about.html')

def contact_view(request):
    return render(request, 'contact.html')

@login_required(login_url="login")
def animation_view(request):
    if request.method == 'POST':
        text = request.POST.get('sen')
        words = process_text_to_signs(text)
        return render(request, 'animation.html', {'words': words, 'text': text})
    else:
        return render(request, 'animation.html')

def signup_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('animation')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            if 'next' in request.POST:
                return redirect(request.POST.get('next'))
            else:
                return redirect('animation')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect("home")
