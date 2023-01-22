from rest_framework import serializers

from django.conf import settings

from .models import CustomUser

class UserCreateSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'birth_date', 'password', 'password2', 'username', 'first_name', 'last_name', 'country', 'gender']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
    
        if data['country'] not in settings.COUNTRY_CHOICES:
            raise serializers.ValidationError({"country":"Country must be a valid choice"})
        if data['gender'] not in settings.GENDER_CHOICES:
            raise serializers.ValidationError({"gender":"Gender must be a valid choice"})
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords must match.'})
        return data

    def save(self):
        user = CustomUser(email=self.validated_data['email'], birth_date=self.validated_data['birth_date'], 
                gender=self.validated_data['gender'], country=self.validated_data['country'], username=self.validated_data['username'],
                first_name=self.validated_data['first_name'], last_name=self.validated_data['last_name'])
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user
