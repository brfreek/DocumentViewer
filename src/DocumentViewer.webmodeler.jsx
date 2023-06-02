import { Component, createElement } from "react";

export class preview extends Component {
    render() {
        return <div>There is no webmodeler feature for this widget</div>;
    }
}

export function getPreviewCss() {
    return require("./ui/DocumentViewer.css");
}
