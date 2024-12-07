from django.shortcuts import render, redirect
from .models import Game
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
from .serializers import GameSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import Http404, HttpResponseForbidden, JsonResponse
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password

# Create your views here.
def index(request):
    return render(request, "meugame/index.html")
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_game(request, game_id):
    try:
        game = Game.objects.get(id=game_id)
    except Game.DoesNotExist:
        raise Http404("Note not found")

    if request.method == 'GET':
        # Serializar a nota e retornar como JSON
        serialized_game = GameSerializer(game)
        return Response(serialized_game.data)
    elif request.method == 'POST':
        # Atualizar os dados da nota
        new_game_data = request.data
        game.title = new_game_data.get('title', game.title)
        game.save()
        serialized_note = GameSerializer(game)
        return Response(serialized_note.data)
    elif request.method == 'DELETE':
        # Deletar a nota e retornar HTTP 204 No Content
        game.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def api_games(request):
    if request.method == 'GET':
        games = Game.objects.filter(user=request.user)
        # Serializar a lista de anotações
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Criar uma nova anotação a partir dos dados recebidos
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            all_games = Game.objects.filter(user=request.user)
            for game in all_games:
                if game.title == serializer.validated_data['title']:
                    return Response(status=status.HTTP_409_CONFLICT)
            serializer.save(user=request.user)
            return Response(status=status.HTTP_201_CREATED)
        else:
            # Se os dados não são válidos, retornar um erro
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def api_get_token(request):
    try:
        if request.method == 'POST':
            username = request.data['username']
            password = request.data['password']
            user = authenticate(username=username, password=password)

            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return JsonResponse({"token":token.key})
            else:
                return HttpResponseForbidden()
    except:
        return HttpResponseForbidden()

@api_view(['POST'])
def api_user(request):
    if request.method == 'POST':
        username = request.data['username']
        password = request.data['password']
        users = User.objects.all()
        for user in users:
            if user.username == username:

                print(user.password)
                print(password)
                if check_password(password, user.password):
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_409_CONFLICT)
        email = request.data['email']

        
                
        user = User.objects.create_user(username, email, password)
        user.save()
        return Response(status=204)
@api_view(['GET', 'POST','DELETE'])
@permission_classes([IsAuthenticated])
def api_infos(request):
    if request.method == 'GET':
        username = request.user.username
        email = request.user.email
        return JsonResponse({"username": username, "email": email})
    elif request.method == 'POST':
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        
        # Atualiza o usuário com os novos valores
        User.objects.filter(username=request.user.username).update(username=username, email=email)
        # Atualiza a senha, se houver uma senha nova
        if password:
            request.user.set_password(password)
            request.user.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'DELETE':
        for game in Game.objects.filter(user=request.user):
            game.delete()
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

