export function getAttendanceMessage(percentage) {
    const messages = {
        0: [
            "No students present in class today. It seems like there's no participation.",
            "Unfortunately, no students have attended the class. Let's work on increasing engagement!",
            "It appears that the class is empty today. Make sure to encourage attendance.",
            "Zero attendance today! Let's focus on better engagement in future sessions.",
            "Not a single student attended the class. We need to boost attendance!",
            "It looks like the class is empty. Ensure students understand the importance of attendance."
        ],
        1: [
            "Very few students present. Hopefully, the attendance will improve in the upcoming classes.",
            "A small group has attended. Let's aim for more active participation next time.",
            "Only a handful of students present. It might be good to remind them.",
            "Just a few students attended today. Let’s focus on increasing engagement.",
            "Attendance is low today. We need to motivate more students to show up.",
            "A small number of students present. We should encourage better participation soon."
        ],
        2: [
            "Moderate attendance today. Let’s aim for a higher turnout next time.",
            "About half of the class is present. Encouraging the rest to attend helps.",
            "Class is a bit divided today with around half the students present.",
            "Attendance is moderate today. Let’s work towards a better turnout next session.",
            "Not all students attended. Let's aim for better participation in next sessions.",
            "Half the class is here today. Let's push for full participation soon."
        ],
        3: [
            "Good turnout with most students attending. Let’s try to get the others.",
            "Solid attendance today! Keep up the good work and get even more involved.",
            "Great job, more than half of the class showed up today, keep it up.",
            "Most students showed up today. Let’s aim for full participation next time.",
            "Most of the class attended today. Let’s encourage the remaining students to join.",
            "Great turnout! Let’s keep up the momentum and engage the remaining students."
        ],
        4: [
            "Great attendance today! Most of the class is present and engaged.",
            "Fantastic participation today! Keep motivating students to maintain these attendance levels.",
            "Almost everyone is present, showing great commitment. Keep encouraging participation.",
            "Attendance is great today! Almost everyone is here and ready to engage.",
            "Solid attendance with almost everyone present today! Keep up the great work.",
            "Great turnout today with the majority of students present and involved!"
        ],
        5: [
            "Excellent turnout with nearly all students present. This is great participation.",
            "Almost perfect attendance today! Let’s aim for 100% participation next time.",
            "Outstanding attendance today. Let’s keep encouraging the last few to attend regularly.",
            "Amazing participation today! Just a few students missing, but we can improve.",
            "Almost all students are here today! Let’s continue pushing for perfect attendance.",
            "Fantastic participation rate today! We’re almost at 100%, let's reach it!"
        ],
        6: [
            "Perfect attendance today! Every student showed up, which is an incredible achievement!",
            "100% attendance today! This is a fantastic demonstration of dedication and responsibility.",
            "Bravo! All students were present today, which shows excellent engagement and responsibility.",
            "Perfect attendance! Every student is present today. What an incredible achievement.",
            "100% of students attended today! This is a great show of commitment.",
            "Every student was present today. Amazing commitment and engagement from everyone!"
        ],
    };


    let range = 0;

    if (percentage >= 1 && percentage <= 25) {
        range = 1;
    } else if (percentage >= 26 && percentage <= 50) {
        range = 2;
    } else if (percentage >= 51 && percentage <= 75) {
        range = 3;
    } else if (percentage >= 76 && percentage <= 90) {
        range = 4;
    } else if (percentage >= 91 && percentage <= 99) {
        range = 5;
    } else if (percentage === 100) {
        range = 6;
    }

    const statements = messages[range];
    const randomIndex = Math.floor(Math.random() * statements.length);
    return statements[randomIndex];
}


