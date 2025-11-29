# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copiamos solo el csproj
COPY ReactAppREST.Server.csproj .

# Restauramos dependencias
RUN dotnet restore ReactAppREST.Server.csproj

# Copiamos el resto del proyecto
COPY . .

# Publicamos
RUN dotnet publish -c Release -o /app/publish


# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ReactAppREST.Server.dll"]
