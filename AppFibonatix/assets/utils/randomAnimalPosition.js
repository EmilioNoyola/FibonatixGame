export const randomAnimalPosition = (xMax, yMax) => {
  const margin = 4;
  const x = Math.floor(Math.random() * (xMax - margin * 2)) + margin;
  const y = Math.floor(Math.random() * (yMax - margin * 2)) + margin;

  return { x, y };
};



  