export async function fetchWorldMap(){
    const response = await fetch('/src/countries.topojson');
    const data = await response.json();
    return data;
}

export async function fetchCSV(){
    const response = await fetch('/src/API_NY.GDP.MKTP.CD_DS2_en_csv_v2_4353236.csv');
    const data = await response.text();
    return data;
}