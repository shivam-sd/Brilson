const downloadCSV = (contact) => {
    const headers = ["Name", "Phone", "Email", "Website", "Company"];

    const values = [
        contact.name,
        contact.phone,
        contact.email,
        contact.website,
        contact.company
    ];


    const CSVContent = headers.join(",") + "\n" + values.join(",");

    const blob = new Blob([CSVContent], {type: "text/csv"});

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${contact.name}-contact.csv`;
    a.click();


    window.URL.revokeObjectURL(url);
}


export default downloadCSV;