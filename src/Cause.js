import Figure from "react-bootstrap/Figure";
import blm from "./blm.png";
import Grid from "@material-ui/core/Grid";
import React from "react";
function Cause({handleOpen, title, picture}) {
return(
    <Figure className={"cause"}>
        <Figure.Image
            width="300"
            height="300"
            alt="171x180"
            class="cause"
            src={picture}
            onClick={() => {
                handleOpen(title);
            }}
        />
        <Figure.Caption>
            {title}

        </Figure.Caption>
    </Figure>
)
}

export default Cause;
