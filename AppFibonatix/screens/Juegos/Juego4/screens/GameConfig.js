// GameConfig.js
export const LEVELS_CONFIG = [
    {
      id: 1,
      title: "TORTUGA MATEMÁTICA",
      level: "NVL. 1",
      categories: [
        'Números',
        'Figuras',
        'Fracciones'
      ],
      initialCategories: {
        'Números': [],
        'Figuras': [],
        'Fracciones': []
      },
      cardsToShow: 3,
      foodItems: [
        { name: 'Pera', category: 'Frutas y Verduras', image: 'https://imgur.com/qGp7Vs7' },
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
        'Números pares',
        'Números impares',
        'Fracciones',
        'Figuras'
      ],
      initialCategories: {
        'Números pares': [],
        'Números impares': [],
        'Fracciones': [],
        'Figuras': []
      },
      cardsToShow: 4,
      foodItems: [
        { name: 'Ocho', category: 'Números pares', image: 'https://imgur.com/U0ybXLC.png' },
        { name: 'Diez', category: 'Números pares', image: 'https://imgur.com/qVkuSgt.png' },
        { name: 'Tres Quintos', category: 'Fracciones', image: 'https://imgur.com/Mx5aEjb.png' },
        { name: 'Siete Novenos', category: 'Fracciones', image: 'https://imgur.com/nutVvXp.png' },
        { name: 'Quince', category: 'Números impares', image: 'https://imgur.com/swqgtYa.png' },
        { name: 'Seis Cuartos', category: 'Fracciones', image: 'https://imgur.com/dgzCwNo.png' },
        { name: 'Diecisiete', category: 'Números impares', image: 'https://imgur.com/skk6uQT.png' },
        { name: 'Once', category: 'Números impares', image: 'https://imgur.com/QhNzPgg.png' },
        { name: 'Hexágono', category: 'Figuras', image: 'https://imgur.com/0dWzEty.png' },
        { name: 'Veintiuno', category: 'Números impares', image: 'https://imgur.com/WF5RkbP.png' },
        { name: 'Octágono', category: 'Figuras', image: 'https://imgur.com/sw6a7n0.png' },
        { name: 'Trapecio', category: 'Figuras', image: 'https://imgur.com/a0m8j3S.jpg' },
        { name: 'Pentagono', category: 'Figuras', image: 'https://imgur.com/Sg3i1Qa.png' },
        { name: 'Dieciocho', category: 'Números pares', image: 'https://imgur.com/c9i5JpR.png' },
        { name: 'Veintidos', category: 'Números pares', image: 'https://imgur.com/ny5ELvD.png' },
        { name: 'Cinco Séptimos', category: 'Fracciones', image: 'https://imgur.com/cxcL3Yl.png' },
        { name: 'Veinticinco', category: 'Números impares', image: 'https://imgur.com/jnlFsNk.png' },
        { name: 'Diez Quintos', category: 'Fracciones', image: 'https://imgur.com/jmBPDEb.png' }
      ]
    },
    {
      id: 3,
      title: "TORTUGA ALIMENTICIA",
      level: "NVL. 3",
      categories: [
        'Números pares',
        'Números impares',
        'Figuras',
        'Fracciones propias',
        'Fracciones impropias'
      ],
      initialCategories: {
        'Números pares': [],
        'Números impares': [],
        'Figuras': [],
        'Fracciones propias': [],
        'Fracciones impropias': []
      },
      cardsToShow: 5,
      foodItems: [
        { name: 'Treinta', category: 'Números pares', image: 'https://imgur.com/HXj6JYq.png' },
        { name: 'Cuarenta y dos', category: 'Números pares', image: 'https://imgur.com/fiQw2wI.png' },
        { name: 'Ochenta', category: 'Números pares', image: 'https://imgur.com/9S8zK8I.png' },
        { name: 'Treinta y uno', category: 'Números impares', image: 'https://imgur.com/zpMLNea.png' },
        { name: 'Cincuenta y siete', category: 'Números impares', image: 'https://imgur.com/aE6FphM.png' },
        { name: 'Setenta y cinco', category: 'Números impares', image: 'https://imgur.com/4ib25oM.png' },
        { name: 'Nueve', category: 'Números impares', image: 'https://imgur.com/MZFtFzQ.png' },
        { name: 'Cuatro novenos', category: 'Fracciones propias', image: 'https://imgur.com/PKZi2tz.png' },
        { name: 'Diez onceavos', category: 'Fracciones propias', image: 'https://imgur.com/ZyQgmVV.png' },
        { name: 'Catorce Veinticuatroavos', category: 'Fracciones propias', image: 'https://imgur.com/1vPUYcv.png' },
        { name: 'Rombo', category: 'Figuras', image: 'https://imgur.com/UScyazq.png' },
        { name: 'Estrella', category: 'Figuras', image: 'https://imgur.com/1y2LZHd.png' },
        { name: 'Decágono', category: 'Figuras', image: 'https://imgur.com/i00EWbp.png' },
        { name: 'Corazón', category: 'Figuras', image: 'https://imgur.com/Dk4d7e9.png' },
        { name: 'Quince onceavos', category: 'Fracciones impropias', image: 'https://imgur.com/dn490nc.png' },
        { name: 'Veinte medios', category: 'Fracciones impropias', image: 'https://imgur.com/22LrB4G.png' },
        { name: 'Cincuenta y seis quintos', category: 'Fracciones impropias', image: 'https://imgur.com/LQNYU4y.png' },
        { name: 'Cuarenta y cuatro treinta y ochoavos', category: 'Fracciones impropias', image: 'https://imgur.com/MBx5k5N.png' },
        { name: 'Veintiún décimos', category: 'Fracciones impropias', image: 'https://imgur.com/Qbtezv1.png' },
        { name: 'Setenta diecinueveavos', category: 'Fracciones impropias', image: 'https://imgur.com/JQy1QEd.png' }
      ]
    }
  ];