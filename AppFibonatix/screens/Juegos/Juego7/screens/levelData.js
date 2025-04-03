// Las URLs de imágenes son ejemplos, deberás reemplazarlas con URLs reales
export const foods = {
    // Alimentos para el nivel 1 (colores)
    level1Foods: [
      { id: "B", name: "Brócoli", image: "https://example.com/images/brocoli.png", type: "verdura", color: "verde", saludable: true },
      { id: "C", name: "Zanahoria", image: "https://example.com/images/zanahoria.png", type: "verdura", color: "naranja", cruda: true, saludable: true },
      { id: "D", name: "Fresas", image: "https://example.com/images/fresa.png", type: "fruta", color: "rojo", saludable: true},
      { id: "F", name: "Lechuga", image: "https://example.com/images/lechuga.png", type: "verdura", color: "verde", cruda: true, saludable: true, altoContenidoAgua: true },
      { id: "J", name: "Melón", image: "https://example.com/images/melon.png", type: "fruta", altoContenidoAgua: true, color: "naranja" }, 
      { id: "K", name: "Sandía", image: "https://example.com/images/sandia.png", type: "fruta", color: "rojo", altoContenidoAgua: true }, 
      { id: "L", name: "Jitomate", image: "https://example.com/images/jitomate.png", type: "verdura", color: "rojo", altoContenidoAgua: true, cruda: true}, 
      { id: "M", name: "Tomate", image: "https://example.com/images/tomate.png", type: "verdura", color: "verde" }, 
      { id: "N", name: "Mango", image: "https://example.com/images/mango.png", type: "fruta", color: "amarillo" }, 
      { id: "O", name: "Plátano", image: "https://example.com/images/platano.png", type: "fruta", color: "amarillo" },
      { id: "P", name: "Guayaba", image: "https://example.com/images/guayaba.png", type: "fruta", color: "amarillo" },
      { id: "Q", name: "Naranja", image: "https://example.com/images/naranja.png", type: "fruta", color: "naranja" },
      { id: "I", name: "Aguacate", image: "https://example.com/images/aguacate.png", type: "verdura", color: "verde", saludable: true },
      { id: "G", name: "Piña", image: "https://example.com/images/pina.png", type: "fruta", color: "amarillo", saludable: true, altoContenidoAgua: true },
      { id: "E", name: "Pepino", image: "https://example.com/images/pepino.png", type: "verdura", color: "verde", cruda: true, saludable: true, altoContenidoAgua: true},
      { id: "A", name: "Manzana", image: "https://example.com/images/manzana.png", type: "fruta", color: "rojo", saludable: true, altoContenidoAgua: true },
    ],
    
    // Alimentos para el nivel 2 (tipos de alimentos)
    level2Foods: [
      { id: "A", name: "Hamburguesa", image: "https://example.com/images/hamburguesa.png", type: "noSaludable" },
      { id: "B", name: "Manzana", image: "https://example.com/images/manzana.png", type: "fruta" },
      { id: "C", name: "Hot Dog", image: "https://example.com/images/hotdog.png", type: "noSaludable" },
      { id: "D", name: "Papas fritas", image: "https://example.com/images/papas.png", type: "noSaludable" },
      { id: "E", name: "Donas", image: "https://example.com/images/donut.png", type: "noSaludable" },
      { id: "F", name: "Brócoli", image: "https://example.com/images/brocoli.png", type: "verdura" },
      { id: "G", name: "Plátano", image: "https://example.com/images/platano.png", type: "fruta" },
      { id: "H", name: "Zanahoria", image: "https://example.com/images/zanahoria.png", type: "verdura" },
      { id: "I", name: "Naranja", image: "https://example.com/images/naranja.png", type: "fruta" },
      { id: "J", name: "Fresas", image: "https://example.com/images/fresa.png", type: "fruta" }, 
      { id: "K", name: "Sandía", image: "https://example.com/images/sandia.png", type: "fruta" }, 
      { id: "L", name: "Pepino", image: "https://example.com/images/pepino.png", type: "verdura" }, 
      { id: "M", name: "Lechuga", image: "https://example.com/images/lechuga.png", type: "verdura" }, 
      { id: "N", name: "Pizza", image: "https://example.com/images/pizza.png", type: "noSaludable" }, 
      { id: "O", name: "Refresco", image: "https://example.com/images/refresco.png", type: "noSaludable" },
      { id: "P", name: "Aceites", image: "https://example.com/images/aceites.png", type: "noSaludable" }, 
      { id: "Q", name: "Aguacate", image: "https://example.com/images/aguacate.png", type: "fruta" }, 
      { id: "R", name: "Piña", image: "https://example.com/images/pina.png", type: "fruta" }, 
      { id: "S", name: "Champiñones", image: "https://example.com/images/champinones.png", type: "verdura" }, 
      { id: "T", name: "Helado", image: "https://example.com/images/helado.png", type: "noSaludable" },
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
      { id: "I", name: "Espinaca", image: "https://example.com/images/espinaca.png", type: "verdura", propiedades: ["hierro", "vitaminas"] },
      { id: "J", name: "Atún", image: "https://example.com/images/atun.png", type: "carne", propiedades: ["proteina", "omega3"] },
      { id: "K", name: "Lentejas", image: "https://example.com/images/lentejas.png", type: "legumbre", propiedades: ["proteina", "hierro", "fibra"] },
      { id: "L", name: "Almendras", image: "https://example.com/images/almendras.png", type: "semilla", propiedades: ["fibra", "vitaminas"] },
      { id: "M", name: "Kiwi", image: "https://example.com/images/kiwi.png", type: "fruta", propiedades: ["vitaminas", "fibra"] },
      { id: "N", name: "Arándanos", image: "https://example.com/images/arandanos.png", type: "fruta", propiedades: ["antioxidantes"] },
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
      description: "Identificar alimentos por colores",
      foodsKey: "level1Foods",
      rounds: [
        { id: 1, title: "Encuentra alimentos de color rojo", type: ["fruta", "verdura"], filter: (food) => food.color === "rojo" },
        { id: 2, title: "Selecciona solo alimentos amarillos", type: ["fruta", "verdura"], filter: (food) => food.color === "amarillo" },
        { id: 3, title: "Encuentra los alimentos que sean verdes", type: ["fruta", "verdura"], filter: (food) => food.color === "verde" },
        { id: 4, title: "Selecciona los alimentos naranjas", type: ["fruta", "verdura"], filter: (food) => food.color === "naranja" },
      ],
      itemsPerRound: 12,
      nextLevel: 2,
      nextLevelName: "Intermedio"
    },
    {
      id: 2,
      title: "Intermedio",
      description: "Identificar grupos de alimentos",
      foodsKey: "level2Foods",
      rounds: [
        { id: 1, title: "Encuentra las frutas", type: "fruta" },
        { id: 2, title: "Encuentra las verduras", type: "verdura" },
        { id: 3, title: "Encuentra los alimentos saludables", type: ["fruta", "verdura"] },
        { id: 4, title: "Encuentra los alimentos no saludables", type: "noSaludable" },
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
        { id: 4, title: "Encuentra alimentos ricos en fibra", type: ["cereal", "fruta", "verdura", "semilla", "legumbre"], filter: (food) => food.propiedades && food.propiedades.includes("fibra") },
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