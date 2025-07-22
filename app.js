let formatDate = () => {
    let dateInput = document.getElementById("date").value; // YYYY-MM-DD
    if (dateInput) {
        let parts = dateInput.split("-");
        let formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
        document.getElementById("formattedDate").innerText = formattedDate;
    }
}

let formatDate1 = () => {
    let dateInput = document.getElementById("date1").value; // YYYY-MM-DD
    if (dateInput) {
        let parts = dateInput.split("-");
        let formattedDate1 = `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
        document.getElementById("formattedDate1").innerText = formattedDate1;
    }
}

printpdf

let pdfmack = ()=>{
    let printpdf = document.getElementById("printpdf");
    
}