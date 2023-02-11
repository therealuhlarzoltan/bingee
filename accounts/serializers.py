from rest_framework import serializers

from django.conf import settings

from .models import CustomUser

from rest_framework.validators import UniqueValidator

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView



class UserCreateSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
    country = serializers.CharField(write_only=True)
    gender = serializers.CharField(write_only=True)
    birth_date = serializers.DateField(write_only=True)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'birth_date', 'password', 'password2', 'username', 'first_name', 'last_name', 'gender', 'country']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
    
        if not any(country[0] == data.get("country") for country in settings.COUNTRY_CHOICES):
            raise serializers.ValidationError({"country":"Country must be a valid choice"})
        if not any(gender[0] == data.get("gender") for gender in settings.GENDER_CHOICES):
            raise serializers.ValidationError({"gender":"Gender must be a valid choice"})
        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        email_qs = CustomUser.objects.filter(email=data.get("email"))
        if email_qs.exists():
            raise serializers.ValidationError({"email":"A user with this email address already exists"})
        return data
        

    def save(self):
        user = CustomUser(email=self.validated_data['email'], birth_date=self.validated_data['birth_date'], 
                gender=self.validated_data['gender'], country=self.validated_data['country'], username=self.validated_data['username'],
                first_name=self.validated_data['first_name'], last_name=self.validated_data['last_name'])
        password = self.validated_data['password']
        try:
            validate_password(self.validated_data['password'], user)
        except ValidationError as e:
            raise serializers.ValidationError({"password":"Password is too weak"})
        user.set_password(password)
        user.save()
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token

