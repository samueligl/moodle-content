import axios from 'axios';

const moodleUrl = import.meta.env.VITE_MOODLE_URL || '';
const moodleToken = import.meta.env.VITE_MOODLE_TOKEN || '';

// Configuración base de Axios
const apiClient = axios.create({
  baseURL: moodleUrl ? `${moodleUrl}/webservice/rest/server.php` : '',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Interceptor para inyectar token y formato en todas las peticiones
apiClient.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {};
  }
  config.params.wstoken = moodleToken;
  config.params.moodlewsrestformat = 'json';
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para procesar la respuesta y errores nativos de Moodle
apiClient.interceptors.response.use((response) => {
  const data = response.data;
  // Si Moodle devuelve un objeto JSON con error
  if (data && typeof data === 'object' && (data.exception || data.errorcode)) {
    const errorMsg = data.message || `Moodle Error: ${data.errorcode}`;
    console.error('Moodle API Error:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

// === SERVICIOS ESPECÍFICOS DE MOODLE ===

const moodleService = {

  /**
   * Obtiene la lista de cursos del usuario o del sitio.
   */
  async getCourses() {
    if (!moodleUrl || !moodleToken) {
      throw new Error("Falta configurar VITE_MOODLE_URL o VITE_MOODLE_TOKEN en tu archivo .env");
    }
    const response = await apiClient.post('', null, {
      params: { wsfunction: 'core_course_get_courses' }
    });

    const data = response.data;
    // Normalizar la respuesta a un arreglo de cursos
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && Array.isArray(data.courses)) {
      return data.courses;
    }
    console.warn('Formato de cursos inesperado:', data);
    return [];
  },

  /**
   * Obtiene el contenido estructurado de un curso.
   * @param {number|string} courseId ID del curso
   */
  async getCourseContents(courseId) {
    const response = await apiClient.post('', null, {
      params: {
        wsfunction: 'core_course_get_contents',
        courseid: courseId,
      }
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtiene los próximos eventos del calendario.
   */
  async getCalendarEvents() {
    const response = await apiClient.post('', null, {
      params: { wsfunction: 'core_calendar_get_calendar_events' }
    });
    const data = response.data;
    if (data && Array.isArray(data.events)) {
      return data.events;
    }
    return [];
  },

  /**
   * Obtiene las sesiones de asistencia.
   * Nota: Este webservice depende del plugin mod_attendance habilitado.
   * @param {number|string} courseId ID del curso (opcional dependiendo de la implementación)
   */
  async getAttendanceSessions(courseId = null) {
    const params = { wsfunction: 'mod_attendance_get_sessions' };
    if (courseId) {
      params.courseid = courseId;
    }
    const response = await apiClient.post('', null, { params });
    const data = response.data;
    return Array.isArray(data) ? data : [];
  }
};

export default moodleService;
