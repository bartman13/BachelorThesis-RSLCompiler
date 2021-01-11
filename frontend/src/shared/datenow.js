export default function dateNow(){
    const now = new Date();
    const date = now.toLocaleString().substring(0, 10).split(".").map(s => { if(s.length < 2) return "0" + s; else return s;});
    const time = now.toLocaleTimeString().substring(0, 5);
    return [[date[2], date[1], date[0]].join("-"), time].join("T");
}