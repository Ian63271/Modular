# Conexión Social – Plataforma de Voluntariado Digital

Repositorio oficial: https://github.com/Ian63271/Modular

## Resumen

Este proyecto desarrolla un sistema multiplataforma que centraliza la gestión, promoción y seguimiento de proyectos sociales y programas de voluntariado locales. La solución mejora la comunicación entre ciudadanía, instituciones y organizaciones mediante una interfaz accesible, segura y adaptable. La arquitectura cliente-servidor emplea tecnologías abiertas como React Native, Node.js, PostgreSQL y Supabase, priorizando la escalabilidad y el mantenimiento. Se integran módulos de geolocalización e inteligencia artificial (Dialogflow y scikit-learn) para ofrecer experiencias personalizadas y contextuales.

## Introducción

La difusión de voluntariados, talleres y campañas sociales suele fragmentarse por la ausencia de herramientas tecnológicas centralizadas, lo que limita la comunicación y reduce el alcance comunitario. Con el fin de atender esta problemática, se propone un sistema digital integral que concentre la gestión de voluntariados, talleres y unidades receptoras en una sola plataforma.

Entre las innovaciones clave se incluye la localización geográfica de iniciativas, priorizando actividades cercanas al usuario y fomentando la participación ciudadana inmediata. La digitalización de la difusión contribuye, además, a la sostenibilidad ambiental al disminuir el uso de materiales impresos y los residuos asociados.

## Objetivos del Proyecto

- Centralizar la información y seguimiento de programas sociales locales.
- Facilitar la participación ciudadana mediante herramientas de geolocalización.
- Reducir costos y uso de materiales impresos, promoviendo alternativas digitales sostenibles.
- Incorporar automatización e inteligencia artificial para ofrecer experiencias personalizadas.

## Desarrollo del Proyecto

El sistema se implementa inicialmente como una aplicación web accesible desde navegadores convencionales, respetando una arquitectura cliente-servidor que soporta la evolución hacia dispositivos móviles. La metodología de trabajo es Kanban, lo que habilitó entregas iterativas, integración continua y pruebas automatizadas para asegurar la calidad.

### Tecnologías Principales

- **Front-end:** React Native con Expo Router (compatible web, iOS y Android).
- **Back-end / Servicios:** Node.js, Supabase, PostgreSQL.
- **Inteligencia Artificial:** Dialogflow, scikit-learn.
- **Geolocalización:** APIs de ubicación para priorizar proyectos cercanos.

## Resultados y Alcance

- Alta aceptación por parte de usuarios piloto al gestionar actividades desde la plataforma.
- Mayor visibilidad y coordinación de programas gracias a la centralización de información.
- Contribución a la sostenibilidad ambiental mediante la reducción de impresos.

## Puesta en Marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Ejecutar el entorno de desarrollo:

   ```bash
   npx expo start
   ```

3. Seleccionar la opción deseada (Expo Go, emulador Android/iOS o navegador) y seguir las instrucciones en consola. El código fuente principal se encuentra en el directorio `app/` y utiliza enrutamiento basado en archivos.

## Contribuciones

Se agradecen issues y pull requests que fortalezcan la plataforma o amplíen sus módulos (geolocalización, IA conversacional, accesibilidad, etc.). Para cambios mayores, abre primero un issue que permita discutir la propuesta.

## Licencia

Este proyecto se distribuye bajo la **MIT License**. Consulta el archivo `LICENSE` para obtener el texto completo.
