# RestoBar

Aplicación web para el procesamiento y gestión de imágenes con estadísticas de uso.

## Caracteristicas Principales

### Subida de Imágenes
- Carga de imágenes en formato JPG/JPEG
- Conversión automática a PNG
- Almacenamiento en Firebase Storage
  DataSet en Firestore
- Límite de tamaño: 1MB por imagen
- Vista previa antes de subir

### Estadísticas y Visualización
- Visualización de imágenes por rango de fechas
- Estadísticas de carga por hora
- Tabla de imagenes subidas con ordenamiento
- Gráfico de barras para ver imagenes subidas agrupadas por hora

## Guía de Uso

1. **Subir Imagen**
   - Acceder a la página principal
   - Hacer clic en el área de carga o arrastrar una imagen

2. **Ver Estadísticas**
   - Ir a la sección "Estadísticas"
   - Seleccionar un rango de fechas (se visualizaran las imagenes subidas en ese rango)

## Requisitos para emular el proyecto

- Node.js >= 18.x
- Angular CLI 18.2.0

## Configuración del Proyecto

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve

# Construir para producción
ng build
```

## API Backend

La documentación detallada de la API está disponible en:
- Desarrollo: http://localhost:3000/api-docs
- Producción: https://restobar-api.onrender.com/api-docs/

## Tecnologías Utilizadas

- se agrego test unitarios en el front
- Angular 18 esta en esta veresion para asegurar temas de compatiblidad al ser muy nueva la veresion 19
- PrimeNG es muy recomendable para angular
- Firebase (Storage + Firestore, y alojamiento) esta nube es muy agil para cosas pequeñas y en la que mas tengo experiencia
- Node.js + Express
- Sharp (procesamiento de imágenes)

