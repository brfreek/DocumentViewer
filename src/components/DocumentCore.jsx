import React, { createElement } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const DocumentCore = (props) => {
    return (
        <Document file={props.fileUrl} onLoadSuccess={props.documentLoadSuccess}>
            <Page pageNumber={props.pageNumber} width={props.width} />
        </Document>   
    )
}

export default DocumentCore;