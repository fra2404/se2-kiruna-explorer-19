import "../../src/global.js";
import Graph from "react-graph-vis";
import { useState } from "react";

const LABEL_FONT = { size: 25, color: "#000000" };

const options = {
    autoResize: true,
    layout: {
        hierarchical: false
    },
    edges: {
        color: "#000000"
    },
    physics: {
        enabled: false // Disable physics to prevent nodes from moving
    },
    interaction: {
        dragNodes: false, // Disable dragging of nodes
        dragView: true, // Enable dragging of the view
        zoomView: true, // Enable zooming of the view

    },
};

function randomColor() {
    const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${red}${green}${blue}`;
}

const Diagram = () => {
    const scaleMapping = {
        "Text": 100,
        "Concept": 200,
        "1:100,000": 300,
        "1:10,000": 400,
        "1:5,000": 500,
        "1:1,000": 600,
        "Blueprint/effects": 700,
    };

    const occupiedPositions = [] as any;

    const label_style = [
        { id: "label_text", label: "Text", color: "#e0df41", scale: "Text" },
        { id: "label_concept", label: "Concept", color: "#e0df41", scale: "Concept" },
        { id: "label_architectural", label: "1:100,000", color: "#e0df41", scale: "1:100,000" },
        { id: "label_architectural2", label: "1:10,000", color: "#e0df41", scale: "1:10,000" },
        { id: "label_architectural3", label: "1:5,000", color: "#e0df41", scale: "1:5,000" },
        { id: "label_architectural4", label: "1:1,000", color: "#e0df41", scale: "1:1,000" },
        { id: "label_blueprint", label: "Blueprint/effects", color: "#e0df41", scale: "Blueprint/effects" },
    ].map(node => ({
        ...node,
        x: (-0.3) * 1000, // Place the label on the left side of the graph
        y: scaleMapping[node.scale as keyof typeof scaleMapping], // Mapping the scale
        shape: "box",
        font: LABEL_FONT
    }
    ));

    const label_year = [];
    const minYear = 2000;
    const maxYear = 2040;

    for (let year = minYear; year <= maxYear; year++) {
        label_year.push({
            id: `label_${year}`,
            label: `${year}`,
            color: "#e0df41",
            year: year,
            x: (year - 2000) * 1000, // Mapping the year
            y: 50, // Place the label on the top side of the graph
            shape: "box",
            font: LABEL_FONT
        });
    }


    const nodes = [
        { id: 1, label: "Node 1", color: "#e04141", year: 2000, scale: "Text" },
        { id: 2, label: "Node 2", color: "#e09c41", year: 2001, scale: "Concept" },
        { id: 3, label: "Node 3", color: "#e0df41", year: 2002, scale: "1:100,000" },
        { id: 4, label: "Node 4", color: "#7be041", year: 2003, scale: "1:10,000" },
        { id: 5, label: "Node 5", color: "#41e0c9", year: 2004, scale: "1:5,000" },
        { id: 6, label: "Node 6", color: randomColor(), year: 2005, scale: "1:1,000" },
        { id: 7, label: "Node 7", color: randomColor(), year: 2006, scale: "Blueprint/effects" },
        { id: 8, label: "Node 8", color: randomColor(), year: 2007, scale: "Text" },
        { id: 9, label: "Node 9", color: randomColor(), year: 2008, scale: "Concept" },
        { id: 10, label: "Node 10", color: randomColor(), year: 2009, scale: "1:100,000" },
        { id: 11, label: "Node 11", color: randomColor(), year: 2010, scale: "1:10,000" },
        { id: 12, label: "Node 12", color: randomColor(), year: 2011, scale: "1:5,000" },
        { id: 13, label: "Node 13", color: randomColor(), year: 2012, scale: "1:1,000" },
        { id: 14, label: "Node 14", color: randomColor(), year: 2013, scale: "Blueprint/effects" },
        { id: 15, label: "Node 15", color: randomColor(), year: 2014, scale: "Text" },
        { id: 16, label: "Node 16", color: randomColor(), year: 2015, scale: "Concept" },
        { id: 17, label: "Node 17", color: randomColor(), year: 2016, scale: "1:100,000" },
        { id: 18, label: "Node 18", color: randomColor(), year: 2017, scale: "1:10,000" },
        { id: 19, label: "Node 19", color: randomColor(), year: 2018, scale: "1:5,000" },
        { id: 20, label: "Node 20", color: randomColor(), year: 2019, scale: "1:1,000" },
        { id: 21, label: "Node 21", color: randomColor(), year: 2020, scale: "Blueprint/effects" },
        { id: 22, label: "Node 22", color: randomColor(), year: 2021, scale: "Text" },
        { id: 23, label: "Node 23", color: randomColor(), year: 2022, scale: "Concept" },
        { id: 24, label: "Node 24", color: randomColor(), year: 2023, scale: "1:100,000" },
        { id: 25, label: "Node 25", color: randomColor(), year: 2024, scale: "1:10,000" },
        { id: 26, label: "Node 26", color: randomColor(), year: 2021, scale: "Concept" },
        { id: 27, label: "Node 27", color: randomColor(), year: 2020, scale: "Concept" },
        { id: 28, label: "Node 28", color: randomColor(), year: 2022, scale: "1:10,000" },
        { id: 29, label: "Node 29", color: randomColor(), year: 2021, scale: "1:10,000" },
        { id: 30, label: "Node 30", color: randomColor(), year: 2020, scale: "1:10,000" },
        { id: 31, label: "Nodo sovrapposto", color: randomColor(), year: 2020, scale: "1:10,000" },
        { id: 32, label: "Nuovo nodo sovrapposto", color: randomColor(), year: 2020, scale: "1:10,000" },
    ].map(node => ({
        ...node,
        x: (node.year - 2000) * 1000, // Mapping the year
        y: scaleMapping[node.scale as keyof typeof scaleMapping], // Mapping the scale
    }
    ));

    nodes.forEach((node, index) => {
        const overlappingNode = occupiedPositions.find((pos: any) => pos.x === node.x && pos.y === node.y);
        if (overlappingNode) {
            // TODO: decide if the offset should be only on the x axis or also on the y axis
            const offsetX = Math.floor(Math.random() * 100) + 100; // Random offset between 100 and 200
            const offsetY = Math.floor(Math.random() * 20) + 20; // Random offset between 20 and 40
            node.x += offsetX;  // Add offset to x position
            node.y += offsetY; // Add offset to y position
        }
        occupiedPositions.push({ x: node.x, y: node.y });   // ?? I don't think this is needed.
    });


    const [state, setState] = useState({
        counter: 5,
        graph: {
            nodes: [...nodes, ...label_style, ...label_year],
            edges: [
                { from: 1, to: 2 },
                { from: 1, to: 3 },
                { from: 2, to: 4 },
                { from: 2, to: 5 },
                { from: 3, to: 6 },
                { from: 3, to: 7 },
                { from: 4, to: 8 },
                { from: 4, to: 9 },
                { from: 5, to: 10 },
                { from: 5, to: 11 },
                { from: 6, to: 12 },
                { from: 6, to: 13 },
                { from: 7, to: 14 },
                { from: 7, to: 15 },
                { from: 8, to: 16 },
                { from: 8, to: 17 },
                { from: 9, to: 18 },
                { from: 9, to: 19 },
                { from: 10, to: 20 },
                { from: 10, to: 21 },
                { from: 11, to: 22 },
                { from: 11, to: 23 },
                { from: 12, to: 24 },
                { from: 12, to: 25 }
            ]
        },
    })
    const { graph } = state;
    return (
        <div>
            <Graph graph={graph} options={options} style={{ height: "640px" }} />
        </div>
    );

};

export default Diagram;