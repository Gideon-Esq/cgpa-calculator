const calculateCGPA = (semesters) => {
  let totalUnits = 0;
  let totalGrades = 0;

  semesters.forEach(semester => {
    semester.courses.forEach(course => {
      const unit = parseInt(course.unit);
      const grade = parseInt(course.grade);

      totalUnits += unit;
      totalGrades += (unit * grade);
    });
  });


  let CGPA = totalGrades / totalUnits;
  return {
    CGPA: isNaN(CGPA) ? 0 : parseFloat(CGPA.toFixed(2)),
    totalUnits: totalUnits
  };
};

export { calculateCGPA };