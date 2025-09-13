export class EnglishView{
    
    render(){
        const el = document.querySelector(".map-uk");
        if(el){
            el.innerHTML = "";
            el.innerHTML = `
                     <div class="map-uk"></div>
            `;
        }
    } 
}