from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "full_name", "role", "avatar", "job_title", "phone")
        read_only_fields = ("id", "role")

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class AdminUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        read_only_fields = ("id",)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name", "role")

    def validate_role(self, value):
        request = self.context.get("request")
        if value == User.Role.ADMIN and (not request or not request.user.is_authenticated or not request.user.is_admin_role):
            raise serializers.ValidationError("Only admins can create another admin.")
        return value

    def create(self, validated_data):
        role = validated_data.pop("role", User.Role.MEMBER)
        user = User.objects.create_user(**validated_data)
        user.role = role
        user.save(update_fields=["role"])
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["username"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is disabled.")
        refresh = RefreshToken.for_user(user)
        return {
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
