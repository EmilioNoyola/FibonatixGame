// Las URLs de imágenes son ejemplos, deberás reemplazarlas con URLs reales
export const foods = {
  // Numeros y figuras para el nivel 1 (cantidades)
  level1Foods: [
    { id: "B", name: "Ocho", image: "https://example.com/images/brocoli.png", type: "numero", numOfig: "Num", menordiez: "menor" },
    { id: "C", name: "Uno", image: "https://example.com/images/zanahoria.png", type: "numero", numOfig: "Num", menordiez: "menor" },
    { id: "D", name: "Circulo", image: "https://example.com/images/fresa.png", type: "figura", numOfig: "Fig", menoscinco: "menos" },
    { id: "F", name: "Catorce", image: "https://example.com/images/lechuga.png", type: "numero", numOfig: "Num"},
    { id: "J", name: "Cuadrado", image: "https://example.com/images/melon.png", type: "figura", numOfig: "Fig", menoscinco: "menos" }, 
    { id: "K", name: "Triangulo", image: "https://example.com/images/sandia.png", type: "figura", numOfig: "Fig", menoscinco: "menos" }, 
    { id: "L", name: "Cinco", image: "https://example.com/images/jitomate.png", type: "numero", numOfig: "Num", menordiez: "menor" }, 
    { id: "M", name: "Dos", image: "https://example.com/images/tomate.png", type: "numero", numOfig: "Num", menordiez: "menor" }, 
    { id: "N", name: "Pentagono", image: "https://example.com/images/mango.png", type: "figura", numOfig: "Fig" }, 
    { id: "O", name: "Hexagono", image: "https://example.com/images/platano.png", type: "figura", numOfig: "Fig"},
    { id: "P", name: "Estrella", image: "https://example.com/images/guayaba.png", type: "figura", numOfig: "Fig"},
    { id: "Q", name: "Rombo", image: "https://example.com/images/naranja.png", type: "figura", numOfig: "Fig", menoscinco: "menos" },
    { id: "I", name: "Doce", image: "https://example.com/images/aguacate.png", type: "numero", numOfig: "Num"},
    { id: "G", name: "Trapecio", image: "https://example.com/images/pina.png", type: "figura", numOfig: "Fig", menoscinco: "menos" },
    { id: "E", name: "Quince", image: "https://example.com/images/pepino.png", type: "numero", numOfig: "Num"},
    { id: "A", name: "Ovalo", image: "https://example.com/images/manzana.png", type: "figura", numOfig: "Fig", menoscinco: "menos" },
  ],
  
  // Alimentos para el nivel 2 (tipos de alimentos)
  level2Foods: [
    { id: "A", name: "Dos tercios", image: "https://example.com/images/hamburguesa.png", type: "fraccionario" },
    { id: "B", name: "Círculo", image: "https://example.com/images/manzana.png", type: "figura" },
    { id: "C", name: "Tres cuartos", image: "https://example.com/images/hotdog.png", type: "fraccionario" },
    { id: "D", name: "Seis octavos", image: "https://example.com/images/papas.png", type: "fraccionario" },
    { id: "E", name: "Dos sextos", image: "https://example.com/images/donut.png", type: "fraccionario" },
    { id: "F", name: "Dieciseis", image: "https://example.com/images/brocoli.png", type: "numero" },
    { id: "G", name: "Pentagono", image: "https://example.com/images/platano.png", type: "figura" },
    { id: "H", name: "Veinte", image: "https://example.com/images/zanahoria.png", type: "numero" },
    { id: "I", name: "Ovalo", image: "https://example.com/images/naranja.png", type: "figura" },
    { id: "J", name: "Romboide", image: "https://example.com/images/fresa.png", type: "figura" }, 
    { id: "K", name: "Rombo", image: "https://example.com/images/sandia.png", type: "figura" }, 
    { id: "L", name: "Trece", image: "https://example.com/images/pepino.png", type: "numero" }, 
    { id: "M", name: "Once", image: "https://example.com/images/lechuga.png", type: "numero" }, 
    { id: "N", name: "Siete novenos", image: "https://example.com/images/pizza.png", type: "fraccionario" }, 
    { id: "O", name: "Cuatro octavos", image: "https://example.com/images/refresco.png", type: "fraccionario" },
    { id: "P", name: "Tres quintos", image: "https://example.com/images/aceites.png", type: "fraccionario" }, 
    { id: "Q", name: "Trapecio", image: "https://example.com/images/aguacate.png", type: "figura" }, 
    { id: "R", name: "Estrella", image: "https://example.com/images/pina.png", type: "figura" }, 
    { id: "S", name: "Dieciocho", image: "https://example.com/images/champinones.png", type: "numero" }, 
    { id: "T", name: "Cuatro sextos", image: "https://example.com/images/helado.png", type: "fraccionario" },
  ],
  
  // Alimentos para el nivel 3 (propiedades nutricionales)
  level3Foods: [
    { id: "A", name: "Yogurt", image: "https://example.com/images/yogurt.png", type: "lacteo", propiedades: ["calcio", "proteina"] },
    { id: "B", name: "Pollo", image: "https://example.com/images/pollo.png", type: "carne", propiedades: ["proteina"] },
    { id: "C", name: "Pescado", image: "https://example.com/images/pescado.png", type: "carne", propiedades: ["proteina", "omega3"] },
    { id: "D", name: "Nueces", image: "https://example.com/images/nueces.png", type: "semilla", propiedades: ["omega3", "fibra"] },
    { id: "E", name: "Leche", image: "https://example.com/images/leche.png", type: "lacteo", propiedades: ["calcio", "proteina"] },
    { id: "F", name: "Queso", image: "https://example.com/images/queso.png", type: "lacteo", propiedades: ["calcio", "proteina"] },
    { id: "G", name: "Avena", image: "https://example.com/images/avena.png", type: "cereal", propiedades: ["fibra"] },
    { id: "H", name: "Huevo", image: "https://example.com/images/huevo.png", type: "proteina", propiedades: ["proteina"] },
    { id: "I", name: "Espinaca", image: "https://example.com/images/espinaca.png", type: "numero", propiedades: ["hierro", "vitaminas"] },
    { id: "J", name: "Atún", image: "https://example.com/images/atun.png", type: "carne", propiedades: ["proteina", "omega3"] },
    { id: "K", name: "Lentejas", image: "https://example.com/images/lentejas.png", type: "legumbre", propiedades: ["proteina", "hierro", "fibra"] },
    { id: "L", name: "Almendras", image: "https://example.com/images/almendras.png", type: "semilla", propiedades: ["fibra", "vitaminas"] },
    { id: "M", name: "Kiwi", image: "https://example.com/images/kiwi.png", type: "figura", propiedades: ["vitaminas", "fibra"] },
    { id: "N", name: "Arándanos", image: "https://example.com/images/arandanos.png", type: "figura", propiedades: ["antioxidantes"] },
    { id: "O", name: "Chocolate negro", image: "https://example.com/images/chocolate.png", type: "otro", propiedades: ["antioxidantes"] },
    { id: "P", name: "Frijoles", image: "https://example.com/images/frijoles.png", type: "legumbre", propiedades: ["proteina", "fibra"] },
  ],
  
  // Alimentos para el nivel 4 (temporada/origen)
  level4Foods: [
    { id: "A", name: "Sandía", image: "https://example.com/images/sandia.png", temporada: "verano", origen: "america" },
    { id: "B", name: "Calabaza", image: "https://example.com/images/calabaza.png", temporada: "otoño", origen: "america" },
    { id: "C", name: "Naranja", image: "https://example.com/images/naranja.png", temporada: "invierno", origen: "asia" },
    { id: "D", name: "Fresa", image: "https://example.com/images/fresa.png", temporada: "primavera", origen: "europa" },
    { id: "E", name: "Mango", image: "https://example.com/images/mango.png", temporada: "verano", origen: "asia" },
    { id: "F", name: "Granada", image: "https://example.com/images/granada.png", temporada: "otoño", origen: "asia" },
    { id: "G", name: "Tomate", image: "https://example.com/images/tomate.png", temporada: "verano", origen: "america" },
    { id: "H", name: "Espárragos", image: "https://example.com/images/esparragos.png", temporada: "primavera", origen: "europa" },
    { id: "I", name: "Litchi", image: "https://example.com/images/litchi.png", temporada: "verano", origen: "asia" },
    { id: "J", name: "Uvas", image: "https://example.com/images/uvas.png", temporada: "otoño", origen: "europa" },
    { id: "K", name: "Mandarinas", image: "https://example.com/images/mandarinas.png", temporada: "invierno", origen: "asia" },
    { id: "L", name: "Cerezas", image: "https://example.com/images/cerezas.png", temporada: "primavera", origen: "asia" },
    { id: "M", name: "Aguacate", image: "https://example.com/images/aguacate.png", temporada: "todo_el_año", origen: "america" },
    { id: "N", name: "Kiwi", image: "https://example.com/images/kiwi.png", temporada: "invierno", origen: "oceania" },
    { id: "O", name: "Papaya", image: "https://example.com/images/papaya.png", temporada: "todo_el_año", origen: "america" },
    { id: "P", name: "Pera", image: "https://example.com/images/pera.png", temporada: "otoño", origen: "asia" },
  ],
};

