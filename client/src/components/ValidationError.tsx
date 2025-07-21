import React from "react";

type Props = {
    error?: string;
    className?: string;
}

const ValidationError:React.FC<Props> = ({error, className}) => {
    return (error ? <p className={className ? className : ""}>{error}</p> : null)
}

export default ValidationError;