import Figure from "react-bootstrap/Figure";
import blm from "./blm.png";
import Grid from "@material-ui/core/Grid";
import React from "react";
import NoImage from "./noImage.png";
function Cause({handleOpen, title, picture, index}) {


return(
    <Figure className={"cause"}>
        <Figure.Image
            width="275"
            height="275"
            alt={title + " image"}
            class="cause"
            src={picture}
            onError={(e)=>{e.target.onerror = null; e.target.src=NoImage}}
            onClick={() => {
                handleOpen(index);
            }}
            style = {{objectFit: "cover"}}
        />
        <Figure.Caption>
            {title}

        </Figure.Caption>
    </Figure>
)
}

export default Cause;
