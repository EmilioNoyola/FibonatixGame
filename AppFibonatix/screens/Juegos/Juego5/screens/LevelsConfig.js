// LevelsConfig.js
const levelsConfig = [
    {
      id: 1,
      name: 'Fácil',
      description: 'Números del 0-10, operaciones sencillas',
      config: {
        levelNumber: 1,
        initialTimeLeft: 30,
        minNumberRange: 0,
        maxNumberRange: 10,
        operationsToComplete: 6,
        scoreIncrement: 10,
        timeIncrement: 5,
        timePenalty: 5
      }
    },
    {
      id: 2,
      name: 'Intermedio',
      description: 'Números del 10-50, mayor dificultad',
      config: {
        levelNumber: 2,
        initialTimeLeft: 25,
        minNumberRange: 10,
        maxNumberRange: 50,
        operationsToComplete: 6,
        scoreIncrement: 15,
        timeIncrement: 4,
        timePenalty: 6
      }
    },
    {
      id: 3,
      name: 'Difícil',
      description: 'Números del 20-100, menos tiempo',
      config: {
        levelNumber: 3,
        initialTimeLeft: 20,
        minNumberRange: 20,
        maxNumberRange: 100,
        operationsToComplete: 8,
        scoreIncrement: 20,
        timeIncrement: 3,
        timePenalty: 7
      }
    },
    // Puedes agregar más niveles aquí fácilmente
  ];
  
  export default levelsConfig;