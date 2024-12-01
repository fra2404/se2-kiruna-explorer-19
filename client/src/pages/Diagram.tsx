/* eslint-disable @typescript-eslint/no-explicit-any */
import "../../src/global.js";
import Graph from "react-graph-vis";
import './Diagram.css';
import { useState, useEffect, useRef } from "react";
import API from "../API";
import ErrorImage from '../assets/icons/error.png';
import AgreementIcon from "../assets/icons/agreement-icon.svg";
import ConflictIcon from '../assets/icons/conflict-icon.svg';
import ConsultationIcon from '../assets/icons/consultation-icon.svg';
import DesignDocIcon from '../assets/icons/design-doc-icon.svg';
import InformativeDocIcon from '../assets/icons/informative-doc-icon.svg';
import MaterialEffectsIcon from '../assets/icons/material-effects-icon.svg';
import PrescriptiveDocIcon from '../assets/icons/prescriptive-doc-icon.svg';
import TechnicalDocIcon from '../assets/icons/technical-doc-icon.svg';
import "vis-network/styles/vis-network.css";


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
        // Enable navigation buttons
        navigationButtons: true,
    },

};

const graphBEInfo = await API.getGraphInfo();
console.log("Graph info: ", graphBEInfo);

const randomColor = () => {
    const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${red}${green}${blue}`;
}

const scaleMapping = {
    "TEXT": 200,
    "CONCEPT": 300,
    "ARCHITECTURAL": 400,
    "BLUEPRINT/MATERIAL EFFECTS": 500,
    "default": 50, // Valore di default per testing!
};



const Diagram = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [state, setState] = useState({
        graph: {
            nodes: [] as any[],
            edges: [] as { from: any; to: any; color: string }[]
        }
    });

    const label_year = [];
    const minYear = graphBEInfo.minYear;
    const maxYear = graphBEInfo.maxYear;


    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const documents = await API.getDocuments();
                setDocuments(documents);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };
        fetchDocuments();
    }, []);

    useEffect(() => {
        const connections = [] as any[];

        // Here I need to create the nodes with the data retrieved from the API.
        // But first I need to map the data to the format that the graph component expects.
        documents.forEach((doc: any) => {
            // Check the scale
            console.log("Old scale: ", doc.scale);
            console.log("All doc: ", doc);
            if (doc.scale.toUpperCase() === "TEXT") {
                doc.scale = "TEXT";
            }
            else if (doc.scale.toUpperCase() === "CONCEPT") {
                doc.scale = "CONCEPT";
            }
            else if (doc.scale.toUpperCase() === "ARCHITECTURAL") {
                doc.scale = "ARCHITECTURAL";
            }
            else if (doc.scale.toUpperCase() === "BLUEPRINT/MATERIAL EFFECTS") {
                doc.scale = "BLUEPRINT/MATERIAL EFFECTS";
            }

            if (!doc.scale || !scaleMapping[doc.scale as keyof typeof scaleMapping]) {
                console.log("Invalid scale");
                doc.scale = "default";
            }

            // Check the year
            if (doc.date) {
                const date = new Date(doc.date);
                if (!isNaN(date.getTime())) {
                    // console.log("The year is: ", date.getFullYear());
                    doc.year = date.getFullYear();
                } else {
                    console.log("Invalid date format");
                    doc.year = 2000; // Default year for testing
                }
            } else {
                console.log(`No date provided, the document ${doc.id} will not be displayed`);
                doc.year = null;
            }
            console.log("New scale: ", doc.scale);
            console.log("New date: ", doc.year);

            console.log("The type of the document is: ", doc.type);
            // Check the type of the document
            switch (doc.type.toUpperCase()) {
                case "AGREEMENT":
                    doc.image = AgreementIcon;
                    break;
                case "CONFLICT":
                    doc.image = ConflictIcon;
                    break;
                case "CONSULTATION":
                    doc.image = ConsultationIcon;
                    break;
                case "PRESCRIPTIVE_DOC":
                    doc.image = PrescriptiveDocIcon;
                    break;
                case "INFORMATIVE_DOC":
                    doc.image = InformativeDocIcon;
                    break;
                case "DESIGN_DOC":
                    doc.image = DesignDocIcon;
                    break;
                case "TECHNICAL_DOC":
                    doc.image = TechnicalDocIcon;
                    break;
                case "MATERIAL_EFFECTS":
                    doc.image = MaterialEffectsIcon;
                    break;
                default:
                    doc.image = ErrorImage;
                    break;
            }

            console.log("The image of the node" + doc.title + " is : ", doc.image);

            // Check the connections
            if (doc.connections && doc.connections.length > 0) {
                doc.connections.forEach((connection: any) => {
                    console.log("Connection: ", connection)
                    console.log("Target: ", connection.document)
                    console.log("Source: ", doc.id)
                    connections.push({
                        // state.graph.edges.push({
                        from: doc.id,
                        to: connection.document,
                        color: "#000000"
                    });
                });
            }
        });

        const nodes_documents = documents
            .filter((doc: any) => doc.year !== null) // Filter documents with defined year
            .map((doc: any) => ({
                id: doc.id,
                shape: "image",
                // image: errorImage,
                image: doc.image,
                brokenImage: ErrorImage,
                color: randomColor(),
                year: doc.year,
                scale: doc.scale,
            }))
            .map(node => ({
                ...node,
                x: (node.year - 2000) * 1000, // Mapping the year
                y: scaleMapping[node.scale as keyof typeof scaleMapping], // Mapping the scale
            }));


        nodes_documents.forEach((node, index) => {
            const overlappingNode = occupiedPositions.find((pos: any) => pos.x === node.x && pos.y === node.y);
            if (overlappingNode) {
                // TODO: decide if the offset should be only on the x axis or also on the y axis
                const offsetX = Math.floor(Math.random() * 100) + 100; // Random offset between 100 and 200
                const offsetY = Math.floor(Math.random() * 20) + 20; // Random offset between 20 and 40
                node.x += offsetX;  // Add offset to x position
                // node.y += offsetY; // Add offset to y position
            }
            // occupiedPositions.push({ x: node.x, y: node.y });   // ?? I don't think this is needed.
        });

        const allNodes = [...nodes_documents, ...label_style, ...label_year];
        allNodes.forEach((node) => {
            const overlappingNode = occupiedPositions.find((pos: any) => pos.x === node.x && pos.y === node.y);
            if (overlappingNode) {
                const offsetX = Math.floor(Math.random() * 100) + 100; // Random offset between 100 and 200
                const offsetY = Math.floor(Math.random() * 20) + 20; // Random offset between 20 and 40
                node.x += offsetX;  // Add offset to x position
                // node.y += offsetY; // Add offset to y position
            }
            occupiedPositions.push({ x: node.x, y: node.y });
        });


        setState({
            graph: {
                nodes: allNodes,
                edges: connections
            },
        })
    }, [documents]);



    const occupiedPositions = [] as any;

    const label_style = [
        { id: "label_text", label: "Text", color: "#e0df41", scale: "TEXT" },
        { id: "label_concept", label: "Concept", color: "#e0df41", scale: "CONCEPT" },
        { id: "label_architectural", label: "Architectural style", color: "#e0df41", scale: "ARCHITECTURAL" },
        { id: "label_blueprint", label: "Blueprint/effects", color: "#e0df41", scale: "BLUEPRINT/MATERIAL EFFECTS" },
    ].map(node => ({
        ...node,
        //x: (6) * 1000, // Place the label on the left side of the graph
        x: (minYear - 2000 - 1) * 1000, // Place the label on the left side of the graph, it depends on the minYear
        y: scaleMapping[node.scale as keyof typeof scaleMapping], // Mapping the scale
        shape: "box",
        font: LABEL_FONT
    }
    ));



    // const endYear = maxYear + 2; // Add 2 years to the max year to make space for the label
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
        console.log(`Year ${year} has x = ${label_year.find(node => node.year === year)?.x}`);
    }


    const networkRef = useRef<any>(null);




    useEffect(() => {
        const network = networkRef.current; // Get the network object from the ref
        if (network) {  // if the network is available then...
            network.fit({
                // Filter only the node that are in the current year. In this way the graph will be centered on the current year at launch.
                nodes: state.graph.nodes.filter((node: any) => {
                    const currentYear = new Date().getFullYear();
                    // console.log(`Node year: ${node.year}, Current year: ${currentYear}`);
                    return node.year === currentYear;
                }).map((node: any) => node.id),
                animation: false
            });
            network.moveTo({ scale: 0.5 })  // Set the initial zoom level
        }
    }, [state.graph.nodes]);

    let lastPosition = null;
    const max_zoom = 2;
    const min_zoom = 0.5;



    return (
        <div style={{ height: "100vh" }} className="grid-background">
            {state.graph && (
                <Graph
                    graph={state.graph}
                    options={options}
                    style={{ height: "100%" }}
                    getNetwork={network => {    // Call the methods inside the Graph component
                        // network.moveTo({ position: { x: FIT_X_VIEW, y: FIT_Y_VIEW }, scale: 0.5 });
                        networkRef.current = network;
                        // Limit the zoom
                        // network.on("zoom", (params) => {
                        //     if (params.scale < 0.1) {
                        //         network.moveTo({ scale: 0.1 });
                        //     } else if (params.scale > 2) {
                        //         network.moveTo({ scale: 2 });
                        //     }
                        // });

                        network.on("zoom", function (params) {
                            if (params.scale < min_zoom || params.scale > max_zoom) { // adjust this value according to your requirement
                                network.moveTo({
                                    position: lastPosition, // use the last position before zoom limit
                                    scale: params.scale > max_zoom ? max_zoom : min_zoom // this scale prevents zooming out beyond the desired limit
                                });
                            } else {
                                // store the current position as the last position before zoom limit
                                lastPosition = network.getViewPosition();
                            }
                        });
                        // on pan, store the current position
                        network.on("dragEnd", function () {
                            lastPosition = network.getViewPosition();
                        });
                    }}
                />
            )}
        </div>
    );

};

export default Diagram;