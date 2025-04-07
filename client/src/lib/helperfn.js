export  function getWeekRange(year, weekNumber) {
        const firstDayOfYear = new Date(year, 0, 1);
        const startDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + (weekNumber - 1) * 7));

        // Adjust the start date to Monday
        const dayOfWeek = startDate.getDay();
        const daysToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
        startDate.setDate(startDate.getDate() - daysToMonday);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const options = { month: 'long', day: 'numeric' };
        const startFormatted = startDate.toLocaleDateString('en-US', options);
        const endFormatted = endDate.toLocaleDateString('en-US', options);

        return `${startFormatted} - ${endFormatted}`;
    }

    export  function getMonthName(monthNumber) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    }