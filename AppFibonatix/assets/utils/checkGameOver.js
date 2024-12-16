export const checkGameOver = (head, bounds) => {
    return (
      head.x < bounds.xMin ||
      head.x > bounds.xMax ||
      head.y < bounds.yMin ||
      head.y > bounds.yMax 
    );
  };           