export function getAvgPercentMessage(avgPercent) {
    const messages = {
        0: [
            "The average is low. We need to improve performance.",
            "Performance is lacking. Let’s aim for improvement.",
            "The average is concerning. We need better results.",
            "Low average. Let’s re-evaluate and improve.",
            "Below expectations. Time to focus on growth.",
            "We need to improve the average percentage."
        ],
        1: [
            "The average is slightly below par. Let’s improve.",
            "Below average. Let's help students perform better.",
            "The average is low. We need to raise performance.",
            "Some improvement needed. Let’s increase scores.",
            "The average could improve. Let's motivate students.",
            "A bit below average. Let’s boost engagement."
        ],
        2: [
            "Moderate average. Let’s aim higher next time.",
            "Decent performance, but room for improvement.",
            "Moderate results. Let’s aim for better performance.",
            "About average. Let’s push for better results.",
            "Decent. Focus on improving the overall average.",
            "Moderate performance. Let’s work towards better."
        ],
        3: [
            "Good average. Let’s aim for even better results.",
            "Great performance! Let’s strive for higher scores.",
            "Solid average. Let’s achieve higher performance.",
            "Good job! Let’s aim for perfect scores next time.",
            "Strong average. Let’s push for even better results.",
            "Well done! Let’s strive for excellence."
        ],
        4: [
            "Excellent average! Let’s aim higher.",
            "Fantastic performance! Keep up the momentum.",
            "Impressive! Let’s push for even better results.",
            "Very good average. Let’s aim for perfection.",
            "Great average! Let’s aim even higher next time.",
            "Excellent performance! Let’s keep the trend."
        ],
        5: [
            "Outstanding performance! Let’s keep it up.",
            "Near-perfect. Let’s work toward 100%.",
            "Incredible results! Let’s aim for perfection.",
            "Almost perfect average. Let’s strive for 100%.",
            "Near-perfect! Let’s continue pushing for 100%.",
            "Great job! Let’s keep excelling."
        ],
        6: [
            "100% average! Exceptional achievement!",
            "Perfect performance! 100%—amazing!",
            "Bravo! 100% average—outstanding work!",
            "Perfect 100%! Incredible performance!",
            "Perfect average! Every student did well!",
            "Incredible! 100%—what an achievement!"
        ]
    };


    let range = 0;

    if (avgPercent >= 1 && avgPercent <= 25) {
        range = 1;
    } else if (avgPercent >= 26 && avgPercent <= 50) {
        range = 2;
    } else if (avgPercent >= 51 && avgPercent <= 75) {
        range = 3;
    } else if (avgPercent >= 76 && avgPercent <= 90) {
        range = 4;
    } else if (avgPercent >= 91 && avgPercent <= 99) {
        range = 5;
    } else if (avgPercent === 100) {
        range = 6;
    }

    const statements = messages[range];
    const randomIndex = Math.floor(Math.random() * statements.length);
    return statements[randomIndex];
}


export function getAvgGrowthRateMessage(avgGrowthRate) {
   const messages = {
    0: [
        "The growth rate is negative; focus on improvement.",
        "Growth rate is lacking; let’s work on improvement.",
        "The growth rate is concerning; find ways to improve.",
        "Growth is flat or negative; focus on boosting engagement.",
        "Little to no growth; focus on increasing performance.",
        "Declining growth rate; focus on stimulating improvement."
    ],
    1: [
        "Growth rate is low; aim for substantial improvements.",
        "Growth could be better; motivate students for more growth.",
        "Underwhelming growth rate; focus on performance next period.",
        "Slow growth rate; work on better improvement strategies.",
        "Lower than expected growth; encourage better progress.",
        "Growth rate can improve; focus on boosting performance."
    ],
    2: [
        "Moderate growth; room for improvement, headed in right direction.",
        "Average growth rate; aim for more in future periods.",
        "Moderate growth; aim for higher progress next time.",
        "Decent growth rate; work on better student outcomes.",
        "Acceptable growth; room to improve and drive better results.",
        "Moderate growth; strive for more improvement moving forward."
    ],
    3: [
        "Good growth rate; keep up the work and improve next time.",
        "Solid growth; aim for even greater progress next period.",
        "Strong growth rate; continue striving for excellence.",
        "Good growth; aim for better results next time.",
        "Positive growth; build on this momentum.",
        "Great progress; aim for more growth next time."
    ],
    4: [
        "Excellent growth; aim to continue this momentum.",
        "Impressive growth rate; aim for more progress.",
        "Outstanding growth; push for higher results.",
        "Fantastic growth; aim for better results.",
        "Excellent progress; continue pushing for growth.",
        "Great job; aim for higher performance."
    ],
    5: [
        "Incredible growth; exceptional improvement—keep up the great work.",
        "Extraordinary growth; continue exceptional progress.",
        "Fantastic improvement; aim for perfection.",
        "Amazing growth; strive for even better results.",
        "Incredible growth; keep the momentum going.",
        "Outstanding growth; aim for even higher levels."
    ],
    6: [
        "Perfect growth rate; exceptional effort—amazing work!",
        "100% growth rate; incredible achievement!",
        "Amazing growth; exceptional demonstration of progress.",
        "Perfect growth rate; highest level of improvement.",
        "Outstanding 100% growth; incredible progress.",
        "Exceptional growth rate; remarkable accomplishment!"
    ],
};


    let range = 0;

    if (avgGrowthRate < 0) {
        range = 0;
    } else if (avgGrowthRate >= 0 && avgGrowthRate <= 10) {
        range = 1;
    } else if (avgGrowthRate > 10 && avgGrowthRate <= 25) {
        range = 2;
    } else if (avgGrowthRate > 25 && avgGrowthRate <= 50) {
        range = 3;
    } else if (avgGrowthRate > 50 && avgGrowthRate <= 75) {
        range = 4;
    } else if (avgGrowthRate > 75 && avgGrowthRate < 100) {
        range = 5;
    } else if (avgGrowthRate === 100) {
        range = 6;
    }

    const statements = messages[range];
    const randomIndex = Math.floor(Math.random() * statements.length);
    return statements[randomIndex];
}


