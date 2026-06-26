import * as XLXS from 'xlsx'

export const exportToExcel = (data, fileName = "transations") => {
    if (!data || data.length === 0) {
        alert("No Data is export!");
        return;
    }
    try {
        const worksheet = XLXS.utils.json_to_sheet(data);
        // create a workbook 
        const workbook = XLXS.utils.book_new();
        XLXS.utils.book_append_sheet(workbook, worksheet, 'Transactions');

        // generate a excel file and trigger download 
        XLXS.writeFile(workbook, `${fileName}.xlsx`, {
            bookType: 'xlsx',
            type: 'array'
        });

    }
    catch (err) {
        console.error("Export error:", err);
        alert("Error exporting data. Please try again.");
    }

}
// 3:59:10 