import { CurriculumType } from './curriculum.entity';

export interface SubjectData {
  name: string;
  semester: number;
  code?: string;
}

export interface CurriculumData {
  name: string;
  type: CurriculumType;
  subjects: SubjectData[];
}

export const CURRICULUM_DATA: CurriculumData[] = [
  // MALLA NUEVA (REPOTENCIADA)
  {
    name: 'Malla Nueva (Repotenciada)',
    type: CurriculumType.NEW,
    subjects: [
      // Semestre 1
      { name: 'Conocimiento, Palabra y Cambio Social', semester: 1 },
      { name: 'Cálculo I', semester: 1 },
      { name: 'Física General', semester: 1 },
      { name: 'Pensamiento Computacional', semester: 1 },
      { name: 'Innovación y Creatividad', semester: 1 },
      { name: 'Técnicas Gráficas y Geométricas', semester: 1 },

      // Semestre 2
      { name: 'Fundamentos de Investigación', semester: 2 },
      { name: 'Cálculo II', semester: 2 },
      { name: 'Estadística Aplicada', semester: 2 },
      { name: 'Programación I', semester: 2 },
      { name: 'Ciencias de los Materiales, Procesos y Ciclos', semester: 2 },
      { name: 'Álgebra Lineal y Geometría Analítica', semester: 2 },

      // Semestre 3
      { name: 'Jesucristo y Aprendizajes Vitales', semester: 3 },
      { name: 'Estructuras de Datos', semester: 3 },
      { name: 'Fundamentos de Bases de Datos', semester: 3 },
      { name: 'Programación II', semester: 3 },
      { name: 'Fundamentos Web', semester: 3 },
      { name: 'Sistemas Operativos', semester: 3 },

      // Semestre 4
      { name: 'Algoritmos y Complejidad', semester: 4 },
      { name: 'Ingeniería de Software I', semester: 4 },
      { name: 'Base de Datos Avanzada', semester: 4 },
      { name: 'Arquitectura de Software', semester: 4 },
      { name: 'Desarrollo de Aplicaciones Web (H)', semester: 4 },
      { name: 'Arquitectura de Computadoras', semester: 4 },

      // Semestre 5
      { name: 'Ética e Interculturalidad', semester: 5 },
      { name: 'Ingeniería de Software II', semester: 5 },
      { name: 'Administración de Servidores Web', semester: 5 },
      { name: 'Inteligencia Artificial', semester: 5 },
      { name: 'Virtualización y Computación en la Nube', semester: 5 },
      { name: 'Interacción Humano Computadora', semester: 5 },

      // Semestre 6
      { name: 'Ecología Integral', semester: 6 },
      { name: 'Procesamiento Masivo de Datos', semester: 6 },
      { name: 'Seguridad de Software', semester: 6 },
      { name: 'Desarrollo de Aplicaciones Móviles', semester: 6 },
      { name: 'Internet de las Cosas', semester: 6 },
      { name: 'Motores Gráficos', semester: 6 },

      // Semestre 7
      { name: 'Seminario de Titulación', semester: 7 },
      { name: 'Asignatura 1 de Itinerario', semester: 7 },
      { name: 'Asignatura 2 de Itinerario', semester: 7 },
      { name: 'Industria y Publicación de Videojuegos', semester: 7 },
      { name: 'Informática Legal', semester: 7 },
      { name: 'Hacking Ético', semester: 7 },

      // Semestre 8
      { name: 'Integración Curricular', semester: 8 },
      { name: 'Asignatura 3 de Itinerario', semester: 8 },
      { name: 'Asignatura 4 de Itinerario', semester: 8 },
      { name: 'Investigación Tecnológica Aplicada I', semester: 8 },
      { name: 'Diseño de Videojuegos', semester: 8 },
      { name: 'Modelado, Texturizado y Animación Digital Tridimensional', semester: 8 },
    ],
  },

  // MALLA ANTIGUA
  {
    name: 'Malla Antigua',
    type: CurriculumType.OLD,
    subjects: [
      // Semestre 1
      { name: 'Tecnologías de la Información y de la Comunicación', semester: 1 },
      { name: 'Cálculo I', semester: 1 },
      { name: 'Fundamentos de Programación', semester: 1 },
      { name: 'Introducción a la Programación', semester: 1 },
      { name: 'Programación Orientada a Objetos I', semester: 1 },
      { name: 'Estructuras de Datos I', semester: 1 },
      { name: 'Comunicación Oral y Escrita', semester: 1 },

      // Semestre 2
      { name: 'Algoritmos y Complejidad', semester: 2 },
      { name: 'Objetos y Abstracción de Datos', semester: 2 },
      { name: 'Aplicaciones Móviles I', semester: 2 },
      { name: 'Programación Orientada a Objetos II', semester: 2 },
      { name: 'Estructuras de Datos II', semester: 2 },
      { name: 'Matemáticas Discretas', semester: 2 },

      // Semestre 3
      { name: 'Arquitectura de Computadoras', semester: 3 },
      { name: 'Gráficos y Visualización', semester: 3 },
      { name: 'Fundamentos de Ingeniería en Software', semester: 3 },
      { name: 'Uso y Configuración de Sistemas Operativos', semester: 3 },
      { name: 'Gestión de Base de Datos', semester: 3 },
      { name: 'Jesucristo y la Persona de Hoy', semester: 3 },

      // Semestre 4
      { name: 'Gestión Administrativa', semester: 4 },
      { name: 'Análisis y Modelado de Software', semester: 4 },
      { name: 'Análisis de Requerimientos', semester: 4 },
      { name: 'Base de Datos en la Nube', semester: 4 },
      { name: 'Matemáticas Financieras', semester: 4 },
      { name: 'Interacción Humano Computador', semester: 4 },
      { name: 'Ética Personal y Socioambiental', semester: 4 },

      // Semestre 5
      { name: 'Calidad del Software', semester: 5 },
      { name: 'Sistemas Expertos', semester: 5 },
      { name: 'Desarrollo de Sistemas de Información', semester: 5 },
      { name: 'Tecnologías de Plataforma', semester: 5 },
      { name: 'Análisis y Circuitos Eléctricos', semester: 5 },
      { name: 'Manejo y Desarrollo de Proyectos', semester: 5 },

      // Semestre 6
      { name: 'Administración de Sistemas', semester: 6 },
      { name: 'Inteligencia Artificial y Gamificación', semester: 6 },
      { name: 'Gestión para la Verificación y Validación del Software', semester: 6 },
      { name: 'Arquitectura y Servicios Distribuidos', semester: 6 },
      { name: 'Motores Gráficos', semester: 6 },
      { name: 'Prácticas Preprofesionales', semester: 6 },

      // Semestre 7
      { name: 'Industria y Publicación de Videojuegos', semester: 7 },
      { name: 'Programación de Gráficos por Computadora', semester: 7 },
      { name: 'Prácticas en Gestión de la Información', semester: 7 },
      { name: 'Diseño de Videojuegos y de Niveles', semester: 7 },
      { name: 'Comportamiento Organizacional', semester: 7 },
      { name: 'Prácticas Preprofesionales', semester: 7 },
      { name: 'Prácticas de Servicio Comunitario', semester: 7 },

      // Semestre 8
      { name: 'Interfaces de Usuario para Aplicaciones de Negocios', semester: 8 },
      { name: 'Programación Web y para Dispositivos Móviles', semester: 8 },
      { name: 'Mecánica de Juegos y Desarrollo de la Creatividad', semester: 8 },
      { name: 'Modelo de Negocios', semester: 8 },
      { name: 'Modelado, Texturizado y Animación Digital Tridimensional', semester: 8 },
      { name: 'Integración Curricular', semester: 8 },
    ],
  },
];
