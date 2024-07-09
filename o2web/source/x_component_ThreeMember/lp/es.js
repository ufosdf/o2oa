MWF.xApplication = MWF.xApplication || {};
MWF.xApplication.ThreeMember = MWF.xApplication.ThreeMember || {};
MWF.xApplication.ThreeMember.LP={
	"title": "Tres miembros",
	"person": "Usuario",
	"node": "Nodo",
	"clientIp": "IP del cliente",
	"module": "Módulo",
	"operation": "Operación",
	"httpType": "Tipo",
	"httpStatus": "Estado",
	"httpUrl": "Dirección de solicitud",
	"startTime": "Inicio",
	"endTime": "Fin",
	"createTime": "Hora de inicio",
	"updateTime": "Hora de finalización",
	"requestTime": "Hora de solicitud",
	"spendTime": "Duración de ejecución (milisegundos)",
	"spendTime1": "Duración de ejecución",
	"millisecond": "milisegundos",
	"firstPage": "Primera página",
	"lastPage": "Última página",
	"query": "Buscar",
	"reset": "Restablecer",
	"noItem": "No se encontraron datos bajo las condiciones actuales",
	"all": "Todos los registros",
	"sendData": "Datos de solicitud",
	"cancel": "Cancelar",
	"close": "Cerrar",
	"ok": "Aceptar",
	"edit": "Editar",
	"remove": "Eliminar",
	"action": "Acción",
	"view": "Ver",
	"viewDetail": "Ver",
	"logDetail": "Detalles del registro",
	"yesterday": "Ayer",
	"twoDaysAgo": "Anteayer",
	"weekAgo": "Hace una semana",
	"dayAgo": "Días atrás",
	"hourAgo": "Horas atrás",
	"minuteAgo": "Minutos atrás",
	"justNow": "Ahora mismo",
	"publishJustNow": "Recién publicado",
	"logConfig": "Configuración de registro",
	"viewLog": "regresar",
	"status": "estado",
	"enable": "habilitar",
	"disable": "desactivar",
	"configDetail": "Detalles de configuración",
	"moduleSelect": "Seleccionar módulo",
	"actionSelect": "Selecciona una categoría",
	"methodSelect": "Seleccionar servicio",
	"selectNote": "Nota: La selección de módulos, la selección de categorías y la selección de servicios son solo para la conveniencia de completar automáticamente el tipo y la dirección de solicitud, y no guardan los datos en segundo plano.",
	"createSuccess": "Creado exitosamente",
	"updateSuccess": "Guardar exitosamente",
	"allConfig": "Toda la configuración del registro",
	"deleteConfig": "Eliminar configuración de registro",
	"deleteConfigText": "No se puede restaurar después de eliminarlo. ¿Está seguro de que desea eliminar esta configuración de registro?",
	"deleteConfigOK": "Configuración eliminada exitosamente",
	"createConfig": "Crear configuración de registro",
	"home": "Ingresar al sistema",
	"syncLogSuccess": "Sincronización de registros exitosa",
	"process": "Administración de procesos",
	"cms": "Administración de contenido",
	"portal": "Administración del portal",
	"query1": "Centro de datos",
	"set": "Configuración",
	"syncLog": "Sincronizar ahora",
	"save": "Guardar",
	"saveSuccess": "Guardado con éxito",
	"saveFailure": "Error al guardar",
	"noPermissionText": "Lo siento, la administración de tres miembros no está activada o no tiene permiso para ver esta aplicación.",
	"search": "Buscar aplicación",
	"viewer": "Alcance de uso",
	"publisher": "Editor",
	"manager": "Administrador",
	"starter": "Iniciador",
	"executor": "Ejecutor",
	"dataViewer": "Ver alcance de datos",
	"dataEditor": "Editar alcance de datos",
	"yes": "Sí",
	"no": "No",
	"anonymousAccessible": "Permitir ejecución anónima",
	"log": "Ver registro",
	"permission1": "Permiso de aplicación",
	"org": "Org.",
	"password": "Contraseñas",
	"logout": "Cerrar sesión",
	"welcome": "Hola,",
	"noDataText": {
		"process": "No hay procesos en esta aplicación",
		"category": "No hay categorías en esta aplicación",
		"view": "No hay vistas en esta aplicación",
		"stat": "No hay estadísticas en esta aplicación",
		"table": "No hay tablas de datos en esta aplicación",
		"statement": "No hay configuraciones de consulta en esta aplicación",
		"importer": "No hay configuraciones de importación en esta aplicación"
	},
	"permission": {
		"application": "Permiso de aplicación",
		"process": "Permiso de proceso",
		"column": "Permiso de columna",
		"category": "Permiso de categoría",
		"portal": "Permiso de portal",
		"query": "Permiso de centro de datos",
		"view": "Permiso de vista",
		"stat": "Permiso de estadística",
		"table": "Permiso de tabla de datos",
		"statement": "Permiso de consulta",
		"importer": "Permiso de importación"
	},
	"passwordConfig": {
		"title": "Configuración de la información básica de la cuenta de usuario del sistema",
		"password": "Contraseña predeterminada para nuevos usuarios",
		"passwordNote": "Al crear nuevos usuarios, se utilizará la siguiente contraseña. Los usuarios pueden cambiarla después de iniciar sesión en el sistema.",
		"passwordPeriod": "Tiempo de expiración de la contraseña (días)",
		"passwordPeriodNote": "Si los usuarios no cambian su contraseña después de este número de días, se les pedirá que lo hagan al iniciar sesión en el sistema. De lo contrario, no podrán acceder al sistema.",
		"adminPassword": "Contraseña de superadministrador",
		"adminPasswordNote": "Contraseña de xadmin, el superadministrador. Debido a que hay muchos lugares relacionados con esta contraseña, reinicie el servidor inmediatamente después de cambiarla.",
		"passwordRegex": "Expresión regular de validación de contraseña",
		"passwordRegexNote": "Expresión regular de validación durante el cambio de contraseña",
		"passwordRegexHint": "Texto de sugerencia de validación de contraseña",
		"passwordRegexHintNote": "Texto que aparece cuando la validación de la contraseña falla durante el cambio de contraseña",
		"failureCount": "Número máximo de contraseñas incorrectas",
		"failureCountNote": "Número máximo de veces que se permite ingresar una contraseña incorrecta durante el inicio de sesión",
		"failureInterval": "Tiempo límite de inicio de sesión (minutos)",
		"failureIntervalNote": "Tiempo durante el cual se prohíbe el inicio de sesión después de alcanzar el número máximo de intentos de inicio de sesión fallidos",
		"systemManagerPassword": "Contraseña del administrador del sistema",
		"systemManagerPasswordNote": "Contraseña del administrador del sistema (systemManager)",
		"securityManagerPassword": "Contraseña del administrador de seguridad",
		"securityManagerPasswordNote": "Contraseña del administrador de seguridad (securityManager)",
		"auditManagerPassword": "Contraseña del auditor de seguridad",
		"auditManagerPasswordNote": "Contraseña del auditor de seguridad (auditManager)"
	},
	"delete": "Eliminar",
	"noServiceNote": "El sistema no ha instalado un servicio de fondo de gestión de tres miembros, Póngase en contacto con el Administrador para instalarlo en el mercado de aplicaciones.",
	"lptest": "Esta es la prueba del paquete de idiomas."
}
MWF.xApplication.ThreeMember["lp."+o2.language] = MWF.xApplication.ThreeMember.LP