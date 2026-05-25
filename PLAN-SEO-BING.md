# Plan SEO para Bing y Citas de IA

## Objetivo principal

Posicionar el sitio para consultas transaccionales y diarias de Latinoamérica en Bing, con foco en:

- `rojadirecta en vivo`
- `roja directa en vivo`
- `pirlo tv`
- `futbol libre`
- `partidos de hoy`
- `liga mx en vivo`
- `futbol argentino en vivo`
- `brasileirao en vivo`
- `liga betplay en vivo`
- `liga pro ecuador en vivo`
- `copa libertadores hoy`
- `mls en vivo`

Además del tráfico orgánico clásico, el sitio debe maximizar la probabilidad de aparecer como fuente citada en Bing Copilot y otros sistemas de respuestas con citas.

## Estado actual implementado

- La fuente de datos ya apunta a `https://sportsonline.ppvtv.top/api/matches.json`.
- Los partidos se normalizan a un formato estable con `teams`, `league`, `date`, `time` y `channels`.
- El sitio ya crea hubs permanentes para ligas y categorías prioritarias, incluso cuando todavía no haya partidos en ese momento.
- La portada y los hubs ya incluyen copy en español, preguntas frecuentes y señales para `speakable`.

## Prioridades de palabras clave

### Cluster 1: marca e intención fuerte

- `rojadirecta en vivo`
- `roja directa en vivo`
- `pirlo tv`
- `futbol libre`
- `tarjeta roja`

### Cluster 2: intención diaria

- `partidos de hoy`
- `futbol en vivo hoy`
- `ver futbol hoy gratis`
- `agenda futbol hoy`
- `a que hora juega [equipo]`

### Cluster 3: ligas LATAM

- `liga mx en vivo`
- `liga profesional argentina en vivo`
- `brasileirao en vivo`
- `liga betplay en vivo`
- `liga pro ecuador en vivo`
- `primera division chile en vivo`
- `liga uruguaya en vivo`
- `copa libertadores en vivo`
- `copa sudamericana en vivo`
- `mls en vivo`

### Cluster 4: consultas para citas de IA

- `donde ver [equipo] vs [equipo] en vivo`
- `a que hora juega [equipo] hoy`
- `en que canal pasan [equipo] vs [equipo]`
- `que partidos hay hoy en liga mx`
- `que partidos hay hoy en copa libertadores`

## Estrategia de arquitectura

### 1. Portada como hub maestro

- Mantener la portada enfocada en `rojadirecta en vivo`, `pirlo tv` y `futbol libre`.
- Mostrar primero ligas latinoamericanas y luego categorías internacionales.
- Mantener bloques cortos y claros que expliquen qué partidos hay hoy y qué cubre el sitio.

### 2. Hubs de liga permanentes

Crear y fortalecer hubs indexables para:

- Liga MX
- Liga Profesional Argentina
- Brasileirão
- Liga BetPlay Dimayor
- LigaPro Ecuador
- Primera División Chile
- Liga AUF Uruguay
- MLS
- Copa Libertadores
- Copa Sudamericana
- LaLiga
- Premier League
- Serie A
- Bundesliga
- Ligue 1

Cada hub debe tener:

- título único
- meta description propia
- resumen corto arriba del listado
- FAQ breve con intención informativa
- enlaces internos hacia equipos y partidos

### 3. Páginas de equipo y partido

- Las páginas de equipo deben capturar intención repetida y long-tail.
- Las páginas de partido deben responder rápido a `donde ver`, `a que hora`, `en que canal`.
- Mantener URLs estables y limpias con slugs normalizados.

## Estrategia para citas de IA

### Qué busca Bing Copilot para citar mejor

- respuestas cortas y directas visibles en HTML
- páginas frescas con fecha y hora claras
- estructura consistente por entidad: liga, equipo, partido
- datos estructurados válidos
- bloques FAQ reales, no relleno genérico

### Acciones concretas

#### 1. Respuesta corta arriba del contenido

En cada hub y cada partido incluir un bloque de 2 a 4 líneas que responda:

- qué es esta página
- qué partidos muestra
- cuándo se actualizó
- qué usuario resuelve

#### 2. Preguntas frecuentes orientadas a búsqueda

Usar preguntas del tipo:

- `¿Dónde ver Liga MX en vivo hoy?`
- `¿Qué partidos hay hoy en Copa Libertadores?`
- `¿A qué hora juega [equipo]?`
- `¿En qué canal transmiten [equipo] vs [equipo]?`

#### 3. Reforzar frescura

- Mostrar `Actualizado` en portada, hubs y partidos.
- Mantener el sitemap y el ping de IndexNow tras cada despliegue.
- Si se cambia el feed, volver a empujar URLs clave: portada, `/hoy/`, `/partidos-de-hoy/`, hubs activos y partidos nuevos.

#### 4. Señales de entidad

- Mantener el mismo nombre de liga y equipo en todos los enlaces internos.
- Evitar variaciones innecesarias en slugs o etiquetas.
- Repetir de forma natural el nombre de la liga en `title`, `h1`, breadcrumb y FAQ.

## Roadmap de 30 días

### Semana 1

- Verificar sitemap en Bing Webmaster Tools.
- Enviar manualmente portada, `/hoy/`, `/partidos-de-hoy/` y hubs LATAM principales.
- Revisar cobertura de indexación y páginas excluidas.
- Confirmar que IndexNow se dispare después de cada deploy relevante.

### Semana 2

- Reescribir las landing pages de keywords principales con foco LATAM:
  `pirlo-tv`, `futbol-libre`, `rojadirecta-en-vivo`, `tarjeta-roja`.
- Añadir menciones naturales a Liga MX, Argentina, Brasil, Colombia, Ecuador, Chile, Uruguay y Libertadores.
- Crear bloques FAQ específicos por keyword, no solo genéricos.

### Semana 3

- Publicar páginas editoriales cortas para consultas recurrentes:
  `liga-mx-hoy`, `libertadores-hoy`, `futbol-argentino-hoy`, `partidos-de-hoy-latam`.
- Enlazar esas páginas desde la portada y desde `/hoy/`.
- Revisar qué hubs reciben impresiones en Bing y reforzar los que ya muestran demanda.

### Semana 4

- Medir en Bing Webmaster Tools las consultas con impresiones y CTR.
- Ajustar títulos y descripciones según consultas reales.
- Expandir el contenido de los hubs que ya consiguen impresiones, especialmente `Liga MX`, `Brasileirão`, `Copa Libertadores` y `MLS`.

## Métricas a vigilar

- páginas indexadas en Bing
- impresiones por keyword cluster
- CTR en portada, `/hoy/` y hubs principales
- páginas citadas en respuestas de Bing Copilot
- crecimiento de impresiones para consultas LATAM
- nuevas URLs rastreadas después de cada deploy

## Recomendaciones editoriales

- Todo el texto debe permanecer en español.
- Escribir para intención real, no para repetir keywords sin control.
- Priorizar párrafos cortos, listas breves y respuestas concretas.
- Evitar copy genérico repetido entre ligas diferentes.
- Mantener una diferencia clara entre portada, hub, equipo y partido.

## Siguiente bloque de trabajo recomendado

1. Reoptimizar `pirlo-tv`, `futbol-libre`, `rojadirecta-en-vivo` y `tarjeta-roja` con enfoque LATAM.
2. Añadir un bloque visible de `Última actualización` en la portada y en los hubs.
3. Crear 3 a 5 páginas editoriales de apoyo para `liga mx hoy`, `libertadores hoy`, `futbol argentino hoy`, `brasileirao hoy` y `mls hoy`.