export function getStudentRecentAttendanceMessage(percentage) {
    const messages = {
        0: [
            "It seems your child has not attended class recently. This can significantly impact their learning and progress.",
            "Unfortunately, your child has missed all classes recently. It's crucial to improve attendance for academic success.",
            "No attendance in the last few days. Regular attendance is essential for meeting exam requirements and staying on track.",
            "Your child hasn't attended class recently. We should focus on increasing participation to avoid falling behind.",
            "It appears your child has missed all recent classes. Consistent attendance is necessary to meet academic expectations.",
            "No recent attendance from your child. It's important to address this to ensure they don't miss key learning material."
        ],
        1: [
            "Your child has attended a few classes recently, but attendance is still very low. This may affect their ability to meet exam requirements.",
            "A small number of classes attended, but many have been missed. We need to focus on boosting attendance for academic progress.",
            "Your child has attended a few classes recently. It's important that they attend more regularly to stay on track with their exams.",
            "Your child attended only a few classes, but missed many. Low attendance could impact their ability to prepare for exams effectively.",
            "A few classes attended by your child, but overall attendance is low. Regular attendance is necessary to perform well in exams.",
            "While your child attended a few classes, they need to improve attendance to meet academic and exam requirements."
        ],
        2: [
            "Your child has attended a moderate number of classes recently. It's important to increase this to ensure they don't fall behind.",
            "About half of the recent classes were attended. Regular participation is key to meeting exam preparation standards.",
            "Moderate attendance from your child, but they should aim for better consistency to stay ahead in their studies and prepare for exams.",
            "Your child attended some classes, but could benefit from attending more regularly to ensure they meet academic goals and exam readiness.",
            "Attendance is moderate. It’s essential that your child attends more classes regularly to perform well on exams and coursework.",
            "Your child has attended about half of the classes. A stronger commitment to attendance will ensure they are prepared for upcoming exams."
        ],
        3: [
            "Your child has been attending most classes recently. Great effort! Let’s aim for perfect attendance to maximize learning and exam prep.",
            "Good attendance overall! Your child has attended most classes. Full participation will help them succeed in exams and coursework.",
            "Your child is on the right track with most classes attended. Let’s aim for full attendance to ensure they are fully prepared for exams.",
            "Your child has been present for most classes recently. Let’s keep up the great work and aim for 100% attendance going forward.",
            "Great job! Your child was present for most of the recent classes. Let’s continue pushing for full participation to excel in exams.",
            "Your child has been attending most classes recently. Let’s work towards ensuring they attend every session to stay on top of exam prep."
        ],
        4: [
            "Fantastic attendance! Your child has attended nearly all classes recently. Let’s aim for 100% attendance to ensure complete exam preparation.",
            "Almost perfect attendance! Your child is doing a great job. Let’s push for full participation to be fully prepared for exams.",
            "Your child has shown great commitment by attending almost every class. Let’s work together to ensure they don’t miss anything important for exams.",
            "Your child has attended almost every class recently. This is a great start! Let’s aim for perfect attendance for complete academic success.",
            "Great participation! Your child has attended nearly all classes. Let’s continue this effort and strive for 100% attendance.",
            "Excellent attendance! Your child has missed very few classes. Let’s work towards perfect attendance to keep their exam preparation strong."
        ],
        5: [
            "Excellent attendance! Your child has been present for almost every class. Let’s aim for 100% attendance in the future for perfect exam preparation.",
            "Nearly perfect attendance! Your child is doing an outstanding job. Let’s continue this momentum and ensure they attend every session.",
            "Your child has shown incredible participation. Let’s work together to make sure they attend 100% of the classes for optimal exam performance.",
            "Fantastic effort! Your child was present for almost all classes. Let's ensure they don't miss anything crucial as exams approach.",
            "Amazing attendance! Your child has been present for nearly every class. Let’s work towards perfect attendance to be fully prepared for exams.",
            "Your child has been present for almost every class. Let’s strive for perfect attendance to ensure they are fully prepared for exams and coursework."
        ],
        6: [
            "Perfect attendance! Your child attended every class recently. This is an incredible achievement and shows excellent dedication.",
            "100% attendance! Your child has shown amazing commitment and responsibility by attending all classes. This will certainly pay off in exams.",
            "Bravo! Your child attended every single class. This is a fantastic demonstration of responsibility and engagement, and it will help in exam preparation.",
            "Your child has perfect attendance. This is a great show of commitment and will ensure they are fully prepared for exams.",
            "100% attendance! Your child has attended every class. This is an outstanding achievement and will greatly support their exam readiness.",
            "Amazing achievement! Your child attended every class. This level of commitment and engagement will definitely help in their exams."
        ],
    };

    let range = 0;

    if (percentage >= 1 && percentage <= 25) {
        range = 1;
    } else if (percentage >= 26 && percentage <= 50) {
        range = 2;
    } else if (percentage >= 51 && percentage <= 75) {
        range = 3;
    } else if (percentage >= 76 && percentage <= 90) {
        range = 4;
    } else if (percentage >= 91 && percentage <= 99) {
        range = 5;
    } else if (percentage === 100) {
        range = 6;
    }

    const statements = messages[range];
    const randomIndex = Math.floor(Math.random() * statements.length);
    return statements[randomIndex];
}



