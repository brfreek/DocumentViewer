import { Component, createElement } from "react";
import { hot } from "react-hot-loader/root";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DocumentCore from "./components/DocumentCore";

import "./ui/DocumentViewer.css";

class DocumentViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numberOfPages: null,
            currentPageNumber: 1
        };

        this._getFileUrl = this._getFileUrl.bind(this);
        this._nextPage = this._nextPage.bind(this);
        this._prevPage = this._prevPage.bind(this);
    }

    _nextPage = () => {
        this.setState({
            ...this.state,
            currentPageNumber: this.state.currentPageNumber + 1
        });
    };
    _prevPage = () => {
        this.setState({
            ...this.state,
            currentPageNumber: this.state.currentPageNumber - 1
        });
    };

    _getFileUrl = () => {
        if (
            this.props.base64File &&
            this.props.base64File.status === "available" &&
            this.props.base64File.value !== ""
        ) {
            var value = this.props.base64File.value;
            if (!this.props.base64File.value.includes(",")) {
                value = "data:application/pdf;base64," + value;
            }

            return value;
        }

        if (
            this.props.fileId &&
            this.props.fileId.status === "available" &&
            this.props.fileId.displayValue !== "" &&
            this.props.fileChangedDate &&
            this.props.fileChangedDate.status === "available"
        ) {
            if (this.props.fileId?.status !== "available" && this.props.fileChangedDate.status !== "available") {
                return "";
            } else {
                const fileId = this.props.fileId.displayValue;
                const changedDate = this.props.fileChangedDate.value ? this.props.fileChangedDate.value.getTime() : "";
                const suffix = "&" + ["target=window", "csrfToken=" + mx.session.getConfig("csrftoken")].join("&");
                return mx.appUrl + "file?" + ["fileID=" + fileId, "changedDate=" + changedDate].join("&") + suffix;
            }
        }
        return null;
    };

    _onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({
            ...this.state,
            numberOfPages: numPages,
            currentPageNumber: 1
        });
    };
    _getPageWidth = () => {
        if (this.props.pageWidth && this.props.pageWidth > 0) {
            return this.props.pageWidth;
        } else if (this.props.pageWidthClassName && this.props.pageWidthClassName !== "") {
            const element = document.querySelector("." + this.props.pageWidthClassName);
            if (element) {
                return element.clientWidth;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    };

    _renderDocumentCore = (currentPageNumber) => {
        if(this.props.enableZoom){
            return (
                <TransformWrapper defaultScale={1}>
                    <TransformComponent>
                        <DocumentCore pageNumber={currentPageNumber} documentLoadSuccess={this._onDocumentLoadSuccess} fileUrl={this._getFileUrl()} width={this._getPageWidth} />
                    </TransformComponent>
                </TransformWrapper>
            )
        } else {
            return <DocumentCore pageNumber={currentPageNumber} documentLoadSuccess={this._onDocumentLoadSuccess} fileUrl={this._getFileUrl()} width={this._getPageWidth} />
        }
    }
    _replacePageCounter = () => {
        if(this.props.pageNumberString.status === "available") {
            const res1 = this.props.pageNumberString.value.replace("%pageNumber%", this.state.currentPageNumber);
            return res1.replace("%totalPages%", this.state.numberOfPages);    
        } else {
            return "";
        }
    }
    render() {
        const { numberOfPages, currentPageNumber } = this.state;
        if(this.props.nextLabel.status !== "available" && this.props.prevLabel.status !== "available" && this.props.pageNumberString.status !== "available"){
            return (<div></div>);
        }
        return (
            <div>
                { this._renderDocumentCore(currentPageNumber) }
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <button
                        className={"btn previous-page " + this.props.buttonClass}
                        onClick={this._prevPage}
                        disabled={currentPageNumber === 1}
                    >
                        {this.props.prevLabel.value}
                    </button>
                    <span>{this._replacePageCounter()}</span>
                    <button
                        className={"btn next-page " + this.props.buttonClass}
                        onClick={this._nextPage}
                        disabled={currentPageNumber === numberOfPages}
                    >
                        {this.props.nextLabel.value}
                    </button>
                </div>
            </div>
        );
    }
}

export default hot(DocumentViewer);