export const levels = [
  {
    id: 1,
    title: "Fácil",
    description: "Identificar alimentos por numOfiges",
    foodsKey: "level1Foods",
    rounds: [
      { id: 1, title: "Encuentra los números", type: ["figura", "numero"], filter: (food) => food.numOfig === "Num" },
      { id: 2, title: "Selecciona solo figuras", type: ["figura", "numero"], filter: (food) => food.numOfig === "Fig" },
      { id: 3, title: "Encuentra los números menores a 10", type: ["figura", "numero"], filter: (food) => food.menordiez === "menor" },
      { id: 4, title: "Selecciona las figuras con menos de 5 lados", type: ["figura", "numero"], filter: (food) => food.menoscinco === "menos" },
    ],
    itemsPerRound: 12,
    nextLevel: 2,
    nextLevelName: "Intermedio"
  },
  {
    id: 2,
    title: "Intermedio",
    description: "Identificar grupos de números y figuras",
    foodsKey: "level2Foods",
    rounds: [
      { id: 1, title: "Encuentra las figuras", type: "figura" },
      { id: 2, title: "Encuentra las números enteros", type: "numero" },
      { id: 3, title: "Encuentra los números fraccionarios", type: "fraccionario" },
      { id: 4, title: "Encuentra todos los tipos de números", type: ["fraccionario", "numero"] },
    ],
    itemsPerRound: 15,
    nextLevel: 3,
    nextLevelName: "Difícil"
  },
  {
    id: 3,
    title: "Difícil",
    description: "Identificar propiedades nutricionales",
    foodsKey: "level3Foods",
    rounds: [
      { id: 1, title: "Encuentra alimentos ricos en proteínas", type: ["carne", "lacteo", "legumbre", "proteina"], filter: (food) => food.propiedades && food.propiedades.includes("proteina") },
      { id: 2, title: "Encuentra alimentos ricos en calcio", type: ["lacteo"], filter: (food) => food.propiedades && food.propiedades.includes("calcio") },
      { id: 3, title: "Encuentra alimentos ricos en omega-3", type: ["carne", "semilla"], filter: (food) => food.propiedades && food.propiedades.includes("omega3") },
      { id: 4, title: "Encuentra alimentos ricos en fibra", type: ["cereal", "figura", "numero", "semilla", "legumbre"], filter: (food) => food.propiedades && food.propiedades.includes("fibra") },
    ],
    itemsPerRound: 12,
    nextLevel: 4,
    nextLevelName: "Experto"
  },
  {
    id: 4,
    title: "Experto",
    description: "Identificar alimentos por temporada y origen",
    foodsKey: "level4Foods",
    rounds: [
      { id: 1, title: "Encuentra alimentos de verano", filter: (food) => food.temporada === "verano" },
      { id: 2, title: "Encuentra alimentos de origen asiático", filter: (food) => food.origen === "asia" },
      { id: 3, title: "Encuentra alimentos de primavera", filter: (food) => food.temporada === "primavera" },
      { id: 4, title: "Encuentra alimentos de origen americano", filter: (food) => food.origen === "america" },
    ],
    itemsPerRound: 12,
    nextLevel: null,
    nextLevelName: null
  }
];