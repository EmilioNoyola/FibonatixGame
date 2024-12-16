export const checkEatsAnimal = (head, animal, threshold) => {
  return (
    Math.abs(head.x - animal.x) < threshold &&
    Math.abs(head.y - animal.y) < threshold
  );
};
         
  
  