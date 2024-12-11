/* eslint-disable @typescript-eslint/no-explicit-any */
import "../../src/global.js";
import Graph from "react-graph-vis";
import "vis-network/styles/vis-network.css";

const Legend = () => {
    const COLOR = "rgba(224, 65, 65, 0.0)";
    const LABEL_FONT = { size: 20, color: "#000000" };
    const legend = {
        nodes: [
            { id: 1, color: COLOR, font: LABEL_FONT, x: -100, y: -50 },
            { id: 2, color: COLOR, x: 100, y: -50 },
            { id: 3, color: COLOR, font: LABEL_FONT, x: -100, y: 0 },
            { id: 4, color: COLOR, x: 100, y: 0 },
            { id: 5, color: COLOR, font: LABEL_FONT, x: -100, y: 50 },
            { id: 6, color: COLOR, x: 100, y: 50 },
            { id: 7, color: COLOR, font: LABEL_FONT, x: -100, y: 100 },
            { id: 8, color: COLOR, x: 100, y: 100 },
        ] as any[],
        edges: [
            { from: 1, to: 2, dashes: false, label: "Direct consequence" },
            { from: 3, to: 4, dashes: [2, 2], label: "Collateral consequence" },
            { from: 5, to: 6, dashes: [1, 3], label: "Projection" },
            { from: 7, to: 8, dashes: [2, 1, 1], label: "Update", },
        ] as { from: any; to: any; dashes: any, arrows: any, label: string }[]
    }

    const options = {
        autoResize: true,
        layout: {
            hierarchical: false
        },
        physics: {
            enabled: false // Disable physics to prevent nodes from moving
        },
        interaction: {
            dragNodes: false, // Enable dragging nodes (improves the readability)
            dragView: false, // Enable dragging of the view
            zoomView: false, // Enable zooming of the view
            navigationButtons: false, // Enable navigation buttons
        },
        nodes: {
            physics: false,
            fixed: true,
            shape: "box",
            size: 10,
            font: LABEL_FONT,
            color: COLOR,
            chosen: false, // Disable click on nodes
        },
        edges: {
            arrows: {
                to: { enabled: false, type: 'arrow' }
            },
            width: 1,
            font: LABEL_FONT,
            chosen: false, // Disable click on edges
        },
    };

    return (
        <div style={{ width: '200px', height: '150px', border: '1px solid black', padding: '0px', backgroundColor: 'white' }}>
            <Graph
                graph={legend}
                options={options}
                getNetwork={network => {
                    network.moveTo({ scale: 0.8 }); // Set the initial zoom level
                }}

            />
        </div>
    );
};

export default Legend;