export function getAvgPresentLongMessage(avgPresentPercentage, perfectionistCount) {
    const messages = {
        0: [
            `Currently, attendance is at ${avgPresentPercentage}%. Only ${perfectionistCount} students have perfect attendance. We need to improve engagement and encourage regular participation for better performance.`,
            `With an average attendance of ${avgPresentPercentage}% and ${perfectionistCount} perfectionists, we need to significantly boost participation to improve overall results in the next sessions.`,
            `Attendance stands at ${avgPresentPercentage}% with just ${perfectionistCount} students maintaining perfect attendance. Focus on boosting overall engagement to enhance class performance in future periods.`,
            `At ${avgPresentPercentage}% attendance, only ${perfectionistCount} students show perfect attendance. Let’s improve participation across the board and drive better results moving forward.`,
            `With ${avgPresentPercentage}% average attendance and ${perfectionistCount} students showing perfect attendance, the focus should be on increasing participation and achieving better engagement overall.`
        ],
        1: [
            `Your average attendance is ${avgPresentPercentage}% with ${perfectionistCount} perfectionists in class. To improve, let’s increase participation and aim for better attendance in the next sessions.`,
            `Currently, attendance is ${avgPresentPercentage}%, with ${perfectionistCount} perfectionists. This shows progress, but there’s room for improvement. Let’s work on boosting engagement and participation further.`,
            `With ${avgPresentPercentage}% attendance and ${perfectionistCount} perfect attenders, there’s room for growth. Let’s engage more students and increase participation levels for better results overall.`,
            `The attendance is ${avgPresentPercentage}% with ${perfectionistCount} perfectionists. Let’s inspire others to attend more often and actively participate in class discussions for better outcomes.`,
            `Attendance rate stands at ${avgPresentPercentage}% with ${perfectionistCount} perfectionists. To improve, let’s focus on motivating more students to attend regularly and raise overall participation levels.`
        ],
        2: [
            `Attendance is at ${avgPresentPercentage}% with ${perfectionistCount} students achieving perfect attendance. This is decent progress, but let’s aim for greater engagement and participation in future sessions.`,
            `Currently, ${avgPresentPercentage}% of the class attended, with ${perfectionistCount} perfectionists. To enhance performance, let’s work on increasing overall participation and inspiring others to attend more regularly.`,
            `Your current attendance is ${avgPresentPercentage}% with ${perfectionistCount} perfectionists attending. This shows good progress. Let’s work on improving overall engagement and encouraging more students to attend.`,
            `With ${avgPresentPercentage}% average attendance and ${perfectionistCount} students showing perfect attendance, we need to continue motivating the rest to improve attendance and actively participate.`,
            `Currently, ${avgPresentPercentage}% of the class is attending regularly, and ${perfectionistCount} students have perfect attendance. Keep pushing for more engagement to reach higher participation rates.`
        ],
        3: [
            `Great job! Attendance is at ${avgPresentPercentage}%, with ${perfectionistCount} students maintaining perfect attendance. Let’s keep building on this success and strive for even better participation rates.`,
            `With ${avgPresentPercentage}% attendance and ${perfectionistCount} perfectionists, things are looking good! Keep encouraging the remaining students to attend and engage regularly to achieve optimal results.`,
            `Attendance stands at ${avgPresentPercentage}%, with ${perfectionistCount} students attending perfectly. Keep up the great work and aim to inspire others to engage and attend more frequently.`,
            `Great attendance at ${avgPresentPercentage}% with ${perfectionistCount} perfectionists. This is excellent progress! Let’s continue pushing for 100% participation and increasing overall class engagement.`,
            `Your attendance rate is ${avgPresentPercentage}% with ${perfectionistCount} perfectionists. Keep up the excellent work and inspire others to participate and improve attendance for better results overall.`
        ],
        4: [
            `Excellent performance! With ${avgPresentPercentage}% attendance and ${perfectionistCount} perfectionists, the class is showing great commitment. Keep up the effort and work on improving engagement even more.`,
            `Attendance is at ${avgPresentPercentage}% with ${perfectionistCount} students showing perfect attendance. This is impressive, but let’s continue motivating others to attend and participate more regularly.`,
            `Currently, the average attendance is ${avgPresentPercentage}% with ${perfectionistCount} perfectionists. This is great progress, but we can push for even better attendance across the whole group.`,
            `The class attendance is ${avgPresentPercentage}% with ${perfectionistCount} perfectionists. Keep encouraging the rest to attend regularly to match this high standard and improve performance.`,
            `Great work with ${avgPresentPercentage}% attendance and ${perfectionistCount} perfectionists. Keep inspiring the rest to improve participation and engagement for better academic success overall.`
        ],
        5: [
            `Incredible! Attendance is ${avgPresentPercentage}% with ${perfectionistCount} perfectionists. Let’s maintain this momentum and work towards achieving full participation across the group for even better results.`,
            `Excellent attendance at ${avgPresentPercentage}% with ${perfectionistCount} perfectionists! Keep it up and aim for full engagement across the entire class to reach greater success in the future.`,
            `The average attendance rate is ${avgPresentPercentage}% with ${perfectionistCount} students showing perfect attendance. Fantastic progress! Let’s continue building on this and inspire even more students to attend.`,
            `Fantastic! Your current attendance is ${avgPresentPercentage}% with ${perfectionistCount} students attending perfectly. Let’s keep working toward even greater levels of engagement and perfect attendance overall.`,
            `Amazing progress! With ${avgPresentPercentage}% attendance and ${perfectionistCount} perfectionists, you’re doing great! Keep aiming for perfect attendance across all students to maintain success in the future.`
        ],
    };

    // Determine the range based on the avgPresentPercentage
    let range = 0;

    if (avgPresentPercentage < 40) {
        range = 0;
    } else if (avgPresentPercentage >= 40 && avgPresentPercentage <= 60) {
        range = 1;
    } else if (avgPresentPercentage > 60 && avgPresentPercentage <= 75) {
        range = 2;
    } else if (avgPresentPercentage > 75 && avgPresentPercentage <= 90) {
        range = 3;
    } else if (avgPresentPercentage > 90 && avgPresentPercentage <= 98) {
        range = 4;
    } else if (avgPresentPercentage > 98 && avgPresentPercentage < 100) {
        range = 5;
    } else if (avgPresentPercentage === 100) {
        range = 6;
    }

    const statements = messages[range];
    const randomIndex = Math.floor(Math.random() * statements.length);
    return statements[randomIndex];
}

