import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from "react-chartjs-2";
import { calculateCGPA } from '../utils';



function Graph({ semesters }) {
    // 1. Get the labels
    // Takes in the current semester state, and does the rest from there

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );

    const gpa_per_semester = semesters.map((semester) => calculateCGPA([semester]).CGPA);

    let cgpa_at_semester = [];
    
    for(let i=0; i < semesters.length; i++) {
        let cgpa = calculateCGPA(semesters.slice(0, i+1)).CGPA;
        cgpa_at_semester.push(cgpa)
    }

    const isMobile = window.innerWidth < 768;
    
    const options = {
        responsive: true,
        maintainAspectRatio: !isMobile,
        plugins: {
          legend: {
            position: isMobile ? 'bottom' : 'top',
            labels: {
              boxWidth: isMobile ? 12 : 15,
              padding: isMobile ? 10 : 15,
              font: {
                size: isMobile ? 11 : 12
              }
            }
          },
          title: {
            display: true,
            text: isMobile ? 'GPA & CGPA Trend' : 'CGPA and GPA at each semester chart',
            font: {
              size: isMobile ? 14 : 16
            },
            padding: {
              bottom: isMobile ? 10 : 20
            }
          },
        },
        scales: {
            y: {
                max: 5,
                min: 0,
                ticks: {
                    stepSize: 1,
                    suggestedMin: 0,
                    suggestedMax: 5,
                    font: {
                      size: isMobile ? 10 : 12
                    }
                },
            },
            x: {
                ticks: {
                  font: {
                    size: isMobile ? 10 : 12
                  },
                  maxRotation: 45,
                  minRotation: 0
                }
            }
        },
      };
    // For cgpa per semester, start from first semester, caluclate cgpa, then include the second semester in the data
    const data = {
        labels: semesters.map((semester, index) => `Semester ${index+1}`),
        datasets: [
            {
                label: 'GPA per semester',
                data: gpa_per_semester,
                borderColor: 'rgb(255, 99, 132)',
                
            },
            {
                label: 'CGPA at every semester',
                data: cgpa_at_semester,
                borderColor: 'rgb(53, 162, 235)',
            }
        ]
    }
    return (
        <div className='w-full h-[250px] sm:h-[300px] md:h-auto'>
            <Line data={data} options={options}/>
        </div>
    )
}

export default Graph