from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/games/<int:game_id>/', views.api_game),
    path('api/games/', views.api_games),
    path('api/token/', views.api_get_token),
    path('api/users/', views.api_user),
    path('api/infos/', views.api_infos),
]