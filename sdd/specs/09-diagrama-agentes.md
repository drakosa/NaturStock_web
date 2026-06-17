# Diagrama de Agentes — NaturaStock Cusco

Estructura jerárquica de agentes SDD para el proyecto.

```
┌─────────────────────────────────────────────────────────────┐
│                   AGENTE PRINCIPAL                          │
│              OpenCode / SDD Controller                      │
│                                                             │
│  Lee: agent.md → init.md → memory.md → specs/               │
│  Decide qué subagente activar según la tarea                │
└──────────────────────┬──────────────────────────────────────┘
          ┌────────────┼────────────┬────────────┬────────────┐
          ▼            ▼            ▼            ▼
┌─────────────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────┐
│ FRONTEND AGENT  │ │ DATABASE   │ │ QA AGENT │ │ DOCUMENTATION│
│                 │ │ AGENT      │ │          │ │ AGENT        │
│ Cambios         │ │             │ │ Testing  │ │              │
│ visuales y UI   │ │ Revisar BD  │ │ y        │ │ Documentar   │
│                 │ │ (no modificar│ │ calidad  │ │ especs y     │
│                 │ │  sin permiso)│ │          │ │ memoria      │
└────────┬────────┘ └────────────┘ └──────────┘ └──────────────┘
         ▼
┌─────────────────┐
│   UI / UX       │
│                 │
│ Design System   │
│ Responsive      │
│ Consistencia    │
│ visual          │
└─────────────────┘
```

## Responsabilidades por agente

| Agente | Responsabilidad | Documento |
|--------|----------------|-----------|
| **Agente Principal** | Orquestar tareas, leer contexto, delegar trabajo, validar cambios | `agent.md`, `init.md`, `memory.md` |
| **Frontend Agent** | Cambios en HTML, CSS, UI/UX. No modificar lógica de negocio | `subagents/frontend-agent.md` |
| **Database Agent** | Revisar y documentar esquema BD. No modificar sin permiso | `subagents/database-agent.md` |
| **QA Agent** | Ejecutar pruebas post-cambio, verificar estabilidad | `subagents/qa-agent.md` |
| **Documentation Agent** | Mantener especificaciones, memoria y documentación SDD | `subagents/documentation-agent.md` |

## Flujo de trabajo entre agentes

```
1. Usuario solicita un cambio
2. Agente Principal revisa contexto (init.md, memory.md, specs/)
3. Agente Principal delega al subagente correspondiente
4. Subagente ejecuta la tarea (o prepara especificación)
5. QA Agent verifica que la app sigue funcionando
6. Documentation Agent actualiza memoria si es necesario
7. Agente Principal presenta resultado al usuario
8. Usuario aprueba o rechaza
```
