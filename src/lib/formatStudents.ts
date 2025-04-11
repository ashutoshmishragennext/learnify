const formatStudents = (num:number) => {
    const roundedNum = Math.round(num / 100) * 100;
    if (roundedNum >= 1_000_000) {
      return (roundedNum / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (roundedNum >= 1_000) {
      return (roundedNum / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return roundedNum;
  };

  export default formatStudents;