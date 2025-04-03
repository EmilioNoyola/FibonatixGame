// Configuraciones de todos los niveles
const levelConfigs = [
  // Nivel 1
  {
    gridSize: 9,
    gridOperations: [
      ["17-10", "7/1", "25-18", "11-4", "13-7", "5+2", "13-6", "7+3", "20/2"],
      ["21-14", "21/3", "9-2", "4+2", "66/6", "12/2", "14/2", "5*2", "11-1"],
      ["7+0", "4+3", "3*2", "22/2", "39-28", "11+0", "8-2", "7*1", "1+6"],
      ["30-23", "9-3", "11/1", "55/5", "15-4", "36-25", "7+4", "5+1", "15-8"],
      ["11-5", "30-19", "8+3", "5+4", "18-7", "18/2", "44/4", "10+1", "6*1"],
      ["20-9", "19-8", "12-1", "15-4", "31-20", "11-0", "17-6", "21-10", "35-24"],
      ["6+5", "4+7", "33/3", "10-2", "16/2", "8+0", "24-13", "3+8", "5+6"],
      ["11/1", "22-11", "9+2", "6+2", "7+1", "2*4", "0+11", "28-17", "13-2"],
      ["6*2", "3+9", "5+7", "3*4", "8+4", "15-3", "20-8", "12+0", "12*1"],
    ],
    colorMapping: {
      10: '#FFE936',
      9: '#A5EFFF',
      12: '#5EFF40',
      8: '#9D742C',
      6: '#FF423E',
      7: '#57EBFF',
      11: '#FFEEAE',
    }
  },
  
  // Nivel 2
  {
    gridSize: 12,
    gridOperations: [
      ["13-8", "15-10", "18/6", "3*1", "27/9", "35/7", "1+4", "33-28", "2+3", "-30+35", "5*1", "37-34"],
      ["59-56", "15-12", "-36+39", "22-20", "32-29", "9/3", "38-33", "16-11", "14-9", "5*1", "18-13", "-54+57"],
      ["21/7", "62-59", "69/23", "11-8", "-10+13", "12-9", "25-20", "-8+13", "5+0", "40/8", "75/15", "-6+9"],
      ["-3+8", "54-50", "32/8", "24-21", "39/13", "15/5", "17-12", "21-16", "-6+11", "59-54", "33/11", "-4+7"],
      ["7-2", "-7+12", "25/5", "28/7", "-1+4", "-2+5", "13-10", "30/6", "13-8", "71-66", "9-6", "1*3"],
      ["-0+5", "45/9", "-35+40", "44/11", "36/12", "10-7", "24/8", "14-11", "3+2", "-74+77", "99/33", "60/15"],
      ["50/10", "48/12", "16-13", "-22+25", "-18+21", "30-27", "111-108", "3/1", "28-25", "31-28", "36/9", "-10+15"],
      ["75/15", "16/4", "-13+16", "42-38", "72-68", "12/4", "30/10", "-8+11", "-19+22", "20/5", "65-60", "-70+75"],
      ["-4+9", "12-7", "31-26", "63/21", "24/6", "67-63", "54/18", "71-68", "80/20", "-15+20", "-17+22", "10/2"],
      ["55/11", "5/1", "-1+6", "-15+18", "70-67", "72/18", "8-4", "-33+36", "63-60", "-63+68", "52-47", "-5+10"],
      ["43-38", "55-50", "19-14", "-13+18", "-48+51", "-12+17", "27-22", "-45+50", "38-35", "-99+104", "-65+70", "-2+7"],
      ["6-1", "1*5", "77-72", "83-80", "-30+33", "100-95", "15/3", "64-61", "35-32", "26-21", "0+5", "29-24"]
    ],
    colorMapping: {
      2: '#2A2A2A',
      3: '#db002e',
      4: '#ff982f',
      5: '#57EBFF',
    }
  },
  
  // Nivel 3
  {
    gridSize: 12,
    gridOperations: [
      ["13-4", "3*3", "18/3", "6-0", "27/3", "36-27", "5+4", "33-24", "6+3", "-30+39", "9*1", "-28+37"],
      ["59-50", "15-9", "-36+39", "22-16", "32-26", "-9+18", "38-29", "16-7", "2+7", "20-11", "18-9", "-55+64"],
      ["28/7", "62-58", "60/10", "11-5", "36/6", "12-3", "25-16", "-8+17", "9+0", "45/5", "8+1", "-6+15"],
      ["29-20", "54-45", "32-26", "24/4", "50-41", "90/10", "17-8", "21-12", "-2+11", "63/7", "33-24", "-30+39"],
      ["81/9", "27-18", "70-60", "95-85", "84-75", "66-57", "42-33", "72-63", "60-51", "54-45", "99-90", "72/8"],
      ["19-10", "14-5", "40-32", "40/5", "44-37", "10-3", "28/4", "24-17", "3+4", "-74+81", "56/7", "70/10"],
      ["-54+63", "48/6", "16-8", "-22+30", "21/3", "30-23", "111-104", "7/1", "28-20", "-18+26", "63/9", "-19+28"],
      ["75-66", "8*1", "-13+21", "42-34", "-64+72", "7+0", "35-28", "-8+16", "-19+27", "20-13", "67-58", "-80+89"],
      ["-7+16", "-3+12", "34-26", "72/9", "24/3", "67-59", "80/10", "71-63", "140/20", "-17+26", "-0+9", "36/4"],
      ["-55+64", "-18+27", "-1+10", "-15+23", "70-62", "4*2", "12-4", "-37+45", "63-54", "-63+72", "53-44", "9-0"],
      ["47-38", "65-56", "49-40", "-13+22", "-48+52", "-12+21", "45-36", "32/8", "54/6", "63-54", "-65+74", "-5+14"],
      ["-10+19", "100-91", "77-68", "79-75", "30-26", "79-70", "20/5", "65-61", "89-80", "26-17", "109-100", "39-30"]
    ],
    colorMapping: {
      3: '#2A2A2A',
      6: '#279926',
      4: '#ff982f',
      7: '#5f3f28',
      8: '#b26f2c',
      9: '#57EBFF',
      10: '#d13f45',
    }
  },
  
  // Nivel 4 (nuevo nivel - puedes personalizar las operaciones y colores)
  {
    gridSize: 10,
    gridOperations: [
      ["3*4", "100/25", "36/6", "14+8", "4*5", "19+3", "8+14", "48/8", "20+2", "24-2"],
      ["6*3", "25-7", "15+7", "18+4", "19+3", "11+11", "30-8", "10+12", "40-18", "63/3"],
      ["128/8", "12*2", "33-11", "13+9", "44/2", "24-0", "8*3", "36/6", "24-2", "33-11"],
      ["100/10", "36-16", "32-12", "9*2", "36/6", "45-23", "72/6", "24-4", "16+4", "33-13"],
      ["11+11", "12+10", "15+7", "19+3", "81/9", "13+9", "29-7", "33-11", "36/6", "16*1.5"],
      ["6*3", "24-2", "27-5", "36/6", "72/4", "28-6", "100/10", "13+9", "24-0", "12*2"],
      ["22+0", "60/3", "80/10", "42/2", "24-2", "6*3", "29-7", "27-5", "12*2", "48/4"],
      ["18+4", "44/2", "60/3", "20+2", "22+0", "12*2", "33-11", "28-6", "22*1", "60/3"],
      ["22-0", "15+7", "32/4", "36-14", "15+7", "18+4", "90/9", "20+2", "15+7", "36/6"],
      ["22+0", "24-2", "15+7", "18+4", "81/9", "30-8", "15+7", "30-8", "56/4", "27-5"],
    ],
    colorMapping: {
      22: '#ff5252',
      24: '#448aff',
      18: '#69f0ae',
      20: '#ffd740',
      6: '#ff4081',
      12: '#7c4dff',
    }
  },
  
  // Nivel 5 (nuevo nivel - puedes personalizar las operaciones y colores)
  {
    gridSize: 8,
    gridOperations: [
      ["9*9", "33*3", "125*1", "36*2", "27*3", "30*3", "45*2", "50*2"],
      ["41*2", "54*2", "11*8", "8*9", "75*1", "20*5", "25*4", "64*2"],
      ["99-18", "104-32", "120-40", "14*6", "13*6", "45*2", "91-10", "73+9"],
      ["125-40", "30*3", "100-15", "80+5", "104-19", "72+10", "64*2", "72+10"],
      ["35*2", "100-8", "12*8", "88+4", "112-20", "16*5", "36*2", "35*2"],
      ["114-32", "108-36", "11*8", "150-72", "125-40", "33*3", "90-10", "102-30"],
      ["36*2", "125/2", "15*5", "92-10", "20*4", "30*3", "82-10", "132-60"],
      ["72+10", "13*6", "16*5", "150-78", "50*2", "128-52", "14*6", "100-28"],
    ],
    colorMapping: {
      72: '#3f51b5',
      82: '#009688',
      85: '#ff9800',
      90: '#f44336',
      96: '#e91e63',
      80: '#4caf50',
      78: '#673ab7',
      81: '#ffeb3b',
    }
  }
];

export default levelConfigs;