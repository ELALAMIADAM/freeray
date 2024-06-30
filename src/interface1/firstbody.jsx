
function firstbody(props){
const Styles={

    "--percentage": "0.5",
    "--line-color": "#000000",
    width: props.valeur*4,
    height: "3px" ,
    "backgroundColor": "var(--line-color)"
}
const WhiteLineStyle = {
    "--percentage": "0.5",
    "--line-color": "#FFFFFF",
    width: 400,
    
    height: "3px" ,
    "backgroundColor": "var(--line-color)"
};


return(
    <main id="first-two">
        
        <div className="energie">
            <p>{props.name} {props.valeur} </p>
            <div style={WhiteLineStyle}>
            <div style={Styles}></div></div>
        </div>
    </main>
);

}
export default firstbody
