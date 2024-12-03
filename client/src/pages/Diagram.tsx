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
import ButtonRounded from "../components/atoms/button/ButtonRounded";
import { useNavigate } from 'react-router-dom';
import "vis-network/styles/vis-network.css";
import {
    swedishFlagBlue,
    swedishFlagYellow,
} from '../utils/colors';
import { IDocument } from "../utils/interfaces/document.interface.js";
import DocumentDetailsModal from '../components/organisms/modals/DocumentDetailsModal';
import Modal from 'react-modal';

const LABEL_FONT = { size: 25, color: "#000000" };
const YEAR_SPACING = 500;
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
        dragNodes: true, // Enable dragging nodes (improves the readability)
        dragView: true, // Enable dragging of the view
        zoomView: true, // Enable zooming of the view
        navigationButtons: true, // Enable navigation buttons
    },

};

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        margin: '0 auto',
        transform: 'translate(-50%, -50%)',
        width: '90%',
    },
    overlay: { zIndex: 1000 },
};

const graphBEInfo = await API.getGraphInfo();

const randomColor = () => {
    const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${red}${green}${blue}`;
}

const scaleMapping = {
    "TEXT": 200,
    "CONCEPT": 400,
    "ARCHITECTURAL": 600,
    "BLUEPRINT/MATERIAL EFFECTS": 800,
    "default": 50, // Valore di default per testing!
};

const Diagram = () => {
    const navigate = useNavigate();
    const [selectedDocument, setSelectedDocument] = useState<IDocument[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [originalDocuments, setOriginalDocuments] = useState<any[]>([]);
    const [state, setState] = useState({
        graph: {
            nodes: [] as any[],
            edges: [] as { from: any; to: any; color: string }[]
        }
    });

    const label_year = [] as any[];
    const minYear = graphBEInfo.minYear;
    const maxYear = graphBEInfo.maxYear;

    const openModal = (document: IDocument) => {
        // Search in the original documents and show the document in the modal 
        const sdocument = originalDocuments.find((doc) => doc.id === document.id);
        if (sdocument) {
            setSelectedDocument([sdocument]);
            setIsModalOpen(true);
        }
    };

    const handleNodeClick = (document: IDocument) => {
        openModal(document);
    }


    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const documents = await API.getDocuments();
                setDocuments(documents);
                setOriginalDocuments(documents)
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
                doc.scale = "default";
            }

            // Check the year
            if (doc.date) {
                const date = new Date(doc.date);
                if (!isNaN(date.getTime())) {
                    doc.year = date.getFullYear();
                }
            } else {
                console.log(`No date provided, the document ${doc.id} will not be displayed`);
                doc.year = null;    // If the date is not provided, the document will not be displayed
            }

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

            // Check the connections
            let connectionColor = "#000000";
            let dashesType = false as boolean | number[] | undefined;   // In case of an array the first element is the lenght of the dash, the second is the space between the dashes

            if (doc.connections && doc.connections.length > 0) {
                doc.connections.forEach((connection: any) => {
                    // Modify the style of the connections according to their type
                    console.log(`Connection type: ${connection.type}`);
                    if (connection.type.toUpperCase() === "DIRECT") {
                        console.log("Direct connection");
                        // connectionColor = "#00FF00";
                    } else if (connection.type.toUpperCase() === "COLLATERAL") {
                        // connectionColor = "#FF0000";
                        dashesType = [2, 2]; // This is good for collateral connections
                    } else if (connection.type.toUpperCase() === "PROJECTION") {
                        // connectionColor = "#FF00FF";
                        dashesType = [1, 3];
                    } else if (connection.type.toUpperCase() === "UPDATE") {
                        // connectionColor = "#0000FF";
                        dashesType = [2, 1, 1];
                    }


                    connections.push({
                        ...connection,
                        from: doc.id,
                        to: connection.document,
                        color: connectionColor,
                        dashes: dashesType,
                    });
                });
            }
        });

        const nodes_documents = documents
            .filter((doc: any) => doc.year !== null) // Filter documents with defined year
            .map((doc: any) => ({
                id: doc.id,
                shape: "image",
                image: doc.image,
                brokenImage: ErrorImage,
                color: randomColor(),
                year: doc.year,
                scale: doc.scale,
            }))
            .map(node => ({
                ...node,
                x: (node.year - 2000) * YEAR_SPACING, // Mapping the year
                y: scaleMapping[node.scale as keyof typeof scaleMapping], // Mapping the scale

            }));


        nodes_documents.forEach((node, index) => {
            const overlappingNode = occupiedPositions.find((pos: any) => pos.x === node.x && pos.y === node.y);
            if (overlappingNode) {
                const offsetX = Math.floor(Math.random() * 100) + 100; // Random offset between 100 and 200
                node.x += offsetX;  // Add offset to x position
            }
        });

        const allNodes = [...nodes_documents, ...label_style, ...label_year];
        allNodes.forEach((node) => {
            const overlappingNode = occupiedPositions.find((pos: any) => pos.x === node.x && pos.y === node.y);
            if (overlappingNode) {
                const offsetX = Math.floor(Math.random() * 100) + 100; // Random offset between 100 and 200
                const offsetY = Math.floor(Math.random() * 30) + 20; // Random offset between 20 and 50
                node.x += offsetX;  // Add offset to x position
                node.y += offsetY; // Add offset to y position
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
        { id: "label_text", label: "Text", scale: "TEXT" },
        { id: "label_concept", label: "Concept", scale: "CONCEPT" },
        { id: "label_architectural", label: "Architectural style", scale: "ARCHITECTURAL" },
        { id: "label_blueprint", label: "Blueprint/effects", scale: "BLUEPRINT/MATERIAL EFFECTS" },
    ].map(node => ({
        ...node,
        color: swedishFlagBlue,
        x: (minYear - 2000 - 1) * YEAR_SPACING, // Place the label on the left side of the graph, it depends on the minYear
        y: scaleMapping[node.scale as keyof typeof scaleMapping], // Mapping the scale
        shape: "box",
        font: { ...LABEL_FONT, color: "#FFFFFF" },
    }));



    for (let year = minYear; year <= maxYear; year++) {
        label_year.push({
            id: `label_${year}`,
            label: `${year}`,
            color: swedishFlagYellow,
            year: year,
            x: (year - 2000) * YEAR_SPACING, // Mapping the year
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
                    return node.year === currentYear;
                }).map((node: any) => node.id),
                animation: false
            });
            network.moveTo({ scale: 0.5 })  // Set the initial zoom level
        }
    }, [state.graph.nodes]);

    let lastPosition = null;
    const max_zoom = 2;
    const min_zoom = 0.1;

    const handleNodeClickButton = () => {
        console.log("Button clicked!");
        navigate('/');
    }


    return (
        <div style={{ height: "100vh", position: "relative" }} className="grid-background">
            {/* Button to navigate to the home */}
            <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                <ButtonRounded
                    variant="filled"
                    text="Go to homepage"
                    className="bg-black pr-4 pl-4 d-flex align-items-center"
                    onClick={handleNodeClickButton}

                ></ButtonRounded>
            </div>



            {state.graph && (
                <Graph
                    graph={state.graph}
                    options={options}
                    events={{
                        selectNode: function (event) {
                            const { nodes } = event;
                            const selectedNode = state.graph.nodes.find(node => node.id === nodes[0]);
                            if (selectedNode) {
                                handleNodeClick(selectedNode);
                            }
                        }
                    }}
                    style={{ height: "100%" }} getNetwork={network => {    // Call the methods inside the Graph component
                        // network.moveTo({ position: { x: FIT_X_VIEW, y: FIT_Y_VIEW }, scale: 0.5 });
                        networkRef.current = network;

                        network.on("zoom", function (params) {
                            if (params.scale < min_zoom || params.scale > max_zoom) {
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
            <Modal
                style={modalStyles}
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            >
                <DocumentDetailsModal
                    document={selectedDocument[0]}
                />
            </Modal>
        </div>


    );

};

export default Diagram;