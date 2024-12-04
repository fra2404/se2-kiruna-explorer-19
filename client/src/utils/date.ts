const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

export const years = Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString(),
);

export const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
);

export const getDays = (selectedYear: string, selectedMonth: string) =>
    selectedYear && selectedMonth
      ? Array.from(
          {
            length: getDaysInMonth(
              parseInt(selectedYear),
              parseInt(selectedMonth),
            ),
          },
          (_, i) => (i + 1).toString().padStart(2, '0'),
        )
      : [];