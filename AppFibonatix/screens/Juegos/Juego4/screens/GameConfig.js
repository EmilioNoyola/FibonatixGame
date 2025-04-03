// GameConfig.js
export const LEVELS_CONFIG = [
    {
      id: 1,
      title: "TORTUGA ALIMENTICIA",
      level: "NVL. 1",
      categories: [
        'Frutas y Verduras',
        'Origen Animal',
        'Cereales, Granos y Tubérculos'
      ],
      initialCategories: {
        'Frutas y Verduras': [],
        'Origen Animal': [],
        'Cereales, Granos y Tubérculos': []
      },
      cardsToShow: 3,
      foodItems: [
        { name: 'Pera', category: 'Frutas y Verduras', image: 'https://i.imgur.com/mNXPZ8B.png' },
        { name: 'Naranja', category: 'Frutas y Verduras', image: 'https://i.imgur.com/mNXPZ8B.png' },
        { name: 'Papa', category: 'Cereales, Granos y Tubérculos', image: 'https://i.imgur.com/mNXPZ8B.png' },
        { name: 'Pescado', category: 'Origen Animal', image: 'https://cdn.pixabay.com/photo/2016/04/01/09/29/cartoon-1299636_1280.png' },
        { name: 'Harina', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/52/flour-157022_1280.png' },
        { name: 'Manzana', category: 'Frutas y Verduras', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/34/apple-158419_1280.png' },
        { name: 'Pasta', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2013/07/13/09/36/noodles-156217_1280.png' },
        { name: 'Carne', category: 'Origen Animal', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/32/beef-158243_1280.png' },
        { name: 'Zanahoria', category: 'Frutas y Verduras', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/49/carrot-158380_1280.png' },
        { name: 'Huevo', category: 'Origen Animal', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/22/egg-156079_1280.png' },
        { name: 'Brócoli', category: 'Frutas y Verduras', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/24/broccoli-575500_1280.png' },
        { name: 'Pollo', category: 'Origen Animal', image: 'https://cdn.pixabay.com/photo/2014/04/02/10/55/chicken-304998_1280.png' },
        { name: 'Avena', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/24/oatmeal-575508_1280.png' },
        { name: 'Espinaca', category: 'Frutas y Verduras', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/29/spinach-575540_1280.png' },
        { name: 'Lentejas', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/52/lentils-157011_1280.png' }
      ]
    },
    {
      id: 2,
      title: "TORTUGA ALIMENTICIA",
      level: "NVL. 2",
      categories: [
        'Frutas y Verduras',
        'Proteínas',
        'Cereales, Granos y Tubérculos',
        'Aceites y Grasas Saludables'
      ],
      initialCategories: {
        'Frutas y Verduras': [],
        'Proteínas': [],
        'Cereales, Granos y Tubérculos': [],
        'Aceites y Grasas Saludables': []
      },
      cardsToShow: 4,
      foodItems: [
        { name: 'Fresa', category: 'Frutas y Verduras', image: 'https://cdn.pixabay.com/photo/2016/02/23/17/29/strawberry-1218158_1280.png' },
        { name: 'Plátano', category: 'Frutas y Verduras', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/44/banana-158350_1280.png' },
        { name: 'Arroz', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/32/rice-575814_1280.png' },
        { name: 'Frijoles', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/34/beans-575831_1280.png' },
        { name: 'Pavo', category: 'Proteínas', image: 'https://cdn.pixabay.com/photo/2017/01/31/23/10/animal-2028134_1280.png' },
        { name: 'Lentejas', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/52/lentils-157011_1280.png' },
        { name: 'Queso', category: 'Proteínas', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/13/cheese-156973_1280.png' },
        { name: 'Leche', category: 'Proteínas', image: 'https://cdn.pixabay.com/photo/2020/02/20/17/57/milk-4865690_1280.png' },
        { name: 'Aceite de Oliva', category: 'Aceites y Grasas Saludables', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/53/olive-oil-576528_1280.png' },
        { name: 'Almendras', category: 'Aceites y Grasas Saludables', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/51/almond-157004_1280.png' },
        { name: 'Aguacate', category: 'Aceites y Grasas Saludables', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/27/avocado-575769_1280.png' },
        { name: 'Chía', category: 'Aceites y Grasas Saludables', image: 'https://cdn.pixabay.com/photo/2015/02/13/11/19/chia-seed-636034_1280.jpg' },
        { name: 'Nueces', category: 'Aceites y Grasas Saludables', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/27/walnut-156686_1280.png' },
        { name: 'Lechuga', category: 'Frutas y Verduras', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/51/salad-157004_1280.png' },
        { name: 'Champiñones', category: 'Frutas y Verduras', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/22/mushroom-156087_1280.png' },
        { name: 'Chícharos', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/24/peas-575815_1280.png' },
        { name: 'Habas', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/35/beans-575839_1280.png' },
        { name: 'Garbanzos', category: 'Cereales, Granos y Tubérculos', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/34/chickpeas-575837_1280.png' }
      ]
    },
    {
      id: 3,
      title: "TORTUGA ALIMENTICIA",
      level: "NVL. 3",
      categories: [
        'Frutas',
        'Verduras',
        'Legumbres',
        'Lácteos',
        'Carnes'
      ],
      initialCategories: {
        'Frutas': [],
        'Verduras': [],
        'Legumbres': [],
        'Lácteos': [],
        'Carnes': []
      },
      cardsToShow: 5,
      foodItems: [
        { name: 'Sandía', category: 'Frutas', image: 'https://cdn.pixabay.com/photo/2012/04/26/18/41/watermelon-42393_1280.png' },
        { name: 'Kiwi', category: 'Frutas', image: 'https://cdn.pixabay.com/photo/2012/04/26/18/41/kiwi-42401_1280.png' },
        { name: 'Piña', category: 'Frutas', image: 'https://cdn.pixabay.com/photo/2012/04/26/18/41/pineapple-42383_1280.png' },
        { name: 'Tomate', category: 'Verduras', image: 'https://cdn.pixabay.com/photo/2012/04/26/18/41/tomato-42383_1280.png' },
        { name: 'Pepino', category: 'Verduras', image: 'https://cdn.pixabay.com/photo/2012/04/26/18/41/cucumber-42396_1280.png' },
        { name: 'Pimiento', category: 'Verduras', image: 'https://cdn.pixabay.com/photo/2012/04/26/18/41/pepper-42348_1280.png' },
        { name: 'Calabaza', category: 'Verduras', image: 'https://cdn.pixabay.com/photo/2012/04/26/18/41/pumpkin-42348_1280.png' },
        { name: 'Yogurt', category: 'Lácteos', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/13/yogurt-156133_1280.png' },
        { name: 'Mantequilla', category: 'Lácteos', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/13/butter-156973_1280.png' },
        { name: 'Crema', category: 'Lácteos', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/30/cream-575730_1280.png' },
        { name: 'Frijoles Negros', category: 'Legumbres', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/35/black-beans-575840_1280.png' },
        { name: 'Ejotes', category: 'Legumbres', image: 'https://cdn.pixabay.com/photo/2014/12/21/23/34/green-beans-575832_1280.png' },
        { name: 'Soya', category: 'Legumbres', image: 'https://cdn.pixabay.com/photo/2013/07/13/10/51/soy-157014_1280.png' },
        { name: 'Res', category: 'Carnes', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/32/beef-158243_1280.png' },
        { name: 'Cerdo', category: 'Carnes', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/32/meat-158238_1280.png' },
        { name: 'Cordero', category: 'Carnes', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/33/meat-157230_1280.png' },
        { name: 'Ternera', category: 'Carnes', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/32/veal-158244_1280.png' },
        { name: 'Jamón', category: 'Carnes', image: 'https://cdn.pixabay.com/photo/2013/07/13/11/33/ham-158257_1280.png' },
        { name: 'Pato', category: 'Carnes', image: 'https://cdn.pixabay.com/photo/2014/04/02/10/56/duck-305022_1280.png' },
        { name: 'Conejo', category: 'Carnes', image: 'https://cdn.pixabay.com/photo/2014/04/02/10/54/rabbit-304822_1280.png' }
      ]
    }
  ];