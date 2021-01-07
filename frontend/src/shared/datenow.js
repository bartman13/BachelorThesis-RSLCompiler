export default function dateNow(){
    const now = new Date();
    const date = now.toISOString().substring(0, 10);
    const time = now.toLocaleTimeString().substring(0, 5);
    return [date, time].join("T");
}