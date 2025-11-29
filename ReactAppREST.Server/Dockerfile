# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia los csproj
COPY ["ReactAppREST.Server/ReactAppREST.Server.csproj", "ReactAppREST.Server/"]

# Restaura dependencias
RUN dotnet restore "./ReactAppREST.Server/ReactAppREST.Server.csproj"

# Copia el resto de archivos
COPY . .

WORKDIR "/src/ReactAppREST.Server"

# Publicar en modo Release
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Usar puerto por defecto de Asp.Net en contenedores (Render lo manejará)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ReactAppREST.Server.dll"]
