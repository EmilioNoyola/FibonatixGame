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
        { name: 'Dos', category: 'Números', image: 'https://imgur.com/8EjrzWf.png' },
        { name: 'Tres', category: 'Números', image: 'https://imgur.com/VdYkz6D.png' },
        { name: 'Tres Cuartos', category: 'Fracciones', image: 'https://imgur.com/XAqJuCc.png' },
        { name: 'Cuadrado', category: 'Figuras', image: 'https://imgur.com/r4oz2jA.png' },
        { name: 'Un Medio', category: 'Fracciones', image: 'https://imgur.com/6DYbwm0.png' },
        { name: 'Cuatro', category: 'Números', image: 'https://imgur.com/MMzJLgf.png' },
        { name: 'Tres Sextos', category: 'Fracciones', image: 'https://imgur.com/Z8Mvt1s.png' },
        { name: 'Circulo', category: 'Figuras', image: 'https://imgur.com/qzLgNau.png' },
        { name: 'Cinco', category: 'Números', image: 'https://imgur.com/JoNscjz.png' },
        { name: 'Réctangulo', category: 'Figuras', image: 'https://imgur.com/RhH4vFC.png' },
        { name: 'Seis', category: 'Números', image: 'https://imgur.com/RNX3Et6.png' },
        { name: 'Triángulo', category: 'Figuras', image: 'https://imgur.com/v8tD4BT.png' },
        { name: 'Dos Tercios', category: 'Fracciones', image: 'https://imgur.com/kg5vdj6.png' },
        { name: 'Siete', category: 'Números', image: 'https://imgur.com/gO1USwO.png' },
        { name: 'Dos Octavos', category: 'Fracciones', image: 'https://imgur.com/sqMxYtc.png' }
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