from django.contrib.auth import get_user_model
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .permissions import IsAdminRole
from .serializers import AdminUserSerializer, LoginSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        return Response(UserSerializer(request.user).data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.order_by("first_name", "username")
    search_fields = ("username", "first_name", "last_name", "email", "job_title")
    ordering_fields = ("date_joined", "username", "role")

    def get_serializer_class(self):
        if self.action == "create":
            return RegisterSerializer
        if self.request.user.is_authenticated and self.request.user.is_admin_role:
            return AdminUserSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ["create", "destroy"]:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.user.is_admin_role:
            return qs
        return qs.filter(id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        if not request.user.is_admin_role and str(kwargs.get("pk")) != str(request.user.id):
            self.permission_denied(request, message="You can only update your own profile.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_admin_role and str(kwargs.get("pk")) != str(request.user.id):
            self.permission_denied(request, message="You can only update your own profile.")
        return super().partial_update(request, *args, **kwargs